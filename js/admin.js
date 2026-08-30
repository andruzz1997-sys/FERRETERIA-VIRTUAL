import { auth, db, firebaseReady, storage } from "./firebase-init.js";
import {
    collection,
    deleteDoc,
    doc,
    onSnapshot,
    orderBy,
    query,
    setDoc
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
import { getDownloadURL, ref, uploadBytes } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-storage.js";
import { onAuthStateChanged, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

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

const STORAGE_KEYS = {
    products: "ferreweb-products",
    categories: "ferreweb-categories",
    paymentMethods: "ferreweb-payment-methods",
    offers: "ferreweb-offers"
};

const COP_FORMATTER = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0
});

const dom = {
    adminStatus: document.getElementById("adminStatus"),
    adminContent: document.getElementById("adminContent"),
    productForm: document.getElementById("productForm"),
    productId: document.getElementById("productId"),
    productName: document.getElementById("productName"),
    productCategory: document.getElementById("productCategory"),
    categoryOptions: document.getElementById("categoryOptions"),
    productPrice: document.getElementById("productPrice"),
    productDescription: document.getElementById("productDescription"),
    productImageUrl: document.getElementById("productImageUrl"),
    productImageFile: document.getElementById("productImageFile"),
    productImagePreview: document.getElementById("productImagePreview"),
    productCancelBtn: document.getElementById("productCancelBtn"),
    productSearch: document.getElementById("productSearch"),
    productsList: document.getElementById("productsList"),
    categoryForm: document.getElementById("categoryForm"),
    categoryName: document.getElementById("categoryName"),
    categoriesList: document.getElementById("categoriesList"),
    paymentForm: document.getElementById("paymentForm"),
    paymentName: document.getElementById("paymentName"),
    paymentsList: document.getElementById("paymentsList"),
    offerForm: document.getElementById("offerForm"),
    offerTitle: document.getElementById("offerTitle"),
    offerDescription: document.getElementById("offerDescription"),
    offerDiscount: document.getElementById("offerDiscount"),
    offerProduct: document.getElementById("offerProduct"),
    offerImageUrl: document.getElementById("offerImageUrl"),
    offerImageFile: document.getElementById("offerImageFile"),
    offerImagePreview: document.getElementById("offerImagePreview"),
    offerActive: document.getElementById("offerActive"),
    offersList: document.getElementById("offersList"),
    editModal: document.getElementById("editModal"),
    editModalClose: document.getElementById("editModalClose"),
    editModalCancel: document.getElementById("editModalCancel"),
    editProductForm: document.getElementById("editProductForm"),
    editProductId: document.getElementById("editProductId"),
    editProductName: document.getElementById("editProductName"),
    editProductCategory: document.getElementById("editProductCategory"),
    editProductPrice: document.getElementById("editProductPrice"),
    editProductDescription: document.getElementById("editProductDescription"),
    editProductImageUrl: document.getElementById("editProductImageUrl"),
    editProductImageFile: document.getElementById("editProductImageFile"),
    editProductImagePreview: document.getElementById("editProductImagePreview")
};

let products = normalizeProducts(loadFromStorage(STORAGE_KEYS.products, DEFAULT_PRODUCTS));
let categories = normalizeCategories(loadFromStorage(STORAGE_KEYS.categories, getDefaultCategories(products)));
let paymentMethods = normalizePaymentMethods(loadFromStorage(STORAGE_KEYS.paymentMethods, DEFAULT_PAYMENT_METHODS));
let offers = normalizeOffers(loadFromStorage(STORAGE_KEYS.offers, []));

let editingProductId = null;
let productImageData = "";
let productImageFile = null;
let editImageData = "";
let editImageFile = null;
let offerImageData = "";
let offerImageFile = null;
let productSearchTerm = "";

initAdmin();

function initAdmin() {
    if (!firebaseReady) {
        setAdminStatus("Configura Firebase en firebase-config.js para continuar.");
        disableAdminUI();
        return;
    }

    bindEvents();
    initAuth();
}

