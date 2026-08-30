import { spawn } from "node:child_process";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const root = resolve(process.cwd());
const profile = resolve(root, ".tmp", "chrome-smoke-profile");
if (!profile.startsWith(root)) throw new Error("Perfil temporal fuera del proyecto");
mkdirSync(profile, { recursive: true });

const chrome = spawn(chromePath, [
    "--headless=new",
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    "--remote-debugging-port=9333",
    `--user-data-dir=${profile}`,
    "about:blank"
], { stdio: "ignore", windowsHide: true });

const delay = (ms) => new Promise((resolveDelay) => setTimeout(resolveDelay, ms));

async function waitForEndpoint() {
    for (let attempt = 0; attempt < 40; attempt += 1) {
        try {
            const response = await fetch("http://127.0.0.1:9333/json/version");
            if (response.ok) return;
        } catch {}
        await delay(125);
    }
    throw new Error("Chrome DevTools no inició");
}

class CDP {
    constructor(url) {
        this.id = 0;
        this.pending = new Map();
        this.errors = [];
        this.socket = new WebSocket(url);
    }

    async connect() {
        await new Promise((resolveConnect, reject) => {
            this.socket.addEventListener("open", resolveConnect, { once: true });
            this.socket.addEventListener("error", reject, { once: true });
        });
        this.socket.addEventListener("message", (event) => {
            const message = JSON.parse(event.data);
            if (message.id && this.pending.has(message.id)) {
                const { resolve: resolveMessage, reject } = this.pending.get(message.id);
                this.pending.delete(message.id);
                if (message.error) reject(new Error(message.error.message));
                else resolveMessage(message.result);
            }
            if (message.method === "Runtime.exceptionThrown") {
                this.errors.push(message.params.exceptionDetails.text);
            }
            if (message.method === "Log.entryAdded" && message.params.entry.level === "error") {
                this.errors.push(message.params.entry.text);
            }
        });
    }

    send(method, params = {}) {
        const id = ++this.id;
        return new Promise((resolveMessage, reject) => {
            this.pending.set(id, { resolve: resolveMessage, reject });
            this.socket.send(JSON.stringify({ id, method, params }));
        });
    }

    async evaluate(expression) {
        const response = await this.send("Runtime.evaluate", {
            expression,
            awaitPromise: true,
            returnByValue: true
        });
        if (response.exceptionDetails) throw new Error(response.exceptionDetails.text);
        return response.result.value;
    }

    close() {
        this.socket.close();
    }
}

async function poll(cdp, expression, label, timeout = 5000) {
    const started = Date.now();
    while (Date.now() - started < timeout) {
        if (await cdp.evaluate(expression)) return;
        await delay(100);
    }
    throw new Error(`Tiempo agotado: ${label}`);
}

async function capture(cdp, name) {
    const screenshot = await cdp.send("Page.captureScreenshot", { format: "png", captureBeyondViewport: false });
    writeFileSync(resolve(root, ".tmp", name), Buffer.from(screenshot.data, "base64"));
}

