const DEFAULTS = {
    inactiveZone: 0,
    proximity: 80,
    spread: 26,
    borderWidth: 2,
    blur: 2,
    smoothing: 0.2
};

const glowElements = new Set();
const glowState = new WeakMap();

let listenersBound = false;
let frameId = 0;
let lastX = 0;
let lastY = 0;
let hasPointer = false;

const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function parseNumber(value, fallback) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
}

function registerGlowCard(element) {
    if (!element || element.dataset.glowBound === "1") return;
    if (element.dataset.glowDisabled === "true") return;

    element.dataset.glowBound = "1";
    if (!element.classList.contains("glow-card")) {
        element.classList.add("glow-card");
    }

    const inactiveZone = parseNumber(element.dataset.glowInactive, DEFAULTS.inactiveZone);
    const proximity = parseNumber(element.dataset.glowProximity, DEFAULTS.proximity);
    const spread = parseNumber(element.dataset.glowSpread, DEFAULTS.spread);
    const borderWidth = parseNumber(element.dataset.glowBorder, DEFAULTS.borderWidth);
    const blur = parseNumber(element.dataset.glowBlur, DEFAULTS.blur);

    element.style.setProperty("--glow-spread", String(spread));
    element.style.setProperty("--glow-border-width", `${borderWidth}px`);
    element.style.setProperty("--glow-blur", `${blur}px`);

    if (element.dataset.glowVariant === "white") {
        element.classList.add("glow-variant-white");
    }

    const onPointerEnter = (event) => {
        hasPointer = true;
        lastX = event.clientX;
        lastY = event.clientY;
        element.style.setProperty("--glow-active", "1");
        scheduleUpdate();
    };

    const onPointerLeave = () => {
        element.style.removeProperty("--glow-active");
    };

    element.addEventListener("pointerenter", onPointerEnter, { passive: true });
    element.addEventListener("pointerleave", onPointerLeave, { passive: true });

    glowElements.add(element);
    glowState.set(element, {
        angle: 0,
        rect: null,
        inactiveZone,
        proximity
    });
}

function collectGlowCards(scope) {
    const root = scope && scope.querySelectorAll ? scope : document;
    const candidates = root.querySelectorAll(".glass-card:not(.glow-skip), .glow-card:not(.glow-skip)");

    candidates.forEach((element) => {
        registerGlowCard(element);
    });
}

function invalidateRects() {
    glowElements.forEach((element) => {
        const state = glowState.get(element);
        if (state) {
            state.rect = null;
        }
    });
}

function scheduleUpdate() {
    if (frameId) return;
    frameId = window.requestAnimationFrame(updateGlow);
}

function updateGlow() {
    frameId = 0;
    if (!hasPointer) return;

    glowElements.forEach((element) => {
        if (!element.isConnected) {
            glowElements.delete(element);
            glowState.delete(element);
            return;
        }

        const state = glowState.get(element);
        if (!state) return;

        if (!state.rect) {
            state.rect = element.getBoundingClientRect();
        }

        const rect = state.rect;
        const centerX = rect.left + rect.width * 0.5;
        const centerY = rect.top + rect.height * 0.5;
        const distance = Math.hypot(lastX - centerX, lastY - centerY);
        const inactiveRadius = 0.5 * Math.min(rect.width, rect.height) * state.inactiveZone;

        if (state.inactiveZone > 0 && distance < inactiveRadius) {
            element.style.removeProperty("--glow-active");
            return;
        }

        const isActive =
            lastX > rect.left - state.proximity &&
            lastX < rect.right + state.proximity &&
            lastY > rect.top - state.proximity &&
            lastY < rect.bottom + state.proximity;

        if (!isActive) {
            element.style.removeProperty("--glow-active");
            return;
        }

        element.style.setProperty("--glow-active", "1");

        const targetAngle = (Math.atan2(lastY - centerY, lastX - centerX) * 180) / Math.PI + 90;
        const angleDiff = ((targetAngle - state.angle + 180) % 360) - 180;
        const nextAngle = prefersReducedMotion
            ? targetAngle
            : state.angle + angleDiff * DEFAULTS.smoothing;

        state.angle = nextAngle;
        element.style.setProperty("--glow-start", nextAngle.toFixed(2));
    });
}

function bindListeners() {
    if (listenersBound) return;
    listenersBound = true;

    window.addEventListener(
        "pointermove",
        (event) => {
            hasPointer = true;
            lastX = event.clientX;
            lastY = event.clientY;
            scheduleUpdate();
        },
        { passive: true }
    );

    window.addEventListener(
        "scroll",
        () => {
            if (!hasPointer) return;
            invalidateRects();
            scheduleUpdate();
        },
        { passive: true }
    );

    window.addEventListener(
        "resize",
        () => {
            invalidateRects();
            scheduleUpdate();
        },
        { passive: true }
    );
}

export function initGlowingEffects(scope = document) {
    collectGlowCards(scope);
    bindListeners();
}