function bindEvents() {
    if (dom.productForm) {
        dom.productForm.addEventListener("submit", handleProductSubmit);
    }
    if (dom.productImageFile) {
        dom.productImageFile.addEventListener("change", handleProductImageChange);
    }
    if (dom.productCancelBtn) {
        dom.productCancelBtn.addEventListener("click", resetProductForm);
    }
    if (dom.productSearch) {
        dom.productSearch.addEventListener("input", handleProductSearch);
    }
    if (dom.productsList) {
        dom.productsList.addEventListener("click", handleProductListClick);
    }

    if (dom.categoryForm) {
        dom.categoryForm.addEventListener("submit", handleCategorySubmit);
    }
    if (dom.categoriesList) {
        dom.categoriesList.addEventListener("click", handleCategoryListClick);
    }

    if (dom.paymentForm) {
        dom.paymentForm.addEventListener("submit", handlePaymentSubmit);
    }
    if (dom.paymentsList) {
        dom.paymentsList.addEventListener("click", handlePaymentListClick);
    }

    if (dom.offerForm) {
        dom.offerForm.addEventListener("submit", handleOfferSubmit);
    }
    if (dom.offerImageFile) {
        dom.offerImageFile.addEventListener("change", handleOfferImageChange);
    }
    if (dom.offersList) {
        dom.offersList.addEventListener("click", handleOfferListClick);
    }

    if (dom.editProductForm) {
        dom.editProductForm.addEventListener("submit", handleEditProductSubmit);
    }
    if (dom.editProductImageFile) {
        dom.editProductImageFile.addEventListener("change", handleEditProductImageChange);
    }
    if (dom.editModalClose) {
        dom.editModalClose.addEventListener("click", closeEditModal);
    }
    if (dom.editModalCancel) {
        dom.editModalCancel.addEventListener("click", closeEditModal);
    }
    if (dom.editModal) {
        dom.editModal.addEventListener("click", (event) => {
            if (event.target === dom.editModal) {
                closeEditModal();
            }
        });
    }
}

function initAuth() {
    if (!auth) return;

    setAdminStatus("Conectando al panel...");
    disableAdminUI();

    onAuthStateChanged(auth, (user) => {
        if (user) {
            setAdminStatus("Panel listo para editar.");
            enableAdminUI();
            initRealtimeData();
        } else {
            setAdminStatus("Conectando al panel...");
            clearRealtime();
            disableAdminUI();
        }
    });

    signInAnonymously(auth).catch(() => {
        setAdminStatus("No se pudo iniciar sesion automatica. Activa el acceso anonimo en Firebase Auth.");
        disableAdminUI();
    });
}

function setAdminStatus(message) {
    if (dom.adminStatus) {
        dom.adminStatus.textContent = message;
    }
}

function setAdminFieldsDisabled(disabled) {
    if (!dom.adminContent) return;
    dom.adminContent.querySelectorAll("input, textarea, select, button").forEach((field) => {
        field.disabled = disabled;
    });
}

function disableAdminUI() {
    setAdminFieldsDisabled(true);
}

function enableAdminUI() {
    setAdminFieldsDisabled(false);
}

let unsubscribes = [];

function initRealtimeData() {
    clearRealtime();
    subscribeProducts();
    subscribeCategories();
    subscribePaymentMethods();
    subscribeOffers();
}

function clearRealtime() {
    unsubscribes.forEach((stop) => stop());
    unsubscribes = [];
}

function subscribeProducts() {
    const productsRef = collection(db, "products");
    const productsQuery = query(productsRef, orderBy("id"));
    const unsubscribe = onSnapshot(productsQuery, (snapshot) => {
        products = normalizeProducts(
            snapshot.docs.map((docSnap) => ({
                id: Number(docSnap.id) || Number(docSnap.data().id) || Date.now(),
                ...docSnap.data()
            }))
        );
        renderProductsList();
        renderOfferProductOptions();
        renderCategoryOptions();
    });
    unsubscribes.push(unsubscribe);
}

function subscribeCategories() {
    const categoriesRef = collection(db, "categories");
    const categoriesQuery = query(categoriesRef, orderBy("name"));
    const unsubscribe = onSnapshot(categoriesQuery, (snapshot) => {
        categories = normalizeCategories(snapshot.docs.map((docSnap) => docSnap.data().name || docSnap.id));
        renderCategories();
        renderCategoryOptions();
    });
    unsubscribes.push(unsubscribe);
}