async function run() {
    await waitForEndpoint();
    const targetResponse = await fetch("http://127.0.0.1:9333/json/new?http://localhost:3000/index.html", { method: "PUT" });
    const target = await targetResponse.json();
    const cdp = new CDP(target.webSocketDebuggerUrl);
    await cdp.connect();
    await cdp.send("Runtime.enable");
    await cdp.send("Page.enable");
    await cdp.send("Log.enable");
    await poll(cdp, "document.readyState === 'complete' && window._ferrewebInitialized === true", "inicio de aplicación", 10000);
    await cdp.send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 1100, deviceScaleFactor: 1, mobile: false });
    await capture(cdp, "home-desktop.png");

    const initial = await cdp.evaluate(`({
        title: document.title,
        products: document.querySelectorAll('.product-card').length,
        cart: document.getElementById('cartCount').textContent
    })`);
    if (initial.products !== 12 || initial.cart !== "0") throw new Error(`Estado inicial inválido: ${JSON.stringify(initial)}`);

    await cdp.evaluate(`document.querySelector('[data-route="catalogo"]').click(); document.querySelector('[data-category="Herramientas"]').click();`);
    await cdp.send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
    await capture(cdp, "catalog-mobile.png");
    const category = await cdp.evaluate(`({
        count: document.querySelectorAll('.product-card').length,
        pressed: document.querySelector('[data-category="Herramientas"]').getAttribute('aria-pressed')
    })`);
    if (category.count !== 3 || category.pressed !== "true") throw new Error(`Filtro inválido: ${JSON.stringify(category)}`);

    await cdp.evaluate(`document.querySelector('.product-card [data-add-cart]').click(); document.getElementById('cartBtn').click();`);
    await poll(cdp, "document.getElementById('cartDrawer').classList.contains('is-open')", "apertura del carrito");
    await capture(cdp, "cart-mobile.png");
    await cdp.evaluate(`document.querySelector('[data-cart-action="increase"]').click()`);
    const cartState = await cdp.evaluate(`({ count: document.getElementById('cartCount').textContent, image: Boolean(document.querySelector('.cart-item-media')) })`);
    if (cartState.count !== "2" || !cartState.image) throw new Error(`Carrito inválido: ${JSON.stringify(cartState)}`);
    await cdp.evaluate(`document.getElementById('closeCartBtn').click(); document.querySelector('[data-route="admin"]').click();`);
    await cdp.send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
    await capture(cdp, "admin-login.png");

    const protectedState = await cdp.evaluate(`({ login: !document.getElementById('adminLoginPanel').classList.contains('hidden'), dashboard: !document.getElementById('adminDashboard').classList.contains('hidden') })`);
    if (!protectedState.login || protectedState.dashboard) throw new Error("El Admin no inició protegido");

    await cdp.evaluate(`
        document.getElementById('adminUsername').value='Admin';
        document.getElementById('adminPassword').value='admin123';
        document.getElementById('adminLoginForm').requestSubmit();
    `);
    await poll(cdp, "!document.getElementById('adminDashboard').classList.contains('hidden')", "login administrador");

    await cdp.evaluate(`
        document.getElementById('adminProdName').value='Pulidora de prueba';
        document.getElementById('adminProdCategory').value='Herramientas';
        document.getElementById('adminProdPrice').value='200000';
        document.getElementById('adminProdStock').value='8';
        document.getElementById('adminProdDesc').value='Producto técnico de prueba automatizada';
        document.getElementById('adminProdOnSale').checked=true;
        document.getElementById('adminProdOnSale').dispatchEvent(new Event('change',{bubbles:true}));
        document.getElementById('adminProdDiscount').value='20';
        document.getElementById('adminProductForm').requestSubmit();
        document.getElementById('adminPromoMessage').value='Oferta nacional de prueba';
        document.getElementById('adminPromoForm').requestSubmit();
    `);
    const adminState = await cdp.evaluate(`({ count: document.getElementById('adminTotalCount').textContent, promo: document.getElementById('globalPromoText').textContent, visible: !document.getElementById('globalPromoBanner').classList.contains('hidden') })`);
    if (adminState.count !== "13" || !adminState.visible || !adminState.promo.includes("Oferta")) throw new Error(`Admin inválido: ${JSON.stringify(adminState)}`);
    await capture(cdp, "admin-dashboard.png");

    await cdp.evaluate(`
        document.querySelector('[data-route="cotizador"]').click();
        const select=document.getElementById('quoteProductSelect'); select.selectedIndex=select.options.length-1;
        document.getElementById('quoteAddProductBtn').click();
        document.getElementById('quoteZone').value='curumani';
        document.getElementById('quoteZone').dispatchEvent(new Event('change',{bubbles:true}));
    `);
    const quoteState = await cdp.evaluate(`({ city: document.getElementById('quoteCityDisplay').textContent, rows: document.querySelectorAll('#quoteTableBody tr').length, total: document.getElementById('quoteTotalDisplay').textContent })`);
    if (quoteState.city !== "Curumaní" || quoteState.rows !== 1 || quoteState.total === "$0") throw new Error(`Cotizador inválido: ${JSON.stringify(quoteState)}`);

    await cdp.evaluate(`document.getElementById('quoteTransferToCartBtn').click(); document.getElementById('goToCheckoutFromCartBtn').click();`);
    await cdp.evaluate(`
        const cash=document.querySelector('input[name="paymentMethod"][value="cash"]'); cash.checked=true; cash.dispatchEvent(new Event('change',{bubbles:true}));
        document.getElementById('chkName').value='Cliente de Prueba';
        document.getElementById('chkPhone').value='3101234567';
        document.getElementById('chkEmail').value='cliente@prueba.co';
        document.getElementById('chkCity').value='Curumaní';
        document.getElementById('spaCheckoutForm').requestSubmit();
    `);
    await poll(cdp, "!document.getElementById('paymentSuccess').classList.contains('hidden')", "confirmación de pago", 8000);
    await capture(cdp, "checkout-success.png");
    const checkoutState = await cdp.evaluate(`({
        order: document.getElementById('invoiceOrderId').textContent,
        rows: document.querySelectorAll('#invoiceItems tr').length,
        notice: document.getElementById('paymentNotificationText').textContent,
        cart: document.getElementById('cartCount').textContent
    })`);
    if (!checkoutState.order.startsWith("FW-") || checkoutState.rows < 2 || !checkoutState.notice.includes("cliente@prueba.co") || checkoutState.cart !== "0") {
        throw new Error(`Checkout inválido: ${JSON.stringify(checkoutState)}`);
    }

    if (cdp.errors.length) throw new Error(`Errores del navegador: ${cdp.errors.join(" | ")}`);
    cdp.close();
    return { initial, category, cartState, adminState, quoteState, checkoutState };
}

try {
    const result = await run();
    console.log(JSON.stringify({ ok: true, result }, null, 2));
} finally {
    chrome.kill();
    await delay(250);
    if (profile.startsWith(root)) rmSync(profile, { recursive: true, force: true });
}
