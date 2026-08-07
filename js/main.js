import { initGlowingEffects } from './glow.js';

const DEFAULT_PRODUCTS = [
    {
        id: 1,
        name: "Taladro inalambrico 20V",
        category: "Herramientas",
        price: 429900,
        icon: "TL",
        description: "Potencia profesional para perforacion en concreto, metal y madera."
    },
    {
        id: 2,
        name: "Martillo anti impacto",
        category: "Herramientas",
        price: 79900,
        icon: "MT",
        description: "Mango ergonomico y cabeza reforzada para uso intensivo."
    },
    {
        id: 3,
        name: "Sierra circular 7 1/4",
        category: "Herramientas",
        price: 519900,
        icon: "SC",
        description: "Cortes limpios con disco de alta precision y protector de seguridad."
    },
    {
        id: 4,
        name: "Cemento gris x 50kg",
        category: "Materiales",
        price: 38900,
        icon: "CM",
        description: "Ideal para obra gris, reparaciones y mezcla estructural."
    },
    {
        id: 5,
        name: "Arena lavada x bulto",
        category: "Materiales",
        price: 17900,
        icon: "AR",
        description: "Granulometria balanceada para concretos y morteros uniformes."
    },
    {
        id: 6,
        name: "Juego brocas multiproposito",
        category: "Accesorios",
        price: 56900,
        icon: "BR",
        description: "Set de 15 piezas para concreto, madera y metal."
    },
    {
        id: 7,
        name: "Tuberia PVC 1/2 x 6m",
        category: "Plomeria",
        price: 23900,
        icon: "PV",
        description: "Resistente a humedad y presion para instalaciones domesticas."
    },
    {
        id: 8,
        name: "Llave grifa ajustable",
        category: "Plomeria",
        price: 68900,
        icon: "LL",
        description: "Ajuste rapido para mantenimiento de conexiones hidraulicas."
    },
    {
        id: 9,
        name: "Pintura interior blanca 1 galon",
        category: "Pinturas",
        price: 104900,
        icon: "PT",
        description: "Acabado mate premium con alta cobertura y secado rapido."
    },
    {
        id: 10,
        name: "Rodillo profesional 9",
        category: "Pinturas",
        price: 22900,
        icon: "RD",
        description: "Cobertura uniforme con fibra de alto rendimiento."
    },
    {
        id: 11,
        name: "Guantes de seguridad reforzados",
        category: "Seguridad",
        price: 34900,
        icon: "GU",
        description: "Proteccion antideslizante para trabajo en obra y taller."
    },
    {
        id: 12,
        name: "Casco de seguridad industrial",
        category: "Seguridad",
        price: 59900,
        icon: "CS",
        description: "Cumple estandares de proteccion para altura e impacto."
    }
];

const DEFAULT_PAYMENT_METHODS = [
    "Tarjeta credito/debito",
    "Tarjeta debito",
    "PSE",
    "Transferencia bancaria",
    "Nequi / DaviPlata",
    "PayPal",
    "Contra entrega"
];

const COP_FORMATTER = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0
});

const performanceMode = true;
const motionSafe = false;
const tiltEnabled = false;

document.documentElement.classList.add("performance-mode");

const dom = {
    productsGrid: document.getElementById("productsGrid"),
    searchInput: document.getElementById("searchInput"),
    categoryFilter: document.getElementById("categoryFilter"),
    sortFilter: document.getElementById("sortFilter"),
    resultsCount: document.getElementById("resultsCount"),
    offersNav: document.getElementById("offersNav"),
    offersSection: document.getElementById("ofertas"),
    offersGrid: document.getElementById("offersGrid"),
    cartBtn: document.getElementById("cartBtn"),
    cartCount: document.getElementById("cartCount"),
    cartDrawer: document.getElementById("cartDrawer"),
    closeCartBtn: document.getElementById("closeCartBtn"),
    cartItems: document.getElementById("cartItems"),
    subtotalValue: document.getElementById("subtotalValue"),
    shippingValue: document.getElementById("shippingValue"),
    totalValue: document.getElementById("totalValue"),
    checkoutForm: document.getElementById("checkoutForm"),
    checkoutName: document.getElementById("checkoutName"),
    paymentMethods: document.getElementById("paymentMethods"),
    overlay: document.getElementById("overlay"),
    toast: document.getElementById("toast"),
    authBtn: document.getElementById("authBtn"),
    authRegisterBtn: document.getElementById("authRegisterBtn"),
    authTriggers: document.querySelectorAll("[data-auth-open]"),
    authModal: document.getElementById("authModal"),
    closeAuthBtn: document.getElementById("closeAuthBtn"),
    authMessage: document.getElementById("authMessage"),
    loginForm: document.getElementById("loginForm"),
    registerForm: document.getElementById("registerForm"),
    authTabs: document.querySelectorAll(".auth-tab"),
    menuToggle: document.getElementById("menuToggle"),
    navLinks: document.getElementById("navLinks")
};