function subscribePaymentMethods() {
    const methodsRef = collection(db, "payment_methods");
    const methodsQuery = query(methodsRef, orderBy("name"));
    const unsubscribe = onSnapshot(methodsQuery, (snapshot) => {
        paymentMethods = normalizePaymentMethods(snapshot.docs.map((docSnap) => docSnap.data().name || docSnap.id));
        renderPaymentMethods();
    });
    unsubscribes.push(unsubscribe);
}

function subscribeOffers() {
    const offersRef = collection(db, "offers");
    const offersQuery = query(offersRef, orderBy("id"));
    const unsubscribe = onSnapshot(offersQuery, (snapshot) => {
        offers = normalizeOffers(
            snapshot.docs.map((docSnap) => ({
                id: Number(docSnap.id) || Number(docSnap.data().id) || Date.now(),
                ...docSnap.data()
            }))
        );
        renderOffersList();
    });
    unsubscribes.push(unsubscribe);
}

function renderAll() {
    renderCategoryOptions();
    renderProductsList();
    renderCategories();
    renderPaymentMethods();
    renderOfferProductOptions();
    renderOffersList();
}

function renderCategoryOptions() {
    if (!dom.categoryOptions) return;
    const options = getAllCategories();
    dom.categoryOptions.innerHTML = options.map((category) => `<option value="${category}"></option>`).join("");
}

function renderProductsList() {
    if (!dom.productsList) return;

    const filtered = getFilteredProducts();

    if (!filtered.length) {
        dom.productsList.innerHTML = `<div class="admin-item">No hay productos para mostrar.</div>`;
        return;
    }

    dom.productsList.innerHTML = filtered
        .map(
            (product) => `
            <div class="admin-item">
                <div class="admin-item-row">
                    <span class="admin-item-title">${product.name}</span>
                    <div class="admin-buttons">
                        <button class="btn btn-ghost" type="button" data-action="edit" data-id="${product.id}">Editar</button>
                        <button class="btn btn-ghost" type="button" data-action="delete" data-id="${product.id}">Eliminar</button>
                    </div>
                </div>
                <div class="admin-item-meta">${product.category} · ${formatCOP(product.price)}</div>
            </div>
        `
        )
        .join("");
}

function handleProductSearch(event) {
    productSearchTerm = event.target.value.trim().toLowerCase();
    renderProductsList();
}

function getFilteredProducts() {
    if (!productSearchTerm) return products;

    return products.filter((product) => {
        const text = `${product.name} ${product.category} ${product.description}`.toLowerCase();
        return text.includes(productSearchTerm);
    });
}

async function handleProductSubmit(event) {
    event.preventDefault();
    if (!dom.productName || !dom.productCategory || !dom.productPrice) return;

    const name = dom.productName.value.trim();
    const category = dom.productCategory.value.trim();
    const description = dom.productDescription ? dom.productDescription.value.trim() : "";
    const price = Number(dom.productPrice.value);
    const imageUrl = dom.productImageUrl ? dom.productImageUrl.value.trim() : "";
    let image = imageUrl;

    if (!name || !category || !Number.isFinite(price)) return;

    if (productImageFile) {
        image = await uploadImage(productImageFile, "products");
    }

    const newId = getNextId(products);
    const payload = {
        id: newId,
        name,
        category,
        description,
        price,
        image,
        icon: createProductIcon(name)
    };

    await setDoc(doc(db, "products", String(newId)), payload);

    if (!categories.includes(category)) {
        const key = createKey(category);
        await setDoc(doc(db, "categories", key), { name: category });
    }

    resetProductForm();
}

function handleProductImageChange(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    productImageFile = file;
    readFileAsDataUrl(file).then((dataUrl) => {
        productImageData = dataUrl;
        if (dom.productImageUrl) {
            dom.productImageUrl.value = "";
        }
        renderImagePreview(dom.productImagePreview, dataUrl);
    });
}

async function handleProductListClick(event) {
    const button = event.target.closest("button[data-action]");
    if (!button) return;

    const id = Number(button.dataset.id);
    if (!id) return;

    if (button.dataset.action === "edit") {
        openEditModal(id);
    }

    if (button.dataset.action === "delete") {
        await deleteDoc(doc(db, "products", String(id)));
    }
}

