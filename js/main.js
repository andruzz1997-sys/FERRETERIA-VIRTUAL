// ==========================================================================
// FERREWEB - SPA CONTROL & ADVANCED SENA VALIDATIONS ENGINE (ESM)
// ==========================================================================

import { AmbientBackground } from "./ambient-canvas.js";
import { getProductGraphic } from "./product-graphics.js";

// ==========================================================================
// 1. PRODUCT DATA & CONSTANTS
// ==========================================================================
const DEFAULT_PRODUCTS = [
    {
        id: 1,
        name: "Taladro Inalámbrico 20V Brushless",
        category: "Herramientas",
        price: 429900,
        icon: "TL",
        description: "Motor sin escobillas de alto rendimiento con 2 baterías de litio, cargador rápido y maletín.",
        rating: 4.9,
        reviewsCount: 38,
        stock: 14,
        badge: "Más Vendido",
        specs: {
            "Voltaje": "20V Max",
            "Mandril": "1/2 pulgada metálico",
            "Torque Máx.": "65 Nm",
            "Velocidad": "0-500 / 0-1800 RPM"
        }
    },
    {
        id: 2,
        name: "Martillo Antiimpacto Forjado 20oz",
        category: "Herramientas",
        price: 79900,
        icon: "MT",
        description: "Cabeza de acero al carbono forjada en una sola pieza con mango ergonómico reductor de vibraciones.",
        rating: 4.8,
        reviewsCount: 52,
        stock: 28,
        badge: "Profesional",
        specs: {
            "Peso": "20 onzas (567g)",
            "Material": "Acero forjado",
            "Mango": "Grip antideslizante",
            "Uña": "Curva sacaclavos"
        }
    },
    {
        id: 3,
        name: "Sierra Circular Industrial 7 1/4\"",
        category: "Herramientas",
        price: 519900,
        icon: "SC",
        description: "Potente motor de 1800W con guía láser de corte, disco de carburo de tungsteno y base de magnesio.",
        rating: 4.9,
        reviewsCount: 24,
        stock: 8,
        badge: "Destacado",
        specs: {
            "Potencia": "1800 Watts",
            "Diámetro disco": "7-1/4\" (184mm)",
            "Corte a 90°": "65 mm",
            "Guía": "Láser de precisión"
        }
    },
    {
        id: 4,
        name: "Cemento Gris Estructural x 50kg",
        category: "Materiales",
        price: 38900,
        icon: "CM",
        description: "Cemento tipo portland de alta resistencia inicial y fraguado uniforme para fundiciones y estructuras.",
        rating: 5.0,
        reviewsCount: 110,
        stock: 85,
        badge: "Obra Pesada",
        specs: {
            "Presentación": "Bulto 50 kg",
            "Tipo": "Estructural / Portland",
            "Fraguado": "Controlado",
            "Uso": "Vigas, losas y muros"
        }
    },
    {
        id: 5,
        name: "Arena Lavada de Río x Bulto 40kg",
        category: "Materiales",
        price: 17900,
        icon: "AR",
        description: "Arena seleccionada y lavada sin impurezas orgánicas, granulometría ideal para concretos finos y pegas.",
        rating: 4.7,
        reviewsCount: 65,
        stock: 120,
        badge: "Básico",
        specs: {
            "Peso": "40 kg aprox.",
            "Origen": "Río clasificada",
            "Lavado": "100% libre de arcillas",
            "Aplicación": "Morteros y concretos"
        }
    },
    {
        id: 6,
        name: "Juego de Brocas Titanio x 15 Piezas",
        category: "Accesorios",
        price: 56900,
        icon: "BR",
        description: "Set completo para perforación en concreto reforzado, metales ferrosos y maderas duras con estuche rígido.",
        rating: 4.8,
        reviewsCount: 41,
        stock: 35,
        badge: "Kit Completo",
        specs: {
            "Piezas": "15 brocas surtidas",
            "Recubrimiento": "Nitruro de titanio",
            "Vástago": "Cilíndrico / Hexagonal",
            "Estuche": "Plástico anti-caídas"
        }
    },
    {
        id: 7,
        name: "Tubería Presión PVC 1/2\" x 6m",
        category: "Plomería",
        price: 23900,
        icon: "PV",
        description: "Tubo sanitario y de agua potable con resistencia a 500 PSI, interior ultra liso anti-sedimentos.",
        rating: 4.9,
        reviewsCount: 30,
        stock: 45,
        badge: "Norma NTC",
        specs: {
            "Diámetro": "1/2 pulgada",
            "Longitud": "6 metros",
            "Presión": "RDE 9 / 500 PSI",
            "Color": "Blanco / Sanitario"
        }
    },
    {
        id: 8,
        name: "Llave Grifa Ajustable Heavy Duty 12\"",
        category: "Plomería",
        price: 68900,
        icon: "LL",
        description: "Cuerpo de hierro nodular con mordaza autoajustable y resorte interno para torque máximo en tuberías.",
        rating: 4.8,
        reviewsCount: 19,
        stock: 18,
        badge: "Plomería",
        specs: {
            "Tamaño": "12 pulgadas (300mm)",
            "Apertura máx": "2 pulgadas",
            "Mordaza": "Dientes templados",
            "Acabado": "Anticorrosivo"
        }
    },
    {
        id: 9,
        name: "Pintura Interior Blanco Nieve 1 Galón",
        category: "Pinturas",
        price: 104900,
        icon: "PT",
        description: "Pintura vinílica tipo 1 lavable de máxima blancura, antihongos y bajo olor con cubrimiento en dos manos.",
        rating: 4.9,
        reviewsCount: 47,
        stock: 22,
        badge: "Tipo 1 Lavable",
        specs: {
            "Volumen": "1 Galón (3.785 L)",
            "Rendimiento": "35-40 m² por galón",
            "Acabado": "Mate sedoso",
            "Tiempo secado": "2 horas"
        }
    },
    {
        id: 10,
        name: "Rodillo Profesional Microfibra 9\"",
        category: "Pinturas",
        price: 22900,
        icon: "RD",
        description: "Rodillo de alta absorción con felpa anti-goteo y mango ergonómico roscado para extensión.",
        rating: 4.6,
        reviewsCount: 33,
        stock: 60,
        badge: "Anti-goteo",
        specs: {
            "Ancho": "9 pulgadas (23cm)",
            "Felpa": "Microfibra 3/8\"",
            "Núcleo": "Polipropileno reforzado",
            "Varilla": "Cromada 6mm"
        }
    },
    {
        id: 11,
        name: "Guantes de Carnaza y Vaqueta Reforzados",
        category: "Seguridad",
        price: 34900,
        icon: "GU",
        description: "Guantes de protección con palma doble capa de vaqueta flexible y dorso transpirable para soldadura y carga.",
        rating: 4.9,
        reviewsCount: 88,
        stock: 90,
        badge: "Protección Total",
        specs: {
            "Material": "Cuero de vaqueta y carnaza",
            "Talla": "Estándar 10",
            "Costura": "Hilo de kevlar reforzado",
            "Uso": "Obras, soldadura y carga"
        }
    },
    {
        id: 12,
        name: "Casco de Seguridad Industrial Tipo 1",
        category: "Seguridad",
        price: 59900,
        icon: "CS",
        description: "Casco dieléctrico de polietileno de alta densidad con tafilete de ajuste ratchet de 4 puntos.",
        rating: 5.0,
        reviewsCount: 72,
        stock: 40,
        badge: "Certificado ANSI",
        specs: {
            "Norma": "ANSI Z89.1 / NTC 1523",
            "Clase": "E (Dieléctrico hasta 20.000V)",
            "Ajuste": "Suspensión con Ratchet",
            "Color": "Amarillo seguridad"
        }
    }
];

const COP_FORMATTER = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0
});

const FREE_SHIPPING_THRESHOLD = 350000;
const ADMIN_CREDENTIALS = Object.freeze({ username: "Admin", password: "admin123" });
const PAYMENT_LABELS = Object.freeze({
    nequi: "Nequi",
    daviplata: "Daviplata",
    efecty: "Efecty",
    card: "Tarjeta de crédito/débito",
    pse: "PSE (débito bancario)",
    cash: "Pago contraentrega"
});

// ==========================================================================
// 2. ESTADO GLOBAL DE LA APLICACIÓN
// ==========================================================================
let products = normalizeProducts(loadFromStorage("ferreweb-products", DEFAULT_PRODUCTS));
let cart = normalizeCart(loadFromStorage("ferreweb-cart", []));
let users = normalizeUsers(loadFromStorage("ferreweb-users", []));
let sessionUser = normalizeSession(loadFromStorage("ferreweb-session", null));
let quoteItems = [];
let lastCartCount = cart.reduce((sum, line) => sum + line.quantity, 0);
let promoMessage = String(loadFromStorage("ferreweb-promo-message", "") || "").trim();
let adminAuthenticated = loadAdminSession();
let lastDialogTrigger = null;

// ==========================================================================
// 3. INICIALIZACIÓN
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
    initApp();
});

if (document.readyState === "complete" || document.readyState === "interactive") {
    initApp();
}

function initApp() {
    if (window._ferrewebInitialized) return;
    window._ferrewebInitialized = true;

    new AmbientBackground("ambientCanvas");
    initSPARouting();
    initMenu();
    initCatalogModule();
    initAuthModule();
    initGlobalPromo();
    initAdminModule();
    initCotizadorModule();
    initCheckoutModuleV2();
    initCartModule();
    updateAuthUI();
}

