// ==========================================================================
// FERREWEB - CYBERNETIC AMBIENT CANVAS
// Capa dinámica con malla cibernética suave, ondas fluorescentes y partículas de luz
// ==========================================================================

export class AmbientBackground {
    constructor(canvasId = "ambientCanvas") {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext("2d", { alpha: true });
        this.particles = [];
        this.particleCount = 35;
        this.mouse = { x: -1000, y: -1000, targetX: -1000, targetY: -1000, active: false };
        this.reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        this.animationId = null;
        this.width = 0;
        this.height = 0;
        this.dpr = Math.min(window.devicePixelRatio || 1, 2);

        this.init();
    }

    init() {
        this.resize();
        this.createParticles();
        this.bindEvents();

        if (!this.reducedMotion) {
            this.animate();
        } else {
            this.renderStatic();
        }
    }

    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.canvas.width = this.width * this.dpr;
        this.canvas.height = this.height * this.dpr;
        this.canvas.style.width = `${this.width}px`;
        this.canvas.style.height = `${this.height}px`;

        this.ctx.scale(this.dpr, this.dpr);
    }

    createParticles() {
        this.particles = [];
        const count = Math.floor(Math.min(this.width / 35, this.particleCount));

        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                size: Math.random() * 2.5 + 1.2,
                speedX: (Math.random() - 0.5) * 0.4,
                speedY: (Math.random() - 0.5) * 0.4 - 0.2, // Flotación sutil
                color: Math.random() > 0.45 ? "rgba(0, 255, 136, " : "rgba(251, 191, 36, ", // Verde Eléctrico o Amarillo Neón
                opacity: Math.random() * 0.45 + 0.2,
                pulseSpeed: Math.random() * 0.025 + 0.015,
                pulseAngle: Math.random() * Math.PI * 2
            });
        }
    }

    bindEvents() {
        window.addEventListener("resize", () => {
            this.resize();
            this.createParticles();
            if (this.reducedMotion) this.renderStatic();
        }, { passive: true });

        window.addEventListener("pointermove", (e) => {
            this.mouse.active = true;
            this.mouse.targetX = e.clientX;
            this.mouse.targetY = e.clientY;
        }, { passive: true });

        window.addEventListener("pointerleave", () => {
            this.mouse.active = false;
        }, { passive: true });

        const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
        mediaQuery.addEventListener("change", (e) => {
            this.reducedMotion = e.matches;
            if (this.reducedMotion) {
                if (this.animationId) cancelAnimationFrame(this.animationId);
                this.renderStatic();
            } else {
                this.animate();
            }
        });
    }

    renderStatic() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.drawAmbientGlows(0);
    }

    drawAmbientGlows(time) {
        // Halo verde eléctrico superior izquierdo
        const glow1 = this.ctx.createRadialGradient(
            this.width * 0.2 + Math.sin(time * 0.0006) * 50,
            this.height * 0.25 + Math.cos(time * 0.0006) * 40,
            0,
            this.width * 0.2,
            this.height * 0.25,
            Math.min(this.width * 0.45, 520)
        );
        glow1.addColorStop(0, "rgba(0, 255, 136, 0.09)");
        glow1.addColorStop(0.5, "rgba(6, 95, 70, 0.04)");
        glow1.addColorStop(1, "rgba(2, 27, 18, 0)");

        this.ctx.fillStyle = glow1;
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Halo amarillo fluorescente inferior derecho
        const glow2 = this.ctx.createRadialGradient(
            this.width * 0.82 + Math.cos(time * 0.0007) * 60,
            this.height * 0.72 + Math.sin(time * 0.0007) * 50,
            0,
            this.width * 0.82,
            this.height * 0.72,
            Math.min(this.width * 0.5, 580)
        );
        glow2.addColorStop(0, "rgba(255, 230, 0, 0.08)");
        glow2.addColorStop(0.5, "rgba(251, 191, 36, 0.03)");
        glow2.addColorStop(1, "rgba(2, 27, 18, 0)");

        this.ctx.fillStyle = glow2;
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Halo interactivo con el cursor del ratón
        if (this.mouse.active && this.mouse.x > 0 && this.mouse.y > 0) {
            const mouseGlow = this.ctx.createRadialGradient(
                this.mouse.x,
                this.mouse.y,
                0,
                this.mouse.x,
                this.mouse.y,
                220
            );
            mouseGlow.addColorStop(0, "rgba(0, 255, 136, 0.12)");
            mouseGlow.addColorStop(0.4, "rgba(255, 230, 0, 0.04)");
            mouseGlow.addColorStop(1, "rgba(2, 27, 18, 0)");

            this.ctx.fillStyle = mouseGlow;
            this.ctx.fillRect(0, 0, this.width, this.height);
        }
    }

    drawCyberGrid(time) {
        const step = 48;
        this.ctx.strokeStyle = "rgba(0, 255, 136, 0.035)";
        this.ctx.lineWidth = 1;

        const offsetX = (time * 0.015) % step;
        const offsetY = (time * 0.015) % step;

        this.ctx.beginPath();
        for (let x = offsetX; x < this.width; x += step) {
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.height);
        }
        for (let y = offsetY; y < this.height; y += step) {
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.width, y);
        }
        this.ctx.stroke();
    }

    drawParticles(time) {
        for (let p of this.particles) {
            p.x += p.speedX;
            p.y += p.speedY;

            // Reacción sutil al mouse
            if (this.mouse.active) {
                const dx = this.mouse.x - p.x;
                const dy = this.mouse.y - p.y;
                const dist = Math.hypot(dx, dy);
                if (dist < 140 && dist > 1) {
                    const force = (140 - dist) / 140;
                    p.x -= (dx / dist) * force * 1.5;
                    p.y -= (dy / dist) * force * 1.5;
                }
            }

            // Wrapping suave
            if (p.x < -10) p.x = this.width + 10;
            if (p.x > this.width + 10) p.x = -10;
            if (p.y < -10) p.y = this.height + 10;
            if (p.y > this.height + 10) p.y = -10;

            p.pulseAngle += p.pulseSpeed;
            const currentOpacity = p.opacity + Math.sin(p.pulseAngle) * 0.15;
            const fillStyle = `${p.color}${Math.max(0.08, currentOpacity)})`;

            this.ctx.fillStyle = fillStyle;
            this.ctx.shadowColor = p.color.replace("rgba", "rgb").split(",").slice(0, 3).join(",") + ")";
            this.ctx.shadowBlur = 6;

            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fill();
        }
        this.ctx.shadowBlur = 0;
    }

    animate(time = 0) {
        if (this.mouse.active) {
            this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.12;
            this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.12;
        }

        this.ctx.clearRect(0, 0, this.width, this.height);
        this.drawAmbientGlows(time);
        this.drawCyberGrid(time);
        this.drawParticles(time);

        this.animationId = requestAnimationFrame((t) => this.animate(t));
    }
}