function openEditModal(id) {
    const product = products.find((item) => item.id === id);
    if (!product || !dom.editModal) return;

    editingProductId = id;
    dom.editProductId.value = String(product.id);
    dom.editProductName.value = product.name;
    dom.editProductCategory.value = product.category;
    dom.editProductPrice.value = String(product.price);
    dom.editProductDescription.value = product.description || "";

    editImageData = product.image || "";
    editImageFile = null;
    if (dom.editProductImageUrl) {
        dom.editProductImageUrl.value = product.image && !product.image.startsWith("data:") ? product.image : "";
    }
    renderImagePreview(dom.editProductImagePreview, product.image);

    dom.editModal.classList.add("is-open");
    dom.editModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("admin-modal-open");
    window.setTimeout(() => {
        dom.editProductName.focus();
    }, 0);
}

function closeEditModal() {
    if (!dom.editModal) return;
    dom.editModal.classList.remove("is-open");
    dom.editModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("admin-modal-open");
    editingProductId = null;
    editImageData = "";
    editImageFile = null;
    if (dom.editProductForm) dom.editProductForm.reset();
    renderImagePreview(dom.editProductImagePreview, "");
}

async function handleEditProductSubmit(event) {
    event.preventDefault();
    if (!editingProductId) return;

    const name = dom.editProductName.value.trim();
    const category = dom.editProductCategory.value.trim();
    const description = dom.editProductDescription.value.trim();
    const price = Number(dom.editProductPrice.value);
    const imageUrl = dom.editProductImageUrl.value.trim();
    let image = editImageData || imageUrl;

    if (!name || !category || !Number.isFinite(price)) return;

    if (editImageFile) {
        image = await uploadImage(editImageFile, "products");
    }

    if (!categories.includes(category)) {
        const key = createKey(category);
        await setDoc(doc(db, "categories", key), { name: category });
    }

    await setDoc(
        doc(db, "products", String(editingProductId)),
        {
            id: editingProductId,
            name,
            category,
            description,
            price,
            image,
            icon: createProductIcon(name)
        },
        { merge: true }
    );

    closeEditModal();
}

function handleEditProductImageChange(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    editImageFile = file;
    readFileAsDataUrl(file).then((dataUrl) => {
        editImageData = dataUrl;
        dom.editProductImageUrl.value = "";
        renderImagePreview(dom.editProductImagePreview, dataUrl);
    });
}

function resetProductForm() {
    productImageData = "";
    productImageFile = null;
    if (dom.productForm) dom.productForm.reset();
    renderImagePreview(dom.productImagePreview, "");
}

async function handleCategorySubmit(event) {
    event.preventDefault();
    if (!dom.categoryName) return;

    const name = dom.categoryName.value.trim();
    if (!name) return;

    const key = createKey(name);
    await setDoc(doc(db, "categories", key), { name });
    dom.categoryForm.reset();
}

async function handleCategoryListClick(event) {
    const button = event.target.closest("button[data-category]");
    if (!button) return;

    const category = button.dataset.category;
    const key = createKey(category);
    await deleteDoc(doc(db, "categories", key));
}

function renderCategories() {
    if (!dom.categoriesList) return;

    dom.categoriesList.innerHTML = categories
        .map(
            (category) =>
                `<span class="admin-chip">${category}<button type="button" data-category="${category}">x</button></span>`
        )
        .join("");
}

async function handlePaymentSubmit(event) {
    event.preventDefault();
    if (!dom.paymentName) return;

    const name = dom.paymentName.value.trim();
    if (!name) return;

    const key = createKey(name);
    await setDoc(doc(db, "payment_methods", key), { name });
    dom.paymentForm.reset();
}

async function handlePaymentListClick(event) {
    const button = event.target.closest("button[data-payment]");
    if (!button) return;

    const method = button.dataset.payment;
    const key = createKey(method);
    await deleteDoc(doc(db, "payment_methods", key));
}

function renderPaymentMethods() {
    if (!dom.paymentsList) return;

    dom.paymentsList.innerHTML = paymentMethods
        .map(
            (method) =>
                `<span class="admin-chip">${method}<button type="button" data-payment="${method}">x</button></span>`
        )
        .join("");
}

