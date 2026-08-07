// ========================================
// FERREWEB - MANEJO DEL CARRITO
// ========================================

// Constantes de configuración del carrito
const CART_STORAGE_KEY = 'ferreweb-cart';
const CART_EXPIRATION_TIME = 30 * 24 * 60 * 60 * 1000; // 30 días

// Función para guardar carrito en localStorage
function saveCart() {
    const cartData = {
        items: cart,
        lastModified: new Date().toISOString(),
        totalItems: cart.reduce((sum, item) => sum + item.quantity, 0),
        totalPrice: getCartTotal()
    };
    
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartData));
    console.log('💾 Carrito guardado');
}

// Función para cargar carrito desde localStorage
function loadCart() {
    try {
        const stored = localStorage.getItem(CART_STORAGE_KEY);
        if (stored) {
            const cartData = JSON.parse(stored);
            cart = cartData.items || [];
            console.log('📂 Carrito cargado:', cart.length, 'items');
            return cart;
        }
    } catch (error) {
        console.error('❌ Error cargando carrito:', error);
    }
    return [];
}

// Función para obtener total del carrito
function getCartTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Función para obtener cantidad de items en el carrito
function getCartItemCount() {
    return cart.reduce((count, item) => count + item.quantity, 0);
}

// Función para obtener cantidad de productos únicos
function getCartProductCount() {
    return cart.length;
}

// Función para limpiar carrito
function clearCart() {
    cart = [];
    localStorage.removeItem(CART_STORAGE_KEY);
    updateCartUI();
    showNotification('🗑️ Carrito vaciado');
    console.log('🗑️ Carrito limpiado');
}

// Función para obtener resumen del carrito
function getCartSummary() {
    return {
        itemCount: getCartProductCount(),
        totalQuantity: getCartItemCount(),
        subtotal: getCartTotal(),
        tax: Math.floor(getCartTotal() * 0.16),
        shipping: getCartTotal() > 10000 ? 0 : 500,
        total: getCartTotal() + Math.floor(getCartTotal() * 0.16) + (getCartTotal() > 10000 ? 0 : 500)
    };
}

// Función para aplicar cupón de descuento (simulado)
function applyCoupon(code) {
    const coupons = {
        'DESCUENTO10': 0.10,
        'DESCUENTO20': 0.20,
        'FERREWEB5': 0.05,
        'ENVIOGRATIS': 0 // Aplica solo en envío
    };
    
    if (coupons[code]) {
        const discount = coupons[code];
        console.log(`✅ Cupón ${code} aplicado: ${discount * 100}% descuento`);
        return discount;
    }
    
    showNotification('❌ Cupón no válido', 'error');
    return 0;
}

// Función para validar carrito antes de pagar
function validateCart() {
    if (cart.length === 0) {
        showNotification('El carrito está vacío', 'error');
        return false;
    }
    
    // Verificar disponibilidad de todos los productos
    for (const item of cart) {
        const product = getProductById(item.id);
        if (!product) {
            showNotification(`Producto ${item.name} no encontrado`, 'error');
            return false;
        }
        
        if (product.stock < item.quantity) {
            showNotification(`Stock insuficiente para ${item.name}`, 'error');
            return false;
        }
    }
    
    return true;
}

// Función para obtener recomendaciones basadas en el carrito
function getCartRecommendations(limit = 3) {
    const cartCategories = [...new Set(
        cart.map(item => {
            const product = getProductById(item.id);
            return product ? product.category : null;
        })
        .filter(Boolean)
    )];
    
    const recommendations = [];
    
    for (const category of cartCategories) {
        const categoryProducts = getProductsByCategory(category);
        const notInCart = categoryProducts.filter(p => 
            !cart.find(item => item.id === p.id)
        );
        
        recommendations.push(...notInCart);
    }
    
    // Retornar productos únicos ordenados por rating
    return [...new Set(recommendations)]
        .sort((a, b) => b.rating - a.rating)
        .slice(0, limit);
}