let products = [];
let categoryList = [];
let paymentMethods = [];
let offers = [];
let db = null;
let firebaseReady = false;
let firestoreApi = null;
let realtimeInitialized = false;

let cart = normalizeCart(loadFromStorage("ferreweb-cart", []));
let users = normalizeUsers(loadFromStorage("ferreweb-users", []));
let sessionUser = normalizeSession(loadFromStorage("ferreweb-session", null));
let revealObserver = null;
let lastCartCount = cart.reduce((sum, line) => sum + line.quantity, 0);

initStore();

function initStore() {
    initMenu();
    initAnchors();
    bindEvents();
    initMotionSystem();
    initDataLayer();
    renderCart();
    updateAuthUI();
}

function initMenu() {
    if (!dom.menuToggle || !dom.navLinks) return;

    dom.menuToggle.addEventListener("click", () => {
        const open = dom.navLinks.classList.toggle("open");
        dom.menuToggle.setAttribute("aria-expanded", String(open));
    });
}

function initAnchors() {
    const anchors = document.querySelectorAll('a[href^="#"]');

    anchors.forEach((anchor) => {
        anchor.addEventListener("click", (event) => {
            const targetSelector = anchor.getAttribute("href");
            if (!targetSelector || targetSelector === "#") return;
            const target = document.querySelector(targetSelector);
            if (!target) return;

            event.preventDefault();
            target.scrollIntoView({ behavior: "smooth", block: "start" });

            if (dom.navLinks) {
                dom.navLinks.classList.remove("open");
            }
            if (dom.menuToggle) {
                dom.menuToggle.setAttribute("aria-expanded", "false");
            }
        });
    });
}

function bindEvents() {
    const debouncedRefresh = debounce(refreshProductView, 140);

    if (dom.searchInput) {
        dom.searchInput.addEventListener("input", debouncedRefresh);
    }
    if (dom.categoryFilter) {
        dom.categoryFilter.addEventListener("change", refreshProductView);
    }
    if (dom.sortFilter) {
        dom.sortFilter.addEventListener("change", refreshProductView);
    }

    if (dom.productsGrid) {
        dom.productsGrid.addEventListener("click", (event) => {
            const targetButton = event.target.closest("[data-add-cart]");
            if (!targetButton) return;

            const productId = Number(targetButton.dataset.addCart);
            addToCart(productId);
        });
    }

    if (dom.cartBtn) {
        dom.cartBtn.addEventListener("click", openCartDrawer);
    }
    if (dom.closeCartBtn) {
        dom.closeCartBtn.addEventListener("click", closeCartDrawer);
    }
    if (dom.overlay) {
        dom.overlay.addEventListener("click", closeModals);
    }

    if (dom.cartItems) {
        dom.cartItems.addEventListener("click", (event) => {
            const target = event.target.closest("button[data-cart-action]");
            if (!target) return;

            const action = target.dataset.cartAction;
            const productId = Number(target.dataset.id);
            updateCartItem(productId, action);
        });
    }

    if (dom.checkoutForm) {
        dom.checkoutForm.addEventListener("submit", finalizePurchase);
    }

    if (dom.authTriggers.length) {
        dom.authTriggers.forEach((trigger) => {
            trigger.addEventListener("click", handleAuthTrigger);
        });
    } else if (dom.authBtn) {
        dom.authBtn.addEventListener("click", onAuthButtonClick);
    }
    if (dom.closeAuthBtn) {
        dom.closeAuthBtn.addEventListener("click", closeAuthModal);
    }

    if (dom.authTabs.length) {
        dom.authTabs.forEach((tabButton) => {
            tabButton.addEventListener("click", () => switchAuthTab(tabButton.dataset.authTab));
        });
    }

    if (dom.loginForm) {
        dom.loginForm.addEventListener("submit", handleLogin);
    }
    if (dom.registerForm) {
        dom.registerForm.addEventListener("submit", handleRegister);
    }
}

