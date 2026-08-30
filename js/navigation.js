/* Navegacion SPA basica: una vista principal a la vez. */
(function () {
    const sections = Array.from(document.querySelectorAll("[data-spa-section]"));
    const routes = Array.from(document.querySelectorAll("[data-route]"));
    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function showSection(sectionId, updateHistory = true, moveFocus = true) {
        const target = document.getElementById(sectionId);

        if (!target || !target.matches("[data-spa-section]")) {
            showSection("inicio", updateHistory, moveFocus);
            return;
        }

        sections.forEach((section) => {
            const isActive = section === target;
            section.classList.toggle("hidden", !isActive);
            section.setAttribute("aria-hidden", String(!isActive));
        });

        routes.forEach((route) => {
            const isActive = route.dataset.route === sectionId;
            route.classList.toggle("active", isActive);
            if (!route.matches(".nav-link")) return;
            if (isActive) {
                route.setAttribute("aria-current", "page");
            } else {
                route.removeAttribute("aria-current");
            }
        });

        if (updateHistory && window.location.hash !== `#${sectionId}`) {
            window.history.pushState({ sectionId }, "", `#${sectionId}`);
        }

        if (navLinks) navLinks.classList.remove("open");
        if (menuToggle) menuToggle.setAttribute("aria-expanded", "false");

        window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });

        if (moveFocus) {
            const heading = target.querySelector("h1, h2");
            if (heading) {
                heading.setAttribute("tabindex", "-1");
                window.requestAnimationFrame(() => heading.focus({ preventScroll: true }));
                heading.addEventListener("blur", () => heading.removeAttribute("tabindex"), { once: true });
            }
        }
    }

    routes.forEach((route) => {
        route.addEventListener("click", (event) => {
            event.preventDefault();
            showSection(route.dataset.route);
        });
    });

    window.addEventListener("popstate", () => {
        showSection(window.location.hash.slice(1) || "inicio", false);
    });

    window.addEventListener("hashchange", () => {
        showSection(window.location.hash.slice(1) || "inicio", false);
    });

    showSection(window.location.hash.slice(1) || "inicio", false, false);
})();