// ==========================================================================
// 4. ARQUITECTURA SPA (SINGLE PAGE APPLICATION)
// ==========================================================================
function initSPARouting() {
    const sections = Array.from(document.querySelectorAll("[data-spa-section]"));
    const routes = Array.from(document.querySelectorAll("[data-route]"));

    function navigateTo(routeId, updateHistory = true) {
        const targetId = routeId.replace("#", "") || "inicio";
        const targetSection = document.getElementById(targetId);

        if (!targetSection) {
            navigateTo("inicio", updateHistory);
            return;
        }

        sections.forEach((sec) => {
            const isActive = sec.id === targetId;
            sec.classList.toggle("hidden", !isActive);
            sec.setAttribute("aria-hidden", String(!isActive));
        });

        routes.forEach((route) => {
            const isActive = route.dataset.route === targetId;
            route.classList.toggle("active", isActive);
            if (route.classList.contains("nav-link")) {
                if (isActive) route.setAttribute("aria-current", "page");
                else route.removeAttribute("aria-current");
            }
        });

        if (updateHistory && window.location.hash !== `#${targetId}`) {
            window.history.pushState({ routeId: targetId }, "", `#${targetId}`);
        }

        window.scrollTo({ top: 0, behavior: "smooth" });

        if (updateHistory) {
            const heading = targetSection.querySelector("h1, h2");
            if (heading) {
                heading.setAttribute("tabindex", "-1");
                window.requestAnimationFrame(() => heading.focus({ preventScroll: true }));
                heading.addEventListener("blur", () => heading.removeAttribute("tabindex"), { once: true });
            }
        }

        // Acciones específicas al entrar a una sección
        if (targetId === "checkout") updateCheckoutSummary();
        if (targetId === "cotizador") recalculateQuote();
        if (targetId === "admin") updateAdminView();
    }

    document.addEventListener("click", (e) => {
        const routeElement = e.target.closest("[data-route]");
        if (routeElement) {
            e.preventDefault();
            const routeId = routeElement.dataset.route;
            navigateTo(routeId);
            if (routeElement.closest("#cartDrawer")) closeCartDrawer();

            const navLinks = document.getElementById("navLinks");
            const menuToggle = document.getElementById("menuToggle");
            if (navLinks) navLinks.classList.remove("open");
            if (menuToggle) menuToggle.setAttribute("aria-expanded", "false");
        }
    });

    window.addEventListener("popstate", () => {
        navigateTo(window.location.hash.slice(1) || "inicio", false);
    });

    // Cargar ruta inicial desde URL hash
    const initialRoute = window.location.hash.slice(1) || "inicio";
    navigateTo(initialRoute, false);
}

function initMenu() {
    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");
    if (!menuToggle || !navLinks) return;

    menuToggle.addEventListener("click", () => {
        const open = navLinks.classList.toggle("open");
        menuToggle.setAttribute("aria-expanded", String(open));
    });
}

// ==========================================================================
// 5. MÓDULO DE CATÁLOGO & PRODUCTOS
// ==========================================================================
function initCatalogModule() {
    const searchInput = document.getElementById("search-input");
    const categoryFilter = document.getElementById("category-filter");
    const priceFilter = document.getElementById("price-filter");
    const categoryChips = document.getElementById("categoryChips");
    const productsContainer = document.getElementById("productsContainer");

    refreshCategoryDropdown();
    renderCatalogGrid(getFilteredCatalog());

    if (searchInput) {
        searchInput.addEventListener("input", debounce(() => renderCatalogGrid(getFilteredCatalog()), 120));
    }
    if (categoryFilter) {
        categoryFilter.addEventListener("change", () => {
            syncCategoryChips(categoryFilter.value);
            renderCatalogGrid(getFilteredCatalog());
        });
    }
    if (priceFilter) {
        priceFilter.addEventListener("change", () => renderCatalogGrid(getFilteredCatalog()));
    }

    if (categoryChips) {
        categoryChips.addEventListener("click", (e) => {
            const chip = e.target.closest(".chip-btn");
            if (!chip) return;
            const category = chip.dataset.category || "";
            if (categoryFilter) categoryFilter.value = category;
            syncCategoryChips(category);
            renderCatalogGrid(getFilteredCatalog());
        });
    }

    if (productsContainer) {
        productsContainer.addEventListener("click", (e) => {
            const clearBtn = e.target.closest("[data-clear-filters]");
            if (clearBtn) {
                if (searchInput) searchInput.value = "";
                if (categoryFilter) categoryFilter.value = "";
                if (priceFilter) priceFilter.value = "relevance";
                syncCategoryChips("");
                renderCatalogGrid(getFilteredCatalog());
                return;
            }

            const quickViewBtn = e.target.closest("[data-quickview]");
            if (quickViewBtn) {
                const pId = Number(quickViewBtn.dataset.quickview);
                openQuickViewModal(pId);
                return;
            }

            const addBtn = e.target.closest("[data-add-cart]");
            if (addBtn) {
                const pId = Number(addBtn.dataset.addCart);
                addToCart(pId, addBtn);
            }
        });
    }
}

function syncCategoryChips(category) {
    const chips = document.querySelectorAll("#categoryChips .chip-btn");
    chips.forEach((chip) => {
        const matches = (chip.dataset.category || "") === category;
        chip.classList.toggle("active", matches);
        chip.setAttribute("aria-pressed", String(matches));
    });
}

function refreshCategoryDropdown() {
    const select = document.getElementById("category-filter");
    if (!select) return;
    const current = select.value;
    const categories = [...new Set(products.map((p) => p.category))].sort();

    select.innerHTML = '<option value="">Todas las categorías</option>';
    categories.forEach((cat) => {
        const opt = document.createElement("option");
        opt.value = cat;
        opt.textContent = cat;
        select.appendChild(opt);
    });
    if (categories.includes(current)) select.value = current;
}

function getFilteredCatalog() {
    const searchInput = document.getElementById("search-input");
    const categoryFilter = document.getElementById("category-filter");
    const priceFilter = document.getElementById("price-filter");

    const search = searchInput ? searchInput.value.trim().toLowerCase() : "";
    const category = categoryFilter ? categoryFilter.value : "";
    const sort = priceFilter ? priceFilter.value : "relevance";

    let filtered = products.filter((p) => {
        const searchStr = `${p.name} ${p.description} ${p.category}`.toLowerCase();
        return (search === "" || searchStr.includes(search)) && (category === "" || p.category === category);
    });

    if (sort === "price-asc") filtered.sort((a, b) => getProductPrice(a) - getProductPrice(b));
    if (sort === "price-desc") filtered.sort((a, b) => getProductPrice(b) - getProductPrice(a));

    return filtered;
}

function renderCatalogGrid(productList) {
    const container = document.getElementById("productsContainer");
    const resultsCount = document.getElementById("resultsCount");
    if (!container) return;

    if (resultsCount) {
        resultsCount.textContent = productList.length === 1
            ? "1 producto disponible para entrega inmediata."
            : `${productList.length} productos disponibles para entrega inmediata.`;
    }

    if (!productList.length) {
        container.innerHTML = `
            <div class="glass-card" style="grid-column: 1 / -1; padding: 48px; text-align: center;">
                <h3 style="font-size: 1.5rem; margin-bottom: 8px; color: var(--neon-yellow);">Sin Coincidencias</h3>
                <p style="color: var(--text-dim); margin-bottom: 20px;">No encontramos productos con los filtros seleccionados.</p>
                <button class="btn btn-neon-yellow" type="button" data-clear-filters>Limpiar Filtros</button>
            </div>
        `;
        return;
    }

    container.innerHTML = productList.map((p) => {
        const safeName = escapeHTML(p.name);
        const safeCat = escapeHTML(p.category);
        const safeDesc = escapeHTML(p.description);
        const graphic = getProductGraphic(p.name || p.icon, p.image);
        const stock = Number(p.stock) || 10;
        const isLowStock = stock <= 10;
        const currentPrice = getProductPrice(p);
        const isOnSale = currentPrice < p.price;

        return `
            <article class="product-card">
                ${isOnSale ? `<span class="offer-badge">-${p.discountPercent}%</span>` : ""}
                <div class="product-media">
                    ${graphic}
                    <button class="quickview-btn" type="button" data-quickview="${p.id}" aria-label="Ver detalles de ${safeName}">
                        Vista rápida
                    </button>
                </div>

                <div class="product-top">
                    <span class="category-tag">${safeCat}</span>
                    <span style="display: flex; align-items: center; gap: 6px; font-size: 0.76rem; font-weight: 700;">
                        <span class="status-dot ${isLowStock ? "status-dot-yellow" : "status-dot-green"}"></span>
                        <span style="color: ${isLowStock ? "var(--neon-yellow)" : "var(--neon-green)"}">${isLowStock ? `Últimas ${stock}` : "En Stock"}</span>
                    </span>
                </div>

                <h3 class="product-title">${safeName}</h3>
                <p class="product-description">${safeDesc}</p>

                <div class="product-meta">
                    <span class="rating-stars">★ ${(Number(p.rating) || 4.8).toFixed(1)} <span style="color: var(--text-dim); font-weight: 500;">(${p.reviewsCount || 25})</span></span>
                    <span style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-dim);">REF-${String(p.id).padStart(4, "0")}</span>
                </div>

                <div class="product-footer">
                    <div class="price-group">
                        ${isOnSale ? `<span class="price-before">${formatCOP(p.price)}</span>` : ""}
                        <strong class="price">${formatCOP(currentPrice)}</strong>
                    </div>
                    <button class="add-cart-btn" type="button" data-add-cart="${p.id}" aria-label="Agregar ${safeName} al carrito">
                        + Agregar
                    </button>
                </div>
            </article>
        `;
    }).join("");
}