function initDataLayer() {
    products = normalizeProducts(loadFromStorage("ferreweb-products", DEFAULT_PRODUCTS));
    categoryList = normalizeCategories(loadFromStorage("ferreweb-categories", getDefaultCategories(DEFAULT_PRODUCTS)));
    paymentMethods = normalizePaymentMethods(loadFromStorage("ferreweb-payment-methods", DEFAULT_PAYMENT_METHODS));
    offers = normalizeOffers(loadFromStorage("ferreweb-offers", []));
    refreshStoreUI();
    void initFirebaseDataLayer();
}

async function initFirebaseDataLayer() {
    const firebaseDependencies = await loadFirebaseDependencies();
    if (!firebaseDependencies) return;

    db = firebaseDependencies.db;
    firestoreApi = firebaseDependencies.firestoreApi;
    firebaseReady = true;

    if (!realtimeInitialized) {
        realtimeInitialized = true;
        initRealtimeStore();
    }
}

async function loadFirebaseDependencies() {
    try {
        const firebaseInitModule = await import("./firebase-init.js");
        if (!firebaseInitModule.firebaseReady || !firebaseInitModule.db) {
            return null;
        }

        const firestoreModule = await import("https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js");

        return {
            db: firebaseInitModule.db,
            firestoreApi: {
                collection: firestoreModule.collection,
                onSnapshot: firestoreModule.onSnapshot,
                orderBy: firestoreModule.orderBy,
                query: firestoreModule.query
            }
        };
    } catch (error) {
        console.warn("Firebase unavailable. Running in local mode.", error);
        return null;
    }
}

function initRealtimeStore() {
    if (!firebaseReady || !db || !firestoreApi) return;
    const { collection, onSnapshot, orderBy, query } = firestoreApi;
    const productsRef = collection(db, "products");
    const categoriesRef = collection(db, "categories");
    const paymentRef = collection(db, "payment_methods");
    const offersRef = collection(db, "offers");

    onSnapshot(query(productsRef, orderBy("id")), (snapshot) => {
        products = normalizeProducts(
            snapshot.docs.map((docSnap) => ({
                id: Number(docSnap.id) || Number(docSnap.data().id) || Date.now(),
                ...docSnap.data()
            }))
        );
        refreshStoreUI();
    });

    onSnapshot(query(categoriesRef, orderBy("name")), (snapshot) => {
        categoryList = normalizeCategories(snapshot.docs.map((docSnap) => docSnap.data().name || docSnap.id));
        refreshStoreUI();
    });

    onSnapshot(query(paymentRef, orderBy("name")), (snapshot) => {
        paymentMethods = normalizePaymentMethods(snapshot.docs.map((docSnap) => docSnap.data().name || docSnap.id));
        refreshStoreUI();
    });

    onSnapshot(query(offersRef, orderBy("id")), (snapshot) => {
        offers = normalizeOffers(
            snapshot.docs.map((docSnap) => ({
                id: Number(docSnap.id) || Number(docSnap.data().id) || Date.now(),
                ...docSnap.data()
            }))
        );
        refreshStoreUI();
    });
}

function refreshStoreUI() {
    refreshCategoryFilter();
    renderPaymentMethods();
    renderProducts(getFilteredProducts());
    renderOffers();
}

function refreshProductView() {
    renderProducts(getFilteredProducts());
}

function initMotionSystem() {
    initCursorAura();
    initRevealObserver();
    applyInteractiveEffects(document);
}

function initCursorAura() {
    if (!motionSafe) return;

    let frameId = null;
    let lastX = 0;
    let lastY = 0;
    const root = document.documentElement;

    window.addEventListener(
        "pointermove",
        (event) => {
            lastX = event.clientX;
            lastY = event.clientY;

            if (frameId) return;
            frameId = window.requestAnimationFrame(() => {
                const x = (lastX / window.innerWidth) * 100;
                const y = (lastY / window.innerHeight) * 100;
                root.style.setProperty("--mx", `${x}%`);
                root.style.setProperty("--my", `${y}%`);
                frameId = null;
            });
        },
        { passive: true }
    );
}