async function handleOfferSubmit(event) {
    event.preventDefault();
    if (!dom.offerTitle) return;

    const title = dom.offerTitle.value.trim();
    const description = dom.offerDescription ? dom.offerDescription.value.trim() : "";
    const discount = Number(dom.offerDiscount ? dom.offerDiscount.value : 0);
    const productId = Number(dom.offerProduct ? dom.offerProduct.value : 0) || null;
    const imageUrl = dom.offerImageUrl ? dom.offerImageUrl.value.trim() : "";
    let image = imageUrl;
    const active = dom.offerActive ? dom.offerActive.checked : true;

    if (!title) return;

    if (offerImageFile) {
        image = await uploadImage(offerImageFile, "offers");
    }

    const id = Date.now();
    await setDoc(doc(db, "offers", String(id)), {
        id,
        title,
        description,
        discount: Number.isFinite(discount) ? Math.min(Math.max(discount, 0), 90) : 0,
        productId,
        image,
        active
    });

    offerImageData = "";
    offerImageFile = null;
    dom.offerForm.reset();
    renderImagePreview(dom.offerImagePreview, "");
}

function handleOfferImageChange(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    offerImageFile = file;
    readFileAsDataUrl(file).then((dataUrl) => {
        offerImageData = dataUrl;
        if (dom.offerImageUrl) {
            dom.offerImageUrl.value = "";
        }
        renderImagePreview(dom.offerImagePreview, dataUrl);
    });
}

async function handleOfferListClick(event) {
    const button = event.target.closest("button[data-offer-action]");
    if (!button) return;

    const id = String(button.dataset.id);
    if (!id) return;

    if (button.dataset.offerAction === "toggle") {
        const offer = offers.find((item) => String(item.id) === id);
        if (offer) {
            await setDoc(doc(db, "offers", id), { active: !offer.active }, { merge: true });
        }
    }

    if (button.dataset.offerAction === "delete") {
        await deleteDoc(doc(db, "offers", id));
    }
}

function renderOfferProductOptions() {
    if (!dom.offerProduct) return;
    const options = [
        `<option value="">Sin producto</option>`,
        ...products.map((product) => `<option value="${product.id}">${product.name}</option>`)
    ];
    dom.offerProduct.innerHTML = options.join("");
}

function renderOffersList() {
    if (!dom.offersList) return;

    if (!offers.length) {
        dom.offersList.innerHTML = `<div class="admin-item">No hay ofertas registradas.</div>`;
        return;
    }

    dom.offersList.innerHTML = offers
        .map((offer) => {
            const linkedProduct = products.find((product) => product.id === offer.productId);
            return `
                <div class="admin-item">
                    <div class="admin-item-row">
                        <span class="admin-item-title">${offer.title}</span>
                        <div class="admin-buttons">
                            <button class="btn btn-ghost" type="button" data-offer-action="toggle" data-id="${offer.id}">
                                ${offer.active ? "Desactivar" : "Activar"}
                            </button>
                            <button class="btn btn-ghost" type="button" data-offer-action="delete" data-id="${offer.id}">
                                Eliminar
                            </button>
                        </div>
                    </div>
                    <div class="admin-item-meta">
                        ${offer.discount ? `-${offer.discount}%` : "Sin descuento"}
                        ${linkedProduct ? ` · ${linkedProduct.name}` : ""}
                    </div>
                </div>
            `;
        })
        .join("");
}

function renderImagePreview(container, src) {
    if (!container) return;
    if (!src) {
        container.textContent = "Sin imagen cargada";
        return;
    }
    container.innerHTML = `<img src="${src}" alt="Vista previa">`;
}

async function uploadImage(file, folder) {
    if (!storage) return "";
    const ext = file.name.split(".").pop() || "jpg";
    const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const fileRef = ref(storage, `${folder}/${safeName}`);
    await uploadBytes(fileRef, file);
    return await getDownloadURL(fileRef);
}

function readFileAsDataUrl(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(file);
    });
}

function createKey(value) {
    const cleaned = String(value || "").toLowerCase().trim();
    const slug = cleaned.replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    return slug || `item-${Date.now()}`;
}

function getNextId(list) {
    const maxId = list.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0);
    return maxId + 1;
}

function getDefaultCategories(list) {
    if (!Array.isArray(list)) return [];
    return [...new Set(list.map((product) => String(product.category || "").trim()).filter(Boolean))].sort();
}

function getAllCategories() {
    const merged = new Set([...categories, ...products.map((product) => product.category)]);
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
    if (!Array.isArray(value)) return [...DEFAULT_PAYMENT_METHODS];
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
    localStorage.setItem(key, JSON.stringify(value));
}

function formatCOP(value) {
    return COP_FORMATTER.format(value);
}