// ==========================================================================
// 6. MÓDULO DE AUTENTICACIÓN (#auth) - VALIDACIONES SENA EN TIEMPO REAL
// ==========================================================================
function initAuthModule() {
    const tabLoginBtn = document.getElementById("tabLoginBtn");
    const tabRegisterBtn = document.getElementById("tabRegisterBtn");
    const loginForm = document.getElementById("spaLoginForm");
    const registerForm = document.getElementById("spaRegisterForm");
    const authStatusBanner = document.getElementById("authStatusBanner");

    // Inputs Login
    const loginEmail = document.getElementById("loginEmailInput");
    const loginPass = document.getElementById("loginPasswordInput");

    // Inputs Registro
    const regName = document.getElementById("regNameInput");
    const regDoc = document.getElementById("regDocInput");
    const regEmail = document.getElementById("regEmailInput");
    const regPass = document.getElementById("regPasswordInput");

    // Tabs switch
    if (tabLoginBtn && tabRegisterBtn) {
        tabLoginBtn.addEventListener("click", () => switchAuthTab("login"));
        tabRegisterBtn.addEventListener("click", () => switchAuthTab("register"));
    }

    function switchAuthTab(tab) {
        const isLogin = tab === "login";
        if (tabLoginBtn) tabLoginBtn.classList.toggle("active", isLogin);
        if (tabRegisterBtn) tabRegisterBtn.classList.toggle("active", !isLogin);
        if (loginForm) loginForm.classList.toggle("hidden", !isLogin);
        if (registerForm) registerForm.classList.toggle("hidden", isLogin);
        if (authStatusBanner) authStatusBanner.textContent = "";
    }

    // 1. VALIDACIÓN CÉDULA / NIT (EXCLUSIVAMENTE NUMÉRICO)
    if (regDoc) {
        regDoc.addEventListener("input", (e) => {
            // Bloquea letras o caracteres especiales
            regDoc.value = regDoc.value.replace(/\D/g, "");
            validateRegDoc();
        });
        regDoc.addEventListener("blur", validateRegDoc);
    }

    function validateRegDoc() {
        const val = regDoc.value.trim();
        const hint = document.getElementById("regDocHint");
        if (val.length < 6 || val.length > 12) {
            setFieldValidation(regDoc, hint, false, "La cédula o NIT debe contener entre 6 y 12 dígitos numéricos.");
            return false;
        }
        setFieldValidation(regDoc, hint, true, "Cédula / NIT válido");
        return true;
    }

    // 2. VALIDACIÓN EMAIL CON REGEX ESTRICTO
    const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (regEmail) {
        regEmail.addEventListener("input", validateRegEmail);
        regEmail.addEventListener("blur", validateRegEmail);
    }

    function validateRegEmail() {
        const val = regEmail.value.trim();
        const hint = document.getElementById("regEmailHint");
        if (!EMAIL_REGEX.test(val)) {
            setFieldValidation(regEmail, hint, false, "Ingresa un correo electrónico válido (ejemplo@dominio.com)");
            return false;
        }
        setFieldValidation(regEmail, hint, true, "Correo electrónico con formato válido");
        return true;
    }

    // 3. VALIDACIÓN CONTRASEÑA (LONGITUD Y COMPLEJIDAD)
    if (regPass) {
        regPass.addEventListener("input", validateRegPassword);
        regPass.addEventListener("blur", validateRegPassword);
    }

    function validateRegPassword() {
        const val = regPass.value;
        const hint = document.getElementById("regPasswordHint");
        const hasLength = val.length >= 8;
        const hasUpper = /[A-Z]/.test(val);
        const hasNumber = /[0-9]/.test(val);

        const chkLength = document.getElementById("chkLength");
        const chkUpper = document.getElementById("chkUppercase");
        const chkNumber = document.getElementById("chkNumber");

        if (chkLength) chkLength.className = hasLength ? "passed" : "";
        if (chkUpper) chkUpper.className = hasUpper ? "passed" : "";
        if (chkNumber) chkNumber.className = hasNumber ? "passed" : "";

        if (!hasLength || !hasUpper || !hasNumber) {
            setFieldValidation(regPass, hint, false, "La contraseña no cumple con los requisitos de seguridad.");
            return false;
        }
        setFieldValidation(regPass, hint, true, "Contraseña segura y robusta");
        return true;
    }

    // 4. VALIDACIÓN NOMBRE
    if (regName) {
        regName.addEventListener("input", validateRegName);
        regName.addEventListener("blur", validateRegName);
    }

    function validateRegName() {
        const val = regName.value.trim();
        const hint = document.getElementById("regNameHint");
        if (val.length < 3) {
            setFieldValidation(regName, hint, false, "Ingresa tu nombre completo (mínimo 3 letras).");
            return false;
        }
        setFieldValidation(regName, hint, true, "Nombre correcto");
        return true;
    }

    // SUBMIT REGISTRO
    if (registerForm) {
        registerForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const isNameValid = validateRegName();
            const isDocValid = validateRegDoc();
            const isEmailValid = validateRegEmail();
            const isPassValid = validateRegPassword();

            if (!isNameValid || !isDocValid || !isEmailValid || !isPassValid) {
                showToast("Corrige los campos en rojo para continuar.");
                registerForm.classList.add("input-error-shake");
                setTimeout(() => registerForm.classList.remove("input-error-shake"), 400);
                return;
            }

            const email = regEmail.value.trim().toLowerCase();
            if (users.some((u) => u.email === email)) {
                setFieldValidation(regEmail, document.getElementById("regEmailHint"), false, "Este correo ya está registrado.");
                showToast("El correo ya existe en el sistema.");
                return;
            }

            const newUser = {
                id: Date.now(),
                name: regName.value.trim(),
                document: regDoc.value.trim(),
                email,
                password: regPass.value
            };

            users.push(newUser);
            saveToStorage("ferreweb-users", users);

            sessionUser = { id: newUser.id, name: newUser.name, email: newUser.email };
            saveToStorage("ferreweb-session", sessionUser);

            registerForm.reset();
            updateAuthUI();
            showToast(`¡Registro exitoso! Bienvenido, ${newUser.name}.`);
            switchAuthTab("login");
        });
    }

    // SUBMIT LOGIN
    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const email = loginEmail.value.trim().toLowerCase();
            const pass = loginPass.value;

            if (!EMAIL_REGEX.test(email)) {
                setFieldValidation(loginEmail, document.getElementById("loginEmailHint"), false, "Correo con formato no válido.");
                return;
            }

            const found = users.find((u) => u.email === email && u.password === pass);
            if (!found) {
                authStatusBanner.innerHTML = `<span style="color: var(--neon-red);">❌ Credenciales incorrectas. Verifica correo o contraseña.</span>`;
                loginForm.classList.add("input-error-shake");
                setTimeout(() => loginForm.classList.remove("input-error-shake"), 400);
                return;
            }

            sessionUser = { id: found.id, name: found.name, email: found.email };
            saveToStorage("ferreweb-session", sessionUser);

            loginForm.reset();
            updateAuthUI();
            showToast(`¡Bienvenido a FerreWeb, ${sessionUser.name}!`);
            authStatusBanner.innerHTML = `<span style="color: var(--neon-green);">✓ Sesión iniciada correctamente.</span>`;
        });
    }
}

function setFieldValidation(inputEl, hintEl, isValid, message) {
    if (!inputEl) return;
    inputEl.classList.toggle("is-valid", isValid);
    inputEl.classList.toggle("is-invalid", !isValid);

    if (hintEl) {
        hintEl.textContent = message;
        hintEl.className = `validation-hint ${isValid ? "hint-success" : "hint-error"}`;
    }
}

// ==========================================================================
// 7. MÓDULO DE ADMINISTRACIÓN CRUD (#admin) - VALIDACIONES ESTRICTAS
// ==========================================================================
function initGlobalPromo() {
    renderGlobalPromo();
}

function renderGlobalPromo() {
    const banner = document.getElementById("globalPromoBanner");
    const text = document.getElementById("globalPromoText");
    if (!banner || !text) return;

    const isActive = promoMessage.length > 0;
    text.textContent = promoMessage;
    banner.classList.toggle("hidden", !isActive);
    document.body.classList.toggle("has-global-promo", isActive);
}

function updateAdminView() {
    const loginPanel = document.getElementById("adminLoginPanel");
    const dashboard = document.getElementById("adminDashboard");
    if (!loginPanel || !dashboard) return;

    loginPanel.classList.toggle("hidden", adminAuthenticated);
    dashboard.classList.toggle("hidden", !adminAuthenticated);
    if (adminAuthenticated) {
        const promoInput = document.getElementById("adminPromoMessage");
        if (promoInput) promoInput.value = promoMessage;
        renderAdminProductList();
    }
}