function initRevealObserver() {
    if (!motionSafe || !("IntersectionObserver" in window)) {
        document
            .querySelectorAll(".section-head, .hero-copy, .hero-panel, .filters, .payment-card, .contact-card, .offer-card")
            .forEach((element) => {
            element.classList.add("is-visible");
        });
        return;
    }

    revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.2,
            rootMargin: "0px 0px -10% 0px"
        }
    );
}

function applyInteractiveEffects(scope) {
    const root = scope && scope.querySelectorAll ? scope : document;
    initGlowingEffects(root);

    const revealTargets = root.querySelectorAll(
        ".section-head, .hero-copy, .hero-panel, .filters, .payment-card, .contact-card, .product-card, .offer-card, .cart-item"
    );

    if (!motionSafe) {
        revealTargets.forEach((element) => {
            element.classList.remove("reveal-ready");
            element.classList.add("is-visible");
            element.style.transitionDelay = "";
        });
        return;
    }

    const staticTiltTargets = root.querySelectorAll(
        ".hero-copy, .filters, .payment-card, .contact-card, .product-card, .offer-card, .cart-summary, .cart-item"
    );
    if (tiltEnabled) {
        staticTiltTargets.forEach((card) => {
            card.classList.add("tilt-card");
            attachTilt(card);
        });
    }

    revealTargets.forEach((element, index) => {
        if (element.dataset.revealBound) return;
        element.dataset.revealBound = "1";
        element.classList.add("reveal-ready");
        element.style.transitionDelay = `${Math.min(index * 35, 280)}ms`;

        if (!revealObserver) {
            element.classList.add("is-visible");
            return;
        }

        revealObserver.observe(element);
    });
}

function attachTilt(card) {
    if (card.dataset.tiltBound) return;
    card.dataset.tiltBound = "1";

    if (!tiltEnabled) return;

    let rect = null;
    let frameId = null;
    let lastX = 0;
    let lastY = 0;

    const updateTilt = () => {
        if (!rect) {
            rect = card.getBoundingClientRect();
        }
        const offsetX = (lastX - rect.left) / rect.width;
        const offsetY = (lastY - rect.top) / rect.height;

        const rotateY = (offsetX - 0.5) * 9;
        const rotateX = (0.5 - offsetY) * 8;

        card.style.transform = `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translate3d(0,-6px,0)`;
        frameId = null;
    };

    card.addEventListener(
        "pointermove",
        (event) => {
            lastX = event.clientX;
            lastY = event.clientY;
            if (frameId) return;
            frameId = window.requestAnimationFrame(updateTilt);
        },
        { passive: true }
    );

    card.addEventListener("pointerenter", () => {
        rect = card.getBoundingClientRect();
    });

    card.addEventListener("pointerleave", () => {
        rect = null;
        card.style.transform = "";
    });
}

function refreshCategoryFilter() {
    if (!dom.categoryFilter) return;
    const current = dom.categoryFilter.value;
    const categories = getAllCategories();

    dom.categoryFilter.innerHTML = '<option value="">Todas las categorias</option>';

    categories.forEach((category) => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        dom.categoryFilter.appendChild(option);
    });

    if (categories.includes(current)) {
        dom.categoryFilter.value = current;
    }
}

function getFilteredProducts() {
    const search = dom.searchInput.value.trim().toLowerCase();
    const category = dom.categoryFilter.value;
    const sort = dom.sortFilter.value;

    let filtered = products.filter((product) => {
        const searchableText = `${product.name} ${product.description} ${product.category}`.toLowerCase();
        const matchSearch = search === "" || searchableText.includes(search);
        const matchCategory = category === "" || product.category === category;
        return matchSearch && matchCategory;
    });

    if (sort === "price-asc") {
        filtered = filtered.sort((a, b) => a.price - b.price);
    }

    if (sort === "price-desc") {
        filtered = filtered.sort((a, b) => b.price - a.price);
    }

    if (sort === "category") {
        filtered = filtered.sort((a, b) => a.category.localeCompare(b.category));
    }

    return filtered;
}