// Función para detectar cambios en el carrito
function detectCartChanges(newCart) {
    const changes = {
        added: [],
        removed: [],
        modified: []
    };
    
    // Items agregados o modificados
    newCart.forEach(newItem => {
        const oldItem = cart.find(item => item.id === newItem.id);
        
        if (!oldItem) {
            changes.added.push(newItem);
        } else if (oldItem.quantity !== newItem.quantity) {
            changes.modified.push({
                id: newItem.id,
                oldQuantity: oldItem.quantity,
                newQuantity: newItem.quantity
            });
        }
    });
    
    // Items removidos
    cart.forEach(oldItem => {
        if (!newCart.find(item => item.id === oldItem.id)) {
            changes.removed.push(oldItem);
        }
    });
    
    return changes;
}

// Función para generar ID de pedido
function generateOrderId() {
    return 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

// Función para serializar carrito para pago
function serializeCartForPayment() {
    return {
        orderId: generateOrderId(),
        items: cart.map(item => ({
            id: item.id,
            name: item.name,
            emoji: item.emoji,
            quantity: item.quantity,
            price: item.price,
            subtotal: item.price * item.quantity
        })),
        summary: getCartSummary(),
        timestamp: new Date().toISOString()
    };
}

// Función para exportar carrito a JSON
function exportCartAsJSON() {
    const data = serializeCartForPayment();
    const json = JSON.stringify(data, null, 2);
    
    // Crear y descargar archivo
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pedido-${data.orderId}.json`;
    a.click();
    
    console.log('📥 Carrito exportado:', data.orderId);
}

// Función para validar cantidades
function validateCartQuantities() {
    let isValid = true;
    
    cart.forEach(item => {
        const product = getProductById(item.id);
        if (product && item.quantity > product.stock) {
            showNotification(`${item.name}: cantidad ajustada a ${product.stock}`, 'warning');
            item.quantity = product.stock;
            isValid = false;
        }
    });
    
    saveCart();
    return isValid;
}

// Función para unir carritos (útil si el usuario cambia de dispositivo)
function mergeCart(externalCart) {
    externalCart.forEach(externalItem => {
        const existingItem = cart.find(item => item.id === externalItem.id);
        
        if (existingItem) {
            existingItem.quantity += externalItem.quantity;
        } else {
            cart.push(externalItem);
        }
    });
    
    saveCart();
    updateCartUI();
    showNotification('✅ Carrito sincronizado');
}

// Función para calcular envío
function calculateShipping() {
    const total = getCartTotal();
    const rules = [
        { minAmount: 10000, cost: 0, name: 'GRATIS' },
        { minAmount: 5000, cost: 500, name: 'EXPRESADO' },
        { minAmount: 0, cost: 1000, name: 'ESTÁNDAR' }
    ];
    
    for (const rule of rules) {
        if (total >= rule.minAmount) {
            return {
                cost: rule.cost,
                name: rule.name,
                message: rule.cost === 0 ? '✅ Envío GRATIS' : `Envío ${rule.name}: $${rule.cost}`
            };
        }
    }
}

// Función para obtener detalles del carrito para factura
function getCartInvoiceDetails() {
    const summary = getCartSummary();
    const shipping = calculateShipping();
    
    return {
        orderId: generateOrderId(),
        items: cart,
        subtotal: summary.subtotal,
        tax: summary.tax,
        shipping: shipping.cost,
        total: summary.subtotal + summary.tax + shipping.cost,
        shippingMethod: shipping.name,
        generatedAt: new Date().toLocaleString('es-MX')
    };
}

// Al cargar la página, cargar el carrito guardado
document.addEventListener('DOMContentLoaded', function() {
    if (cart.length === 0) {
        loadCart();
        updateCartUI();
    }
});

// Guardar carrito cuando cambie
document.addEventListener('beforeunload', function() {
    saveCart();
});