function initAdminModule() {
    const loginForm = document.getElementById("adminLoginForm");
    const logoutBtn = document.getElementById("adminLogoutBtn");
    const promoForm = document.getElementById("adminPromoForm");
    const promoClearBtn = document.getElementById("adminPromoClear");
    const adminForm = document.getElementById("adminProductForm");
    const nameInput = document.getElementById("adminProdName");
    const catSelect = document.getElementById("adminProdCategory");
    const priceInput = document.getElementById("adminProdPrice");
    const stockInput = document.getElementById("adminProdStock");
    const descInput = document.getElementById("adminProdDesc");
    const imageInput = document.getElementById("adminProdImage");
    const imageFileInput = document.getElementById("adminProdImageFile");
    const onSaleInput = document.getElementById("adminProdOnSale");
    const discountInput = document.getElementById("adminProdDiscount");
    const cancelBtn = document.getElementById("adminCancelEditBtn");
    const prodList = document.getElementById("adminProductList");

    updateAdminView();

    loginForm?.addEventListener("submit", (event) => {
        event.preventDefault();
        const username = document.getElementById("adminUsername").value.trim();
        const password = document.getElementById("adminPassword").value;
        const error = document.getElementById("adminLoginError");
        const valid = username.toLowerCase() === ADMIN_CREDENTIALS.username.toLowerCase()
            && password === ADMIN_CREDENTIALS.password;

        if (!valid) {
            error.textContent = "Credenciales incorrectas. Verifica el usuario y la contraseña.";
            document.getElementById("adminUsername").focus();
            return;
        }

        adminAuthenticated = true;
        saveAdminSession(true);
        error.textContent = "";
        loginForm.reset();
        updateAdminView();
        document.getElementById("adminDashboard")?.focus({ preventScroll: true });
        showToast("Acceso administrativo concedido.");
    });

    logoutBtn?.addEventListener("click", () => {
        adminAuthenticated = false;
        saveAdminSession(false);
        resetAdminForm();
        updateAdminView();
        document.getElementById("adminUsername")?.focus();
        showToast("Sesión administrativa cerrada.");
    });

    promoForm?.addEventListener("submit", (event) => {
        event.preventDefault();
        if (!adminAuthenticated) return;
        const input = document.getElementById("adminPromoMessage");
        const message = input.value.trim();
        if (message.length < 5) {
            showToast("Escribe un mensaje promocional de al menos 5 caracteres.");
            input.focus();
            return;
        }
        promoMessage = message;
        saveToStorage("ferreweb-promo-message", promoMessage);
        renderGlobalPromo();
        showToast("Banner promocional publicado para todos los clientes.");
    });

    promoClearBtn?.addEventListener("click", () => {
        if (!adminAuthenticated) return;
        promoMessage = "";
        saveToStorage("ferreweb-promo-message", promoMessage);
        const input = document.getElementById("adminPromoMessage");
        if (input) input.value = "";
        renderGlobalPromo();
        showToast("Banner promocional ocultado.");
    });

    onSaleInput?.addEventListener("change", () => {
        discountInput.disabled = !onSaleInput.checked;
        if (onSaleInput.checked) discountInput.focus();
    });

    // Validaciones en tiempo real
    if (nameInput) {
        nameInput.addEventListener("input", () => {
            const valid = nameInput.value.trim().length >= 4;
            setFieldValidation(nameInput, document.getElementById("adminProdNameHint"), valid, valid ? "Nombre válido" : "El nombre debe tener mínimo 4 caracteres.");
        });
    }

    if (priceInput) {
        priceInput.addEventListener("input", () => {
            const val = Number(priceInput.value);
            const valid = Number.isFinite(val) && val > 0;
            setFieldValidation(priceInput, document.getElementById("adminProdPriceHint"), valid, valid ? "Precio válido" : "El precio debe ser un número positivo mayor a 0.");
        });
    }

    if (stockInput) {
        stockInput.addEventListener("input", () => {
            const val = Number(stockInput.value);
            const valid = Number.isInteger(val) && val > 0;
            setFieldValidation(stockInput, document.getElementById("adminProdStockHint"), valid, valid ? "Stock válido" : "El stock debe ser un entero positivo mayor a 0.");
        });
    }

    // Submit Guardar / Editar
    if (adminForm) {
        adminForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            if (!adminAuthenticated) {
                updateAdminView();
                return;
            }
            const name = nameInput.value.trim();
            const category = catSelect.value;
            const price = Number(priceInput.value);
            const stock = Number(stockInput.value);
            const desc = descInput.value.trim();
            let image = normalizeImageUrl(imageInput?.value || "");
            const onSale = Boolean(onSaleInput?.checked);
            const discountPercent = onSale ? Number(discountInput?.value) : 0;
            const editId = document.getElementById("adminProdId").value;

            if (name.length < 4 || !category || price <= 0 || stock <= 0 || !desc
                || (onSale && (!Number.isInteger(discountPercent) || discountPercent < 1 || discountPercent > 90))) {
                showToast("Completa todos los campos con valores válidos.");
                return;
            }
            if (imageInput?.value.trim() && !image) {
                showToast("La imagen debe usar una URL http:// o https:// válida.");
                imageInput.focus();
                return;
            }
            if (imageFileInput?.files?.[0]) {
                try {
                    image = await readImageFile(imageFileInput.files[0]);
                } catch (error) {
                    showToast(error.message);
                    imageFileInput.focus();
                    return;
                }
            }

            if (editId) {
                // Editar
                const existing = products.find((p) => p.id === Number(editId));
                if (existing) {
                    existing.name = name;
                    existing.category = category;
                    existing.price = price;
                    existing.stock = stock;
                    existing.description = desc;
                    existing.image = image;
                    existing.onSale = onSale;
                    existing.discountPercent = discountPercent;
                }
                showToast(`✓ Producto "${name}" actualizado.`);
            } else {
                // Crear
                const newProduct = {
                    id: Date.now(),
                    name,
                    category,
                    price,
                    stock,
                    description: desc,
                    image,
                    onSale,
                    discountPercent,
                    icon: "PR",
                    rating: 5.0,
                    reviewsCount: 1,
                    badge: "Nuevo"
                };
                products.unshift(newProduct);
                showToast(`✓ Producto "${name}" agregado al inventario.`);
            }

            saveToStorage("ferreweb-products", products);
            resetAdminForm();
            renderAdminProductList();
            renderCatalogGrid(getFilteredCatalog());
            refreshCategoryDropdown();
            refreshQuoteProductSelect();
        });
    }

    if (cancelBtn) {
        cancelBtn.addEventListener("click", resetAdminForm);
    }

    if (prodList) {
        prodList.addEventListener("click", (e) => {
            if (!adminAuthenticated) return;
            const delBtn = e.target.closest("[data-admin-delete]");
            if (delBtn) {
                const id = Number(delBtn.dataset.adminDelete);
                const productToDelete = products.find((p) => p.id === id);
                if (!productToDelete || !window.confirm(`¿Eliminar "${productToDelete.name}" del inventario?`)) return;
                products = products.filter((p) => p.id !== id);
                cart = cart.filter((item) => item.productId !== id);
                saveToStorage("ferreweb-products", products);
                persistCart();
                renderAdminProductList();
                renderCatalogGrid(getFilteredCatalog());
                renderCart();
                refreshQuoteProductSelect();
                showToast("Producto eliminado del inventario.");
                return;
            }

            const editBtn = e.target.closest("[data-admin-edit]");
            if (editBtn) {
                const id = Number(editBtn.dataset.adminEdit);
                const p = products.find((prod) => prod.id === id);
                if (p) {
                    document.getElementById("adminProdId").value = p.id;
                    nameInput.value = p.name;
                    catSelect.value = p.category;
                    priceInput.value = p.price;
                    stockInput.value = p.stock || 10;
                    descInput.value = p.description;
                    imageInput.value = p.image?.startsWith("data:image/") ? "" : (p.image || "");
                    onSaleInput.checked = Boolean(p.onSale);
                    discountInput.value = p.discountPercent || 10;
                    discountInput.disabled = !onSaleInput.checked;

                    document.getElementById("adminFormTitle").textContent = "Editar producto";
                    document.getElementById("adminSubmitBtn").textContent = "Guardar Cambios";
                    cancelBtn.style.display = "inline-flex";
                    nameInput.focus();
                }
            }
        });
    }
}

function resetAdminForm() {
    const adminForm = document.getElementById("adminProductForm");
    if (!adminForm) return;
    adminForm.reset();
    document.getElementById("adminProdId").value = "";
    document.getElementById("adminFormTitle").textContent = "Agregar nuevo producto";
    document.getElementById("adminSubmitBtn").textContent = "Guardar Producto";
    const cancelBtn = document.getElementById("adminCancelEditBtn");
    if (cancelBtn) cancelBtn.style.display = "none";
    const discountInput = document.getElementById("adminProdDiscount");
    if (discountInput) {
        discountInput.value = "10";
        discountInput.disabled = true;
    }

    document.querySelectorAll("#adminProductForm .validation-hint").forEach((h) => (h.textContent = ""));
    document.querySelectorAll("#adminProductForm input, #adminProductForm textarea").forEach((i) => {
        i.classList.remove("is-valid", "is-invalid");
    });
}

function renderAdminProductList() {
    const list = document.getElementById("adminProductList");
    const countEl = document.getElementById("adminTotalCount");
    if (!list || !adminAuthenticated) return;

    if (countEl) countEl.textContent = String(products.length);

    if (!products.length) {
        list.innerHTML = `<p style="color: var(--text-dim); padding: 16px;">Sin productos en inventario.</p>`;
        return;
    }

    list.innerHTML = products.map((p) => `
        <div class="admin-item-card">
            <div>
                <h4>${escapeHTML(p.name)}</h4>
                <p>
                    ${formatCOP(getProductPrice(p))} • Stock: ${p.stock || 10} unid. •
                    <span style="color: var(--text-dim);">${escapeHTML(p.category)}</span>
                    ${p.onSale ? `<span class="admin-offer-label">Oferta -${p.discountPercent}%</span>` : ""}
                </p>
            </div>
            <div style="display: flex; gap: 8px;">
                <button class="btn btn-ghost" type="button" data-admin-edit="${p.id}" style="padding: 6px 12px; font-size: 0.78rem;">Editar</button>
                <button class="btn-icon-danger" type="button" data-admin-delete="${p.id}">Eliminar</button>
            </div>
        </div>
    `).join("");
}

// ==========================================================================
// 8. MÓDULO COTIZADOR & CALCULADORA DE FLETES (#cotizador)
// ==========================================================================
function initCotizadorModule() {
    const zoneSelect = document.getElementById("quoteZone");
    const weightSelect = document.getElementById("quoteWeight");
    const prodSelect = document.getElementById("quoteProductSelect");
    const addProdBtn = document.getElementById("quoteAddProductBtn");
    const printBtn = document.getElementById("quotePrintBtn");
    const transferBtn = document.getElementById("quoteTransferToCartBtn");

    refreshQuoteProductSelect();

    if (zoneSelect) zoneSelect.addEventListener("change", recalculateQuote);
    if (weightSelect) weightSelect.addEventListener("change", recalculateQuote);

    if (addProdBtn && prodSelect) {
        addProdBtn.addEventListener("click", () => {
            const pId = Number(prodSelect.value);
            const p = products.find((prod) => prod.id === pId);
            if (p) {
                const existing = quoteItems.find((item) => item.id === pId);
                if (existing) existing.quantity += 1;
                else quoteItems.push({ id: p.id, name: p.name, price: getProductPrice(p), quantity: 1 });
                renderQuoteItemsList();
                recalculateQuote();
                showToast(`✓ "${p.name}" añadido a la cotización.`);
            }
        });
    }

    if (printBtn) {
        printBtn.addEventListener("click", () => {
            window.print();
        });
    }

    if (transferBtn) {
        transferBtn.addEventListener("click", () => {
            if (!quoteItems.length) {
                showToast("Agrega productos a la cotización primero.");
                return;
            }
            quoteItems.forEach((q) => {
                const inCart = cart.find((c) => c.productId === q.id);
                if (inCart) inCart.quantity += q.quantity;
                else cart.push({ productId: q.id, quantity: q.quantity });
            });
            persistCart();
            renderCart();
            showToast("Cotización transferida al carrito de compras.");
            openCartDrawer();
        });
    }

    recalculateQuote();
}