function renderProducts(productList) {
    if (!dom.resultsCount || !dom.productsGrid) return;
    dom.resultsCount.textContent = `${productList.length} producto(s) encontrados.`;

    if (!productList.length) {
        dom.productsGrid.innerHTML = `
            <article class="empty-state glass-card">
                No encontramos productos con esos filtros. Intenta otra busqueda o categoria.
            </article>
        `;
        return;
    }

    dom.productsGrid.innerHTML = productList
        .map(
            (product) => `
                <article class="product-card glass-card">
                    ${product.image ? `<div class="product-media"><img src="${product.image}" alt="${product.name}"></div>` : ""}
                    <div class="product-top">
                        <span class="product-icon">${product.icon}</span>
                        <span class="category-tag">${product.category}</span>
                    </div>
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-footer">
                        <strong class="price">${formatCOP(product.price)}</strong>
                        <button class="add-cart-btn" type="button" data-add-cart="${product.id}">Agregar</button>
                    </div>
                </article>
            `
        )
        .join("");

    applyInteractiveEffects(dom.productsGrid);
}

function renderPaymentMethods() {
    if (!dom.paymentMethods) return;

    const methods = paymentMethods.length ? paymentMethods : DEFAULT_PAYMENT_METHODS;
    dom.paymentMethods.innerHTML =
        `<legend>Metodo de pago</legend>` +
        methods
            .map(
                (method, index) =>
                    `<label><input type="radio" name="paymentMethod" value="${method}" ${index === 0 ? "checked" : ""}> ${method}</label>`
            )
            .join("");
}

function renderOffers() {
    if (!dom.offersSection || !dom.offersGrid || !dom.offersNav) return;

    const activeOffers = offers.filter((offer) => offer.active);
    const hasOffers = activeOffers.length > 0;

    dom.offersNav.classList.toggle("hidden", !hasOffers);
    dom.offersSection.classList.toggle("hidden", !hasOffers);
    dom.offersSection.setAttribute("aria-hidden", String(!hasOffers));

    if (!hasOffers) {
        dom.offersGrid.innerHTML = "";
        return;
    }

    dom.offersGrid.innerHTML = activeOffers
        .map((offer) => {
            const linkedProduct = products.find((product) => product.id === offer.productId);
            const offerImage = offer.image || (linkedProduct ? linkedProduct.image : "");
            const discount = Number(offer.discount) || 0;
            const basePrice = linkedProduct ? linkedProduct.price : null;
            const finalPrice = basePrice && discount ? Math.max(0, Math.round(basePrice * (1 - discount / 100))) : basePrice;

            return `
                <article class="offer-card glass-card">
                    ${offerImage ? `<div class="offer-media"><img src="${offerImage}" alt="${offer.title}"></div>` : ""}
                    <div class="offer-tags">
                        ${discount ? `<span class="offer-badge">-${discount}%</span>` : ""}
                        ${linkedProduct ? `<span class="offer-category">${linkedProduct.category}</span>` : ""}
                    </div>
                    <h3 class="offer-title">${offer.title}</h3>
                    <p class="offer-description">${offer.description}</p>
                    ${
                        basePrice
                            ? `<div class="offer-price">
                                ${discount ? `<span class="price-old">${formatCOP(basePrice)}</span>` : ""}
                                <strong class="price">${formatCOP(finalPrice)}</strong>
                               </div>`
                            : ""
                    }
                </article>
            `;
        })
        .join("");

    applyInteractiveEffects(dom.offersGrid);
}

function addToCart(productId) {
    const foundProduct = products.find((product) => product.id === productId);
    if (!foundProduct) return;

    const existingLine = cart.find((line) => line.productId === productId);
    if (existingLine) {
        existingLine.quantity += 1;
    } else {
        cart.push({ productId, quantity: 1 });
    }

    persistCart();
    renderCart();
    showToast(`${foundProduct.name} agregado al carrito.`);
}

function updateCartItem(productId, action) {
    const line = cart.find((item) => item.productId === productId);
    if (!line) return;

    if (action === "increase") {
        line.quantity += 1;
    }

    if (action === "decrease") {
        line.quantity -= 1;
        if (line.quantity <= 0) {
            cart = cart.filter((item) => item.productId !== productId);
        }
    }

    if (action === "remove") {
        cart = cart.filter((item) => item.productId !== productId);
    }

    persistCart();
    renderCart();
}