function refreshQuoteProductSelect() {
    const select = document.getElementById("quoteProductSelect");
    if (!select) return;
    select.innerHTML = products.map((p) => `
        <option value="${p.id}">${escapeHTML(p.name)} - ${formatCOP(getProductPrice(p))}</option>
    `).join("");
}

function renderQuoteItemsList() {
    const list = document.getElementById("quoteItemsList");
    if (!list) return;

    if (!quoteItems.length) {
        list.innerHTML = `<span style="color: var(--text-dim); font-size: 0.84rem;">Sin productos seleccionados aún. Usa el selector arriba o el carrito.</span>`;
        return;
    }

    list.innerHTML = quoteItems.map((item, idx) => `
        <div class="quote-line-item">
            <div>
                <strong>${escapeHTML(item.name)}</strong>
                <span>${formatCOP(item.price)} por unidad</span>
            </div>
            <div class="quote-line-actions">
                <button class="qty-btn" type="button" data-quote-action="decrease" data-quote-index="${idx}" aria-label="Restar una unidad">−</button>
                <strong>${item.quantity}</strong>
                <button class="qty-btn" type="button" data-quote-action="increase" data-quote-index="${idx}" aria-label="Sumar una unidad">+</button>
                <button class="remove-btn" type="button" data-quote-action="remove" data-quote-index="${idx}">Eliminar</button>
            </div>
        </div>
    `).join("");

    list.querySelectorAll("[data-quote-action]").forEach((button) => {
        button.addEventListener("click", () => {
            const idx = Number(button.dataset.quoteIndex);
            const item = quoteItems[idx];
            if (!item) return;
            if (button.dataset.quoteAction === "increase") item.quantity += 1;
            if (button.dataset.quoteAction === "decrease") item.quantity -= 1;
            if (button.dataset.quoteAction === "remove" || item.quantity <= 0) quoteItems.splice(idx, 1);
            renderQuoteItemsList();
            recalculateQuote();
        });
    });
}

function recalculateQuote() {
    const zoneSelect = document.getElementById("quoteZone");
    const weightSelect = document.getElementById("quoteWeight");

    const baseShipping = zoneSelect ? Number(zoneSelect.selectedOptions[0]?.dataset.rate || 12000) : 12000;
    const weightMult = weightSelect ? Number(weightSelect.selectedOptions[0]?.dataset.mult || 1) : 1;
    const finalShipping = quoteItems.length ? Math.round(baseShipping * weightMult) : 0;

    const subtotal = quoteItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const iva = Math.round(subtotal * 0.19);
    const total = subtotal + finalShipping;

    const subEl = document.getElementById("quoteSubtotalDisplay");
    const shipEl = document.getElementById("quoteShippingDisplay");
    const ivaEl = document.getElementById("quoteIvaDisplay");
    const totEl = document.getElementById("quoteTotalDisplay");
    const cityEl = document.getElementById("quoteCityDisplay");
    const tableBody = document.getElementById("quoteTableBody");

    if (subEl) subEl.textContent = formatCOP(subtotal);
    if (shipEl) shipEl.textContent = formatCOP(finalShipping);
    if (ivaEl) ivaEl.textContent = formatCOP(iva);
    if (totEl) totEl.textContent = formatCOP(total);
    if (cityEl) cityEl.textContent = zoneSelect?.selectedOptions[0]?.dataset.city || "Destino nacional";
    if (tableBody) {
        tableBody.innerHTML = quoteItems.length
            ? quoteItems.map((item) => `
                <tr>
                    <td>${escapeHTML(item.name)}</td>
                    <td>${item.quantity}</td>
                    <td>${formatCOP(item.price * item.quantity)}</td>
                </tr>
            `).join("")
            : '<tr><td colspan="3">Agrega productos para comenzar.</td></tr>';
    }
}