function renderCart() {
    const totalItems = cart.reduce((sum, line) => sum + line.quantity, 0);

    if (!cart.length) {
        dom.cartItems.innerHTML = `
            <article class="empty-state glass-card">
                Tu carrito esta vacio. Agrega productos del catalogo para iniciar la compra.
            </article>
        `;

        dom.subtotalValue.textContent = formatCOP(0);
        dom.shippingValue.textContent = formatCOP(0);
        dom.totalValue.textContent = formatCOP(0);
        updateCartCountDisplay(totalItems);

        dom.checkoutForm.querySelectorAll("input, button").forEach((field) => {
            field.disabled = true;
        });

        applyInteractiveEffects(dom.cartItems);

        return;
    }

    dom.checkoutForm.querySelectorAll("input, button").forEach((field) => {
        field.disabled = false;
    });

    dom.cartItems.innerHTML = cart
        .map((line) => {
            const product = products.find((item) => item.id === line.productId);
            if (!product) return "";

            return `
                <article class="cart-item">
                    <div class="cart-line">
                        <h4>${product.name}</h4>
                        <strong>${formatCOP(product.price * line.quantity)}</strong>
                    </div>
                    <div class="cart-line">
                        <div class="qty-controls">
                            <button class="qty-btn" type="button" data-cart-action="decrease" data-id="${product.id}">-</button>
                            <span>${line.quantity}</span>
                            <button class="qty-btn" type="button" data-cart-action="increase" data-id="${product.id}">+</button>
                        </div>
                        <button class="remove-btn" type="button" data-cart-action="remove" data-id="${product.id}">Eliminar</button>
                    </div>
                </article>
            `;
        })
        .join("");

    const totals = getCartTotals();
    dom.subtotalValue.textContent = formatCOP(totals.subtotal);
    dom.shippingValue.textContent = formatCOP(totals.shipping);
    dom.totalValue.textContent = formatCOP(totals.total);
    updateCartCountDisplay(totalItems);
    applyInteractiveEffects(dom.cartItems);
}

function updateCartCountDisplay(totalItems) {
    dom.cartCount.textContent = String(totalItems);

    if (totalItems !== lastCartCount) {
        dom.cartCount.classList.remove("bump");
        void dom.cartCount.offsetWidth;
        dom.cartCount.classList.add("bump");
        lastCartCount = totalItems;
    }
}

function getCartTotals() {
    const subtotal = cart.reduce((sum, line) => {
        const product = products.find((item) => item.id === line.productId);
        if (!product) return sum;
        return sum + product.price * line.quantity;
    }, 0);

    const shipping = subtotal === 0 ? 0 : subtotal >= 350000 ? 0 : 15000;
    return {
        subtotal,
        shipping,
        total: subtotal + shipping
    };
}

function finalizePurchase(event) {
    event.preventDefault();

    if (!cart.length) {
        showToast("Tu carrito esta vacio.");
        return;
    }

    const paymentMethodInput = document.querySelector('input[name="paymentMethod"]:checked');
    const paymentMethod = paymentMethodInput ? paymentMethodInput.value : "No definido";

    const customerName = document.getElementById("checkoutName").value.trim();
    const customerPhone = document.getElementById("checkoutPhone").value.trim();
    const customerAddress = document.getElementById("checkoutAddress").value.trim();

    if (!customerName || !customerPhone || !customerAddress) {
        showToast("Completa todos los datos para finalizar tu compra.");
        return;
    }

    const totals = getCartTotals();
    const orderMessage = `Compra confirmada por ${formatCOP(totals.total)} con pago ${paymentMethod}.`;

    cart = [];
    persistCart();
    renderCart();

    dom.checkoutForm.reset();
    if (sessionUser && dom.checkoutName) {
        dom.checkoutName.value = sessionUser.name;
    }

    showToast(orderMessage);
    closeCartDrawer();
}

function handleAuthTrigger(event) {
    const trigger = event.currentTarget;

    if (trigger === dom.authBtn) {
        onAuthButtonClick();
        return;
    }

    const tabName = trigger.dataset.authOpen || "login";
    openAuthModal(tabName);
}

function onAuthButtonClick() {
    if (sessionUser) {
        sessionUser = null;
        saveToStorage("ferreweb-session", null);
        updateAuthUI();
        showToast("Sesion cerrada.");
        return;
    }

    openAuthModal("login");
}