// ==========================================================================
// 9. MÓDULO CHECKOUT (#checkout) - VALIDACIONES ESTRICTAS
// ==========================================================================
function initCheckoutModuleV2() {
    const form = document.getElementById("spaCheckoutForm");
    if (!form) return;

    const nameInput = document.getElementById("chkName");
    const phoneInput = document.getElementById("chkPhone");
    const emailInput = document.getElementById("chkEmail");
    const cityInput = document.getElementById("chkCity");
    const cardNumberInput = document.getElementById("chkCardNumber");
    const cardExpiryInput = document.getElementById("chkCardExpiry");
    const cardCvvInput = document.getElementById("chkCardCvv");
    const previewNum = document.getElementById("cardPreviewNumber");
    const previewName = document.getElementById("cardPreviewName");
    const previewExp = document.getElementById("cardPreviewExpiry");
    const payButton = document.getElementById("chkPayButton");
    const errorSummary = document.getElementById("checkoutErrorSummary");

    const validateCardNumber = () => {
        const valid = /^\d{16}$/.test(cardNumberInput.value.replace(/\D/g, ""));
        setFieldValidation(cardNumberInput, document.getElementById("chkCardNumberHint"), valid,
            valid ? "Número de tarjeta válido" : "Ingresa exactamente 16 dígitos.");
        return valid;
    };

    const validateCardExpiry = () => {
        const value = cardExpiryInput.value.trim();
        const match = value.match(/^(0[1-9]|1[0-2])\/(\d{2})$/);
        let valid = Boolean(match);
        if (match) {
            const expiration = new Date(2000 + Number(match[2]), Number(match[1]), 0, 23, 59, 59);
            valid = expiration >= new Date();
        }
        setFieldValidation(cardExpiryInput, document.getElementById("chkCardExpiryHint"), valid,
            valid ? "Fecha de expiración válida" : "Usa MM/AA y una fecha vigente.");
        return valid;
    };

    const validateCardCvv = () => {
        const valid = /^\d{3}$/.test(cardCvvInput.value);
        setFieldValidation(cardCvvInput, document.getElementById("chkCardCvvHint"), valid,
            valid ? "Código de seguridad válido" : "Ingresa los 3 dígitos del CVV.");
        return valid;
    };

    nameInput.addEventListener("input", () => {
        const value = nameInput.value.trim();
        if (previewName) previewName.textContent = value.toUpperCase() || "NOMBRE TITULAR";
        if (value.length >= 3) setFieldValidation(nameInput, document.getElementById("chkNameHint"), true, "Nombre válido");
    });

    phoneInput.addEventListener("input", () => {
        phoneInput.value = phoneInput.value.replace(/\D/g, "").slice(0, 10);
    });

    phoneInput.addEventListener("blur", () => {
        const valid = /^\d{10}$/.test(phoneInput.value);
        setFieldValidation(phoneInput, document.getElementById("chkPhoneHint"), valid,
            valid ? "Celular válido" : "Ingresa un celular de 10 dígitos, solo números.");
    });

    emailInput.addEventListener("blur", () => {
        const valid = emailInput.validity.valid && emailInput.value.includes("@");
        setFieldValidation(emailInput, document.getElementById("chkEmailHint"), valid,
            valid ? "Correo válido" : "Ingresa un correo electrónico válido.");
    });

    cardNumberInput.addEventListener("input", () => {
        const digits = cardNumberInput.value.replace(/\D/g, "").slice(0, 16);
        cardNumberInput.value = digits.match(/.{1,4}/g)?.join(" ") || "";
        if (previewNum) previewNum.textContent = cardNumberInput.value || "•••• •••• •••• ••••";
    });
    cardNumberInput.addEventListener("blur", validateCardNumber);

    cardExpiryInput.addEventListener("input", () => {
        const digits = cardExpiryInput.value.replace(/\D/g, "").slice(0, 4);
        cardExpiryInput.value = digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
        if (previewExp) previewExp.textContent = cardExpiryInput.value || "MM/AA";
    });
    cardExpiryInput.addEventListener("blur", validateCardExpiry);

    cardCvvInput.addEventListener("input", () => {
        cardCvvInput.value = cardCvvInput.value.replace(/\D/g, "").slice(0, 3);
    });
    cardCvvInput.addEventListener("blur", validateCardCvv);

    document.getElementById("paymentMethodGrid")?.addEventListener("change", renderPaymentDetails);
    document.getElementById("printInvoiceBtn")?.addEventListener("click", () => window.print());
    renderPaymentDetails();

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        if (!cart.length) {
            showCheckoutErrors(["Tu carrito está vacío. Agrega al menos un producto."], errorSummary);
            return;
        }

        const paymentMethod = form.elements.paymentMethod?.value || "";
        const errors = [];
        if (nameInput.value.trim().length < 3) errors.push("Ingresa el nombre completo del cliente.");
        if (!/^\d{10}$/.test(phoneInput.value)) errors.push("El celular debe contener exactamente 10 números.");
        if (!emailInput.validity.valid || !emailInput.value.includes("@")) errors.push("Ingresa un correo electrónico válido.");
        if (cityInput.value.trim().length < 2) errors.push("Ingresa la ciudad o municipio.");
        if (!paymentMethod) errors.push("Selecciona un medio de pago.");
        if (paymentMethod === "card") {
            if (!validateCardNumber()) errors.push("Revisa el número de la tarjeta.");
            if (!validateCardExpiry()) errors.push("Revisa la fecha de expiración.");
            if (!validateCardCvv()) errors.push("Revisa el código CVV.");
        }

        if (errors.length) {
            showCheckoutErrors(errors, errorSummary);
            return;
        }

        errorSummary.classList.add("hidden");
        const orderLines = cart.map((line) => {
            const product = products.find((item) => item.id === line.productId);
            return product ? { product, quantity: line.quantity, unitPrice: getProductPrice(product) } : null;
        }).filter(Boolean);
        const totals = getCartTotals();
        const customer = {
            name: nameInput.value.trim(),
            phone: phoneInput.value,
            email: emailInput.value.trim(),
            city: cityInput.value.trim(),
            address: document.getElementById("chkAddress").value.trim()
        };
        const orderId = `FW-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;

        payButton.disabled = true;
        payButton.textContent = "Procesando…";
        await simulatePaymentProgress();

        renderDigitalInvoice({ orderId, orderLines, totals, customer, paymentMethod });
        cart = [];
        persistCart();
        renderCart();
        updateCheckoutSummary();
        form.reset();
        renderPaymentDetails();
        payButton.disabled = false;
        payButton.textContent = "Pagar y Confirmar";
        document.getElementById("paymentProcessing")?.classList.add("hidden");
        document.querySelector("#checkout .checkout-grid")?.classList.add("hidden");
        const success = document.getElementById("paymentSuccess");
        success?.classList.remove("hidden");
        success?.focus();
    });
}

function showCheckoutErrors(errors, summary) {
    if (!summary) return;
    summary.innerHTML = `<strong>Revisa la información:</strong><ul>${errors.map((error) => `<li>${escapeHTML(error)}</li>`).join("")}</ul>`;
    summary.classList.remove("hidden");
    summary.focus();
}

function getSelectedPaymentMethod() {
    return document.querySelector('input[name="paymentMethod"]:checked')?.value || "card";
}

function renderPaymentDetails() {
    const method = getSelectedPaymentMethod();
    const panel = document.getElementById("paymentDetailPanel");
    const cardFields = document.getElementById("cardPaymentFields");
    const cardPreview = document.querySelector(".card-preview-widget");
    const cardInputs = ["chkCardNumber", "chkCardExpiry", "chkCardCvv"].map((id) => document.getElementById(id));
    const isCard = method === "card";

    cardFields?.classList.toggle("hidden", !isCard);
    cardPreview?.classList.toggle("hidden", !isCard);
    cardInputs.forEach((input) => { if (input) input.required = isCard; });
    if (!panel) return;

    const instructions = {
        nequi: { title: "Paga desde Nequi", copy: "Escanea el QR simulado o envía el total al número registrado.", reference: "Nequi: 300 123 4567", qr: true },
        daviplata: { title: "Paga desde Daviplata", copy: "Escanea el QR simulado o transfiere al número de FerreWeb.", reference: "Daviplata: 310 765 4321", qr: true },
        efecty: { title: "Pago en punto Efecty", copy: "Presenta tu documento y esta referencia en cualquier punto Efecty.", reference: "Convenio 110245 · Referencia FW-839241", qr: false },
        pse: { title: "Débito bancario por PSE", copy: "Al confirmar, simularemos la conexión segura con tu entidad bancaria.", reference: "Transacción protegida por FerreWeb Pay", qr: false },
        cash: { title: "Pago contraentrega", copy: "Paga al recibir. La disponibilidad depende de la cobertura de tu ciudad.", reference: "Ten disponible el valor exacto del pedido.", qr: false }
    };

    if (isCard) {
        panel.innerHTML = "";
        return;
    }

    const info = instructions[method];
    panel.innerHTML = `
        <div class="payment-instruction">
            ${info.qr ? createSimulatedQR() : `<span class="payment-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4 5h16v14H4zM8 9h8M8 13h5"/></svg></span>`}
            <div>
                <h4>${info.title}</h4>
                <p>${info.copy}</p>
                <p class="payment-reference">${info.reference}</p>
            </div>
        </div>`;
}

function createSimulatedQR() {
    const cells = Array.from({ length: 49 }, (_, index) => {
        const filled = [0,1,2,7,9,14,15,16,4,5,6,11,13,18,19,20,24,26,28,30,32,34,35,36,38,40,42,43,44,46,48].includes(index);
        return `<span style="opacity:${filled ? 1 : 0}"></span>`;
    }).join("");
    return `<div class="simulated-qr" role="img" aria-label="Código QR simulado para pago">${cells}</div>`;
}

function simulatePaymentProgress() {
    const container = document.getElementById("paymentProcessing");
    const bar = document.getElementById("paymentProgressBar");
    const label = document.getElementById("paymentProgressLabel");
    container?.classList.remove("hidden");
    if (bar) bar.style.width = "0%";
    if (label) label.textContent = "0%";

    return new Promise((resolve) => {
        const steps = [18, 37, 63, 82, 100];
        let index = 0;
        const timer = window.setInterval(() => {
            const progress = steps[index];
            if (bar) bar.style.width = `${progress}%`;
            if (label) label.textContent = `${progress}%`;
            index += 1;
            if (index === steps.length) {
                window.clearInterval(timer);
                window.setTimeout(resolve, 280);
            }
        }, 260);
    });
}

function renderDigitalInvoice({ orderId, orderLines, totals, customer, paymentMethod }) {
    document.getElementById("invoiceOrderId").textContent = orderId;
    document.getElementById("invoiceDate").textContent = new Intl.DateTimeFormat("es-CO", {
        dateStyle: "long", timeStyle: "short"
    }).format(new Date());

    document.getElementById("invoiceCustomer").innerHTML = `
        <div><dt>Cliente</dt><dd>${escapeHTML(customer.name)}</dd></div>
        <div><dt>Celular</dt><dd>${escapeHTML(customer.phone)}</dd></div>
        <div><dt>Correo</dt><dd>${escapeHTML(customer.email)}</dd></div>
        <div><dt>Entrega</dt><dd>${escapeHTML(customer.address || `Retiro/consulta previa · ${customer.city}`)}</dd></div>
        <div><dt>Medio de pago</dt><dd>${escapeHTML(PAYMENT_LABELS[paymentMethod])}</dd></div>`;

    document.getElementById("invoiceItems").innerHTML = orderLines.map(({ product, quantity, unitPrice }) => `
        <tr><td>${escapeHTML(product.name)}</td><td>${quantity}</td><td>${formatCOP(unitPrice)}</td><td>${formatCOP(unitPrice * quantity)}</td></tr>
    `).join("");
    document.getElementById("invoiceTotals").innerHTML = `
        <tr><td colspan="3">Subtotal</td><td>${formatCOP(totals.subtotal)}</td></tr>
        <tr><td colspan="3">Envío</td><td>${totals.shipping ? formatCOP(totals.shipping) : "Gratis"}</td></tr>
        <tr><td colspan="3">Total pagado</td><td>${formatCOP(totals.total)}</td></tr>`;

    document.getElementById("paymentNotificationText").textContent =
        `Se ha enviado la comprobación del pago y la factura al correo ${customer.email} y un mensaje de confirmación al WhatsApp/Celular ${customer.phone}.`;
}

function initCheckoutModule() {
    const chkForm = document.getElementById("spaCheckoutForm");
    const chkCardNum = document.getElementById("chkCardNumber");
    const chkCardExpiry = document.getElementById("chkCardExpiry");
    const chkCardCvv = document.getElementById("chkCardCvv");
    const chkName = document.getElementById("chkName");
    const chkPhone = document.getElementById("chkPhone");
    const chkAddress = document.getElementById("chkAddress");

    const previewNum = document.getElementById("cardPreviewNumber");
    const previewName = document.getElementById("cardPreviewName");
    const previewExp = document.getElementById("cardPreviewExpiry");

    // 1. Número de Tarjeta (Exactamente 16 dígitos, formateado en bloques de 4)
    if (chkCardNum) {
        chkCardNum.addEventListener("input", (e) => {
            let digits = chkCardNum.value.replace(/\D/g, "").slice(0, 16);
            // Formatear en bloques
            let formatted = digits.match(/.{1,4}/g)?.join(" ") || digits;
            chkCardNum.value = formatted;

            if (previewNum) {
                previewNum.textContent = formatted.padEnd(19, "•").replace(/ /g, "  ");
            }
            validateCardNumber();
        });
        chkCardNum.addEventListener("blur", validateCardNumber);
    }

    function validateCardNumber() {
        const raw = chkCardNum.value.replace(/\D/g, "");
        const hint = document.getElementById("chkCardNumberHint");
        if (raw.length !== 16) {
            setFieldValidation(chkCardNum, hint, false, "El número de tarjeta debe tener exactamente 16 dígitos.");
            return false;
        }
        setFieldValidation(chkCardNum, hint, true, "Número de tarjeta válido");
        return true;
    }

    // 2. Fecha de Expiración (MM/AA con validación de no vencimiento)
    if (chkCardExpiry) {
        chkCardExpiry.addEventListener("input", (e) => {
            let val = chkCardExpiry.value.replace(/\D/g, "").slice(0, 4);
            if (val.length >= 3) {
                val = `${val.slice(0, 2)}/${val.slice(2)}`;
            }
            chkCardExpiry.value = val;

            if (previewExp) previewExp.textContent = val || "MM/AA";
            validateCardExpiry();
        });
        chkCardExpiry.addEventListener("blur", validateCardExpiry);
    }

    function validateCardExpiry() {
        const val = chkCardExpiry.value.trim();
        const hint = document.getElementById("chkCardExpiryHint");
        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(val)) {
            setFieldValidation(chkCardExpiry, hint, false, "Formato inválido. Usa MM/AA (ej: 08/28)");
            return false;
        }

        const [mStr, yStr] = val.split("/");
        const expMonth = Number(mStr);
        const expYear = 2000 + Number(yStr);

        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1;

        if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
            setFieldValidation(chkCardExpiry, hint, false, "La tarjeta ingresada se encuentra vencida.");
            return false;
        }

        setFieldValidation(chkCardExpiry, hint, true, "Fecha de expiración válida");
        return true;
    }

    // 3. Código CVC / CVV (Exactamente 3 dígitos numéricos)
    if (chkCardCvv) {
        chkCardCvv.addEventListener("input", (e) => {
            chkCardCvv.value = chkCardCvv.value.replace(/\D/g, "").slice(0, 3);
            validateCardCvv();
        });
        chkCardCvv.addEventListener("blur", validateCardCvv);
    }

    function validateCardCvv() {
        const raw = chkCardCvv.value.trim();
        const hint = document.getElementById("chkCardCvvHint");
        if (!/^\d{3}$/.test(raw)) {
            setFieldValidation(chkCardCvv, hint, false, "El código de seguridad CVC/CVV debe ser de 3 dígitos.");
            return false;
        }
        setFieldValidation(chkCardCvv, hint, true, "CVC válido");
        return true;
    }

    // 4. Nombre Titular
    if (chkName) {
        chkName.addEventListener("input", () => {
            const val = chkName.value.trim();
            if (previewName) previewName.textContent = val.toUpperCase() || "NOMBRE TITULAR";
            const valid = val.length >= 4;
            setFieldValidation(chkName, document.getElementById("chkNameHint"), valid, valid ? "Nombre válido" : "Ingresa el nombre completo del titular.");
        });
    }

    // Submit Checkout
    if (chkForm) {
        chkForm.addEventListener("submit", (e) => {
            e.preventDefault();

            if (!cart.length) {
                showToast("Tu carrito está vacío. Agrega productos antes de pagar.");
                return;
            }

            const isCardValid = validateCardNumber();
            const isExpValid = validateCardExpiry();
            const isCvvValid = validateCardCvv();
            const isNameValid = chkName.value.trim().length >= 4;
            const isPhoneValid = /^\d{10}$/.test(chkPhone.value.trim());

            if (!isCardValid || !isExpValid || !isCvvValid || !isNameValid || !isPhoneValid) {
                showToast("Verifica los datos de pago y entrega en rojo.");
                chkForm.classList.add("input-error-shake");
                setTimeout(() => chkForm.classList.remove("input-error-shake"), 400);
                return;
            }

            const totals = getCartTotals();
            const orderId = `FW-${Date.now().toString().slice(-6)}`;

            cart = [];
            persistCart();
            renderCart();
            chkForm.reset();

            showToast(`🎉 ¡Pago Aprobado! Orden #${orderId} confirmada por ${formatCOP(totals.total)}.`);

            const btn = document.getElementById("chkPayButton");
            if (btn) {
                btn.textContent = "✓ ¡Pago Exitoso!";
                btn.style.background = "var(--neon-green)";
                setTimeout(() => {
                    btn.textContent = "🔒 Pagar y Confirmar Pedido";
                    btn.style.background = "";
                }, 3000);
            }
        });
    }
}