function switchAuthTab(tabName) {
    if (dom.authTabs.length) {
        dom.authTabs.forEach((button) => {
            button.classList.toggle("active", button.dataset.authTab === tabName);
        });
    }

    const showLogin = tabName === "login";
    if (dom.loginForm) {
        dom.loginForm.classList.toggle("hidden", !showLogin);
    }
    if (dom.registerForm) {
        dom.registerForm.classList.toggle("hidden", showLogin);
    }
    if (dom.authMessage) {
        dom.authMessage.textContent = "";
    }
}

function handleRegister(event) {
    event.preventDefault();

    const name = document.getElementById("registerName").value.trim();
    const email = document.getElementById("registerEmail").value.trim().toLowerCase();
    const password = document.getElementById("registerPassword").value;

    if (!name || !email || !password) {
        dom.authMessage.textContent = "Completa todos los campos para registrarte.";
        return;
    }

    const alreadyExists = users.some((user) => user.email === email);
    if (alreadyExists) {
        dom.authMessage.textContent = "Ese correo ya esta registrado. Inicia sesion.";
        return;
    }

    const newUser = {
        id: Date.now(),
        name,
        email,
        password
    };

    users.push(newUser);
    saveToStorage("ferreweb-users", users);

    sessionUser = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
    };

    saveToStorage("ferreweb-session", sessionUser);

    dom.registerForm.reset();
    updateAuthUI();
    showToast("Registro exitoso. Ya puedes comprar.");
    closeAuthModal();
}

function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value.trim().toLowerCase();
    const password = document.getElementById("loginPassword").value;

    const foundUser = users.find((user) => user.email === email && user.password === password);
    if (!foundUser) {
        dom.authMessage.textContent = "Credenciales invalidas. Verifica correo y contrasena.";
        return;
    }

    sessionUser = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email
    };

    saveToStorage("ferreweb-session", sessionUser);

    dom.loginForm.reset();
    updateAuthUI();
    showToast(`Bienvenido, ${sessionUser.name}.`);
    closeAuthModal();
}

function updateAuthUI() {
    if (!dom.authBtn) return;
    if (sessionUser) {
        dom.authBtn.textContent = `Cerrar sesion (${sessionUser.name.split(" ")[0]})`;
        if (dom.authRegisterBtn) {
            dom.authRegisterBtn.classList.add("hidden");
        }
        if (dom.checkoutName) {
            dom.checkoutName.value = sessionUser.name;
        }
        return;
    }

    dom.authBtn.textContent = "Iniciar sesion";
    if (dom.authRegisterBtn) {
        dom.authRegisterBtn.classList.remove("hidden");
    }
}

function openCartDrawer() {
    dom.cartDrawer.classList.remove("hidden");
    dom.cartDrawer.setAttribute("aria-hidden", "false");
    dom.overlay.classList.remove("hidden");
    dom.cartDrawer.classList.remove("drawer-pop");
    void dom.cartDrawer.offsetWidth;
    dom.cartDrawer.classList.add("drawer-pop");
}

function closeCartDrawer() {
    dom.cartDrawer.classList.add("hidden");
    dom.cartDrawer.setAttribute("aria-hidden", "true");
    dom.cartDrawer.classList.remove("drawer-pop");
    if (dom.authModal.classList.contains("hidden")) {
        dom.overlay.classList.add("hidden");
    }
}

function openAuthModal(tabName) {
    if (!dom.authModal) return;
    switchAuthTab(tabName);
    dom.authModal.classList.remove("hidden");
    dom.authModal.setAttribute("aria-hidden", "false");
    if (dom.overlay) {
        dom.overlay.classList.remove("hidden");
    }
    dom.authModal.classList.remove("modal-pop");
    void dom.authModal.offsetWidth;
    dom.authModal.classList.add("modal-pop");
}

function closeAuthModal() {
    if (!dom.authModal) return;
    dom.authModal.classList.add("hidden");
    dom.authModal.setAttribute("aria-hidden", "true");
    if (dom.authMessage) {
        dom.authMessage.textContent = "";
    }
    dom.authModal.classList.remove("modal-pop");
    if (dom.cartDrawer && dom.cartDrawer.classList.contains("hidden") && dom.overlay) {
        dom.overlay.classList.add("hidden");
    }
}

function closeModals() {
    closeCartDrawer();
    closeAuthModal();
}

function showToast(message) {
    dom.toast.textContent = message;
    dom.toast.classList.add("show");

    window.clearTimeout(showToast.timeoutId);
    showToast.timeoutId = window.setTimeout(() => {
        dom.toast.classList.remove("show");
    }, 2500);
}

function debounce(callback, wait) {
    let timeoutId = null;
    return (...args) => {
        window.clearTimeout(timeoutId);
        timeoutId = window.setTimeout(() => callback(...args), wait);
    };
}

function formatCOP(value) {
    return COP_FORMATTER.format(value);
}

function persistCart() {
    saveToStorage("ferreweb-cart", cart);
}

function loadFromStorage(key, fallback) {
    try {
        const raw = localStorage.getItem(key);
        if (!raw) return fallback;
        return JSON.parse(raw);
    } catch (error) {
        return fallback;
    }
}

function saveToStorage(key, value) {
    if (value === null) {
        localStorage.removeItem(key);
        return;
    }

    localStorage.setItem(key, JSON.stringify(value));
}

function normalizeCart(value) {
    if (!Array.isArray(value)) return [];

    return value
        .map((line) => ({
            productId: Number(line.productId),
            quantity: Math.max(1, Number(line.quantity) || 1)
        }))
        .filter((line) => Number.isFinite(line.productId) && line.productId > 0);
}

function normalizeUsers(value) {
    if (!Array.isArray(value)) return [];

    return value
        .map((user) => ({
            id: Number(user.id) || Date.now(),
            name: String(user.name || "").trim(),
            email: String(user.email || "").trim().toLowerCase(),
            password: String(user.password || "")
        }))
        .filter((user) => user.name && user.email && user.password);
}

function normalizeSession(value) {
    if (!value || typeof value !== "object") return null;
    if (!value.name || !value.email) return null;

    return {
        id: Number(value.id) || Date.now(),
        name: String(value.name),
        email: String(value.email).toLowerCase()
    };
}

function getDefaultCategories(list) {
    if (!Array.isArray(list)) return [];
    return [...new Set(list.map((product) => String(product.category || "").trim()).filter(Boolean))].sort();
}

function getAllCategories() {
    const merged = new Set([...categoryList, ...products.map((product) => product.category)]);
    return [...merged].filter(Boolean).sort();
}

function createProductIcon(name) {
    const cleaned = String(name || "").trim();
    if (!cleaned) return "PR";
    const parts = cleaned.split(/\s+/).filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

function normalizeProducts(value) {
    if (!Array.isArray(value)) return [...DEFAULT_PRODUCTS];

    return value
        .map((product, index) => {
            const name = String(product.name || "").trim();
            const category = String(product.category || "").trim();
            const description = String(product.description || "").trim();
            const price = Number(product.price);
            const icon = String(product.icon || "").trim();
            const image = String(product.image || "").trim();

            return {
                id: Number(product.id) || Date.now() + index,
                name,
                category,
                description,
                price: Number.isFinite(price) ? price : 0,
                icon: icon || createProductIcon(name),
                image
            };
        })
        .filter((product) => product.name && product.category);
}

function normalizeCategories(value) {
    if (!Array.isArray(value)) return [];
    const cleaned = value
        .map((category) => String(category || "").trim())
        .filter(Boolean);
    return [...new Set(cleaned)].sort();
}

function normalizePaymentMethods(value) {
    if (!Array.isArray(value)) return [];
    const cleaned = value
        .map((method) => String(method || "").trim())
        .filter(Boolean);
    return [...new Set(cleaned)];
}

function normalizeOffers(value) {
    if (!Array.isArray(value)) return [];

    return value
        .map((offer, index) => {
            const title = String(offer.title || "").trim();
            const description = String(offer.description || "").trim();
            const discountRaw = Number(offer.discount);
            const productId = Number(offer.productId);
            const image = String(offer.image || "").trim();

            return {
                id: Number(offer.id) || Date.now() + index,
                title,
                description,
                discount: Number.isFinite(discountRaw) ? Math.min(Math.max(discountRaw, 0), 90) : 0,
                productId: Number.isFinite(productId) && productId > 0 ? productId : null,
                image,
                active: Boolean(offer.active)
            };
        })
        .filter((offer) => offer.title);
}