function updateCheckoutSummary() {
    if (cart.length) {
        document.querySelector("#checkout .checkout-grid")?.classList.remove("hidden");
        document.getElementById("paymentSuccess")?.classList.add("hidden");
    }
    const totals = getCartTotals();
    const subEl = document.getElementById("checkoutSubtotalDisplay");
    const shipEl = document.getElementById("checkoutShippingDisplay");
    const totEl = document.getElementById("checkoutTotalDisplay");

    if (subEl) subEl.textContent = formatCOP(totals.subtotal);
    if (shipEl) shipEl.textContent = totals.shipping === 0 ? "¡GRATIS!" : formatCOP(totals.shipping);
    if (totEl) totEl.textContent = formatCOP(totals.total);
}

// ==========================================================================
// 10. CARRITO, MODALES & UTILIDADES
// ==========================================================================
function initCartModule() {
    const cartBtn = document.getElementById("cartBtn");
    const closeCartBtn = document.getElementById("closeCartBtn");
    const overlay = document.getElementById("overlay");
    const closeQuickViewBtn = document.getElementById("closeQuickViewBtn");
    const cartItems = document.getElementById("cartItems");

    if (cartBtn) cartBtn.addEventListener("click", openCartDrawer);
    if (closeCartBtn) closeCartBtn.addEventListener("click", closeCartDrawer);
    if (overlay) overlay.addEventListener("click", closeAllModals);
    if (closeQuickViewBtn) closeQuickViewBtn.addEventListener("click", closeQuickViewModal);

    if (cartItems) {
        cartItems.addEventListener("click", (e) => {
            const target = e.target.closest("button[data-cart-action]");
            if (!target) return;
            const action = target.dataset.cartAction;
            const pId = Number(target.dataset.id);
            updateCartItem(pId, action);
        });
    }

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") closeAllModals();
        if (event.key === "Tab") {
            const activeDialog = document.querySelector(".cart-drawer.is-open, .quickview-modal:not(.hidden)");
            if (activeDialog) trapDialogFocus(event, activeDialog);
        }
    });

    renderCart();
}

function addToCart(productId, triggerButton) {
    const p = products.find((prod) => prod.id === productId);
    if (!p) return;

    const existing = cart.find((item) => item.productId === productId);
    if (existing) existing.quantity += 1;
    else cart.push({ productId, quantity: 1 });

    persistCart();
    renderCart();
    updateCheckoutSummary();
    showToast(`✓ ${p.name} agregado al carrito.`);

    if (triggerButton) {
        const orig = triggerButton.textContent;
        triggerButton.textContent = "✓ Añadido";
        triggerButton.classList.add("is-added");
        triggerButton.disabled = true;
        setTimeout(() => {
            if (triggerButton.isConnected) {
                triggerButton.textContent = orig;
                triggerButton.classList.remove("is-added");
                triggerButton.disabled = false;
            }
        }, 850);
    }
}

function updateCartItem(productId, action) {
    const item = cart.find((i) => i.productId === productId);
    if (!item) return;

    if (action === "increase") item.quantity += 1;
    if (action === "decrease") {
        item.quantity -= 1;
        if (item.quantity <= 0) cart = cart.filter((i) => i.productId !== productId);
    }
    if (action === "remove") cart = cart.filter((i) => i.productId !== productId);

    persistCart();
    renderCart();
    updateCheckoutSummary();
}

function renderCart() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountEl = document.getElementById("cartCount");
    const cartItemsEl = document.getElementById("cartItems");
    const subtotalEl = document.getElementById("subtotalValue");
    const shippingEl = document.getElementById("shippingValue");
    const totalEl = document.getElementById("totalValue");
    const freeShippingMsg = document.getElementById("freeShippingMsg");
    const shippingProgressFill = document.getElementById("shippingProgressFill");

    if (cartCountEl) {
        cartCountEl.textContent = String(count);
        if (count !== lastCartCount) {
            cartCountEl.classList.remove("bump");
            void cartCountEl.offsetWidth;
            cartCountEl.classList.add("bump");
            lastCartCount = count;
        }
    }

    if (!cartItemsEl) return;

    if (!cart.length) {
        cartItemsEl.innerHTML = `
            <div style="padding: 32px 16px; text-align: center; color: var(--text-dim);">
                <p style="font-size: 1.1rem; font-weight: 800; color: var(--text-white); margin-bottom: 6px;">Tu carrito está vacío</p>
                <p style="font-size: 0.85rem;">Explora el catálogo y añade suministros.</p>
            </div>
        `;
        if (subtotalEl) subtotalEl.textContent = formatCOP(0);
        if (shippingEl) shippingEl.textContent = formatCOP(0);
        if (totalEl) totalEl.textContent = formatCOP(0);
        if (freeShippingMsg) freeShippingMsg.textContent = `¡Agrega productos por ${formatCOP(FREE_SHIPPING_THRESHOLD)} para Envío Gratis!`;
        if (shippingProgressFill) shippingProgressFill.style.width = "0%";
        return;
    }

    cartItemsEl.innerHTML = cart.map((line) => {
        const p = products.find((prod) => prod.id === line.productId);
        if (!p) return "";
        const unitPrice = getProductPrice(p);
        const graphic = getProductGraphic(p.name || p.icon, p.image);

        return `
            <article class="cart-item">
                <div class="cart-item-main">
                    <div class="cart-item-media">${graphic}</div>
                    <div class="cart-item-copy">
                        <h4>${escapeHTML(p.name)}</h4>
                        <p class="cart-unit-price">${formatCOP(unitPrice)} por unidad</p>
                        <strong>${formatCOP(unitPrice * line.quantity)}</strong>
                    </div>
                </div>
                <div class="cart-line">
                    <div class="qty-controls">
                        <button class="qty-btn" type="button" data-cart-action="decrease" data-id="${p.id}" aria-label="Restar una unidad de ${escapeHTML(p.name)}">−</button>
                        <span style="font-weight: 900; font-family: var(--font-mono); min-width: 20px; text-align: center;">${line.quantity}</span>
                        <button class="qty-btn" type="button" data-cart-action="increase" data-id="${p.id}" aria-label="Sumar una unidad de ${escapeHTML(p.name)}">+</button>
                    </div>
                    <button class="remove-btn" type="button" data-cart-action="remove" data-id="${p.id}" aria-label="Eliminar ${escapeHTML(p.name)} del carrito">Eliminar</button>
                </div>
            </article>
        `;
    }).join("");

    const totals = getCartTotals();
    if (subtotalEl) subtotalEl.textContent = formatCOP(totals.subtotal);
    if (shippingEl) shippingEl.textContent = totals.shipping === 0 ? "¡GRATIS!" : formatCOP(totals.shipping);
    if (totalEl) totalEl.textContent = formatCOP(totals.total);

    if (freeShippingMsg && shippingProgressFill) {
        if (totals.subtotal >= FREE_SHIPPING_THRESHOLD) {
            freeShippingMsg.innerHTML = "🎉 <strong>¡Felicidades! Tienes Envío Gratis Nacional.</strong>";
            shippingProgressFill.style.width = "100%";
        } else {
            const missing = FREE_SHIPPING_THRESHOLD - totals.subtotal;
            const progress = Math.min(100, Math.round((totals.subtotal / FREE_SHIPPING_THRESHOLD) * 100));
            freeShippingMsg.innerHTML = `Te faltan <strong>${formatCOP(missing)}</strong> para <strong>Envío Gratis</strong>`;
            shippingProgressFill.style.width = `${progress}%`;
        }
    }
}

function getCartTotals() {
    const subtotal = cart.reduce((sum, line) => {
        const p = products.find((prod) => prod.id === line.productId);
        return sum + (p ? getProductPrice(p) * line.quantity : 0);
    }, 0);

    const shipping = subtotal === 0 ? 0 : subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 15000;
    return { subtotal, shipping, total: subtotal + shipping };
}

function openQuickViewModal(productId) {
    const p = products.find((prod) => prod.id === productId);
    const modal = document.getElementById("quickViewModal");
    const content = document.getElementById("quickViewContent");
    const overlay = document.getElementById("overlay");
    if (!p || !modal || !content) return;

    const graphic = getProductGraphic(p.name || p.icon, p.image);
    const currentPrice = getProductPrice(p);
    const specsHTML = p.specs ? Object.entries(p.specs).map(([k, v]) => `
        <li style="display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid rgba(255,255,255,0.06);">
            <strong style="color: var(--text-dim);">${escapeHTML(k)}:</strong>
            <span style="color: var(--neon-green); font-family: var(--font-mono);">${escapeHTML(v)}</span>
        </li>
    `).join("") : "";

    content.innerHTML = `
        <div class="product-media" style="padding: 24px;">
            ${graphic}
        </div>
        <div style="display: grid; gap: 14px; align-content: start;">
            <span class="category-tag" style="width: fit-content;">${escapeHTML(p.category)}</span>
            <h3 style="font-size: 1.8rem; line-height: 1.05;">${escapeHTML(p.name)}</h3>
            <p style="color: var(--text-muted); font-size: 0.9rem;">${escapeHTML(p.description)}</p>
            ${currentPrice < p.price ? `<span class="price-before">${formatCOP(p.price)} · ${p.discountPercent}% de descuento</span>` : ""}
            <strong class="price" style="font-size: 1.8rem;">${formatCOP(currentPrice)}</strong>

            ${specsHTML ? `<ul style="list-style: none; background: rgba(1, 17, 11, 0.7); padding: 12px; border-radius: 8px; border: 1px solid var(--border-glass);">${specsHTML}</ul>` : ""}

            <button class="btn btn-neon-yellow full" type="button" id="quickAddCartBtn">
                🛒 Agregar al Carrito
            </button>
        </div>
    `;

    document.getElementById("quickAddCartBtn")?.addEventListener("click", () => {
        addToCart(p.id);
        setTimeout(closeQuickViewModal, 500);
    });

    modal.classList.remove("hidden");
    modal.classList.add("modal-pop");
    modal.setAttribute("aria-hidden", "false");
    if (overlay) overlay.classList.remove("hidden");
    document.body.classList.add("dialog-open");
    lastDialogTrigger = document.activeElement;
    window.setTimeout(() => document.getElementById("closeQuickViewBtn")?.focus(), 30);
}

function closeQuickViewModal() {
    const modal = document.getElementById("quickViewModal");
    const overlay = document.getElementById("overlay");
    if (modal) {
        modal.classList.add("hidden");
        modal.classList.remove("modal-pop");
        modal.setAttribute("aria-hidden", "true");
    }
    const cartDrawer = document.getElementById("cartDrawer");
    if (!cartDrawer || !cartDrawer.classList.contains("is-open")) {
        if (overlay) overlay.classList.add("hidden");
        document.body.classList.remove("dialog-open");
    }
}

function openCartDrawer() {
    const cartDrawer = document.getElementById("cartDrawer");
    const overlay = document.getElementById("overlay");
    if (cartDrawer) {
        lastDialogTrigger = document.activeElement;
        cartDrawer.classList.add("is-open");
        cartDrawer.setAttribute("aria-hidden", "false");
    }
    if (overlay) overlay.classList.remove("hidden");
    document.body.classList.add("dialog-open");
    window.setTimeout(() => document.getElementById("closeCartBtn")?.focus(), 30);
}

function closeCartDrawer() {
    const cartDrawer = document.getElementById("cartDrawer");
    const overlay = document.getElementById("overlay");
    if (cartDrawer) {
        cartDrawer.classList.remove("is-open");
        cartDrawer.setAttribute("aria-hidden", "true");
    }
    const quickView = document.getElementById("quickViewModal");
    if (!quickView || quickView.classList.contains("hidden")) {
        if (overlay) overlay.classList.add("hidden");
        document.body.classList.remove("dialog-open");
    }
    if (lastDialogTrigger instanceof HTMLElement && lastDialogTrigger.isConnected) lastDialogTrigger.focus();
}

function closeAllModals() {
    closeCartDrawer();
    closeQuickViewModal();
}

function trapDialogFocus(event, dialog) {
    const focusable = Array.from(dialog.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )).filter((element) => element.offsetParent !== null);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
    }
}

function updateAuthUI() {
    const navAuth = document.getElementById("navAuthLink");
    if (!navAuth) return;
    if (sessionUser) {
        navAuth.textContent = `Salir (${sessionUser.name.split(" ")[0]})`;
    } else {
        navAuth.textContent = "Ingreso";
    }
}

function showToast(msg) {
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove("show"), 2600);
}

function debounce(fn, wait) {
    let t;
    return (...args) => {
        clearTimeout(t);
        t = setTimeout(() => fn(...args), wait);
    };
}

function getProductPrice(product) {
    const price = Math.max(0, Number(product?.price) || 0);
    const discount = product?.onSale ? Math.min(90, Math.max(1, Number(product.discountPercent) || 0)) : 0;
    return discount ? Math.round(price * (1 - discount / 100)) : price;
}

function normalizeImageUrl(value) {
    const raw = String(value || "").trim();
    if (!raw) return "";
    if (/^data:image\/(?:png|jpeg|webp);base64,[a-z0-9+/=]+$/i.test(raw)) return raw;
    try {
        const url = new URL(raw);
        return ["http:", "https:"].includes(url.protocol) ? url.href : "";
    } catch {
        return "";
    }
}

function readImageFile(file) {
    const allowedTypes = new Set(["image/png", "image/jpeg", "image/webp"]);
    if (!allowedTypes.has(file.type)) return Promise.reject(new Error("Selecciona una imagen PNG, JPG o WebP."));
    if (file.size > 1_500_000) return Promise.reject(new Error("La imagen supera el límite de 1.5 MB."));

    return new Promise((resolveImage, rejectImage) => {
        const reader = new FileReader();
        reader.addEventListener("load", () => resolveImage(String(reader.result || "")), { once: true });
        reader.addEventListener("error", () => rejectImage(new Error("No fue posible leer la imagen seleccionada.")), { once: true });
        reader.readAsDataURL(file);
    });
}

function formatCOP(val) {
    return COP_FORMATTER.format(val);
}

function escapeHTML(str) {
    return String(str ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function persistCart() {
    saveToStorage("ferreweb-cart", cart);
}

function loadFromStorage(key, fallback) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : fallback;
    } catch {
        return fallback;
    }
}

function saveToStorage(key, val) {
    try {
        if (val === null) localStorage.removeItem(key);
        else localStorage.setItem(key, JSON.stringify(val));
    } catch {
        // La interfaz sigue operativa aunque el navegador bloquee el almacenamiento local.
    }
}

function loadAdminSession() {
    try {
        return sessionStorage.getItem("ferreweb-admin-auth") === "true";
    } catch {
        return false;
    }
}

function saveAdminSession(authenticated) {
    try {
        if (authenticated) sessionStorage.setItem("ferreweb-admin-auth", "true");
        else sessionStorage.removeItem("ferreweb-admin-auth");
    } catch {
        // La sesión queda activa solo en memoria cuando el navegador bloquea storage.
    }
}

function normalizeCart(val) {
    if (!Array.isArray(val)) return [];
    return val.map((item) => ({
        productId: Number(item.productId),
        quantity: Math.max(1, Number(item.quantity) || 1)
    })).filter((i) => Number.isFinite(i.productId) && i.productId > 0);
}

function normalizeUsers(val) {
    if (!Array.isArray(val)) return [];
    return val.map((u) => ({
        id: Number(u.id) || Date.now(),
        name: String(u.name || "").trim(),
        document: String(u.document || "").trim(),
        email: String(u.email || "").trim().toLowerCase(),
        password: String(u.password || "")
    })).filter((u) => u.name && u.email && u.password);
}

function normalizeSession(val) {
    if (!val || typeof val !== "object" || !val.name || !val.email) return null;
    return { id: Number(val.id) || Date.now(), name: String(val.name), email: String(val.email) };
}

function normalizeProducts(val) {
    if (!Array.isArray(val) || val.length === 0) return [...DEFAULT_PRODUCTS];
    return val.map((p, i) => ({
        id: Number(p.id) || Date.now() + i,
        name: String(p.name || "").trim(),
        category: String(p.category || "").trim(),
        description: String(p.description || "").trim(),
        price: Number(p.price) || 0,
        icon: String(p.icon || "PR").trim(),
        image: normalizeImageUrl(p.image),
        rating: Number(p.rating || 4.8),
        reviewsCount: Number(p.reviewsCount || 25),
        stock: Number(p.stock ?? 10),
        badge: p.badge || "",
        specs: p.specs || null,
        onSale: Boolean(p.onSale),
        discountPercent: p.onSale ? Math.min(90, Math.max(1, Number(p.discountPercent) || 10)) : 0
    })).filter((p) => p.name && p.category);
}
