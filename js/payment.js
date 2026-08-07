// ========================================
// FERREWEB - PROCESAMIENTO DE PAGOS
// ========================================

let paymentHistory = JSON.parse(localStorage.getItem('ferreweb-payments')) || [];

// ConfiguraciÃ³n de mÃ©todos de pago
const PAYMENT_METHODS = {
    credit: {
        name: 'Tarjeta de Credito/Debito',
        icon: '💳',
        fee: 0.02,
        requiresVerification: true
    },
    pse: {
        name: 'PSE',
        icon: '🏛️',
        fee: 0.015,
        requiresVerification: true
    },
    transfer: {
        name: 'Transferencia Bancaria',
        icon: '🏦',
        fee: 0.01,
        requiresVerification: false
    },
    nequi: {
        name: 'Nequi / DaviPlata',
        icon: '📲',
        fee: 0.012,
        requiresVerification: true
    },
    cash: {
        name: 'Efectivo en Recepcion',
        icon: '💵',
        fee: 0.03,
        requiresVerification: false
    },
    digital: {
        name: 'Billetera Digital',
        icon: '📱',
        fee: 0.015,
        requiresVerification: true
    },
    paypal: {
        name: 'PayPal',
        icon: '🌐',
        fee: 0.03,
        requiresVerification: true
    }
};

// Inicializar formulario de pago
document.addEventListener('DOMContentLoaded', function() {
    initializePaymentForm();
});

function initializePaymentForm() {
    const paymentForm = document.getElementById('paymentForm');
    
    if (paymentForm) {
        paymentForm.addEventListener('submit', handlePaymentSubmit);
    }
    
    // Validar campos de tarjeta
    const cardNumber = document.getElementById('cardNumber');
    const cardExpiry = document.getElementById('cardExpiry');
    const cardCVV = document.getElementById('cardCVV');
    
    if (cardNumber) {
        cardNumber.addEventListener('input', formatCardNumber);
        cardNumber.addEventListener('keyup', validateCardNumber);
    }
    
    if (cardExpiry) {
        cardExpiry.addEventListener('input', formatCardExpiry);
    }
    
    if (cardCVV) {
        cardCVV.addEventListener('input', validateCardCVV);
    }
}

// Manejar envÃ­o del formulario de pago
async function handlePaymentSubmit(e) {
    e.preventDefault();
    
    // Validar carrito
    if (!validateCart()) {
        return;
    }
    
    // Obtener datos del formulario
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
    
    const paymentData = {
        method: paymentMethod,
        customer: {
            fullName: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            city: document.getElementById('city').value
        },
        cart: cart,
        summary: getCartSummary(),
        timestamp: new Date().toISOString()
    };
    
    // Validar datos
    if (!validatePaymentData(paymentData)) {
        return;
    }
    
    // Procesar pago segÃºn mÃ©todo
    try {
        showNotification('â³ Procesando pago...');
        
        let result;
        switch(paymentMethod) {
            case 'credit':
                result = await processCardPayment(paymentData);
                break;
            case 'pse':
                result = await processPsePayment(paymentData);
                break;
            case 'transfer':
                result = await processTransferPayment(paymentData);
                break;
            case 'nequi':
                result = await processNequiPayment(paymentData);
                break;
            case 'cash':
                result = await processCashPayment(paymentData);
                break;
            case 'digital':
                result = await processDigitalPayment(paymentData);
                break;
            case 'paypal':
                result = await processPayPalPayment(paymentData);
                break;
            default:
                result = {
                    success: false,
                    error: 'Metodo de pago no soportado'
                };
                break;
        }
        
        if (result.success) {
            handlePaymentSuccess(result);
        } else {
            handlePaymentError(result.error);
        }
    } catch (error) {
        console.error('Error procesando pago:', error);
        handlePaymentError('Error al procesar el pago');
    }
}

// Procesar pago con tarjeta
async function processCardPayment(paymentData) {
    // SimulaciÃ³n de procesamiento
    return new Promise(resolve => {
        setTimeout(() => {
            const isValid = validateCardPayment(paymentData);
            
            if (isValid) {
                resolve({
                    success: true,
                    transactionId: generateTransactionId(),
                    method: 'Tarjeta de CrÃ©dito'
                });
            } else {
                resolve({
                    success: false,
                    error: 'Datos de tarjeta invÃ¡lidos'
                });
            }
        }, 2000);
    });
}

// Procesar transferencia bancaria
async function processTransferPayment(paymentData) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({
                success: true,
                transactionId: generateTransactionId(),
                method: 'Transferencia Bancaria',
                bankDetails: {
                    bankName: 'Banco FerrreWeb',
                    accountNumber: '1234567890',
                    reference: generateTransactionId()
                }
            });
        }, 1500);
    });
}

// Procesar pago PSE
async function processPsePayment(paymentData) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({
                success: true,
                transactionId: generateTransactionId(),
                method: 'PSE',
                bankGateway: 'Pasarela Bancaria Segura'
            });
        }, 1800);
    });
}

// Procesar pago Nequi/DaviPlata
async function processNequiPayment(paymentData) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({
                success: true,
                transactionId: generateTransactionId(),
                method: 'Nequi / DaviPlata',
                walletVerified: true
            });
        }, 1300);
    });
}

// Procesar pago en efectivo
async function processCashPayment(paymentData) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({
                success: true,
                transactionId: generateTransactionId(),
                method: 'Efectivo en Recepcion',
                agentAssigned: 'Agente ' + Math.floor(Math.random() * 100)
            });
        }, 1000);
    });
}

// Procesar pago digital
async function processDigitalPayment(paymentData) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({
                success: true,
                transactionId: generateTransactionId(),
                method: 'Billetera Digital',
                walletVerified: true
            });
        }, 2500);
    });
}

// Procesar pago PayPal
async function processPayPalPayment(paymentData) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({
                success: true,
                transactionId: generateTransactionId(),
                method: 'PayPal',
                accountLinked: true
            });
        }, 2000);
    });
}

// Manejar exito de pago
function handlePaymentSuccess(result) {
    const orderId = generateOrderId();
    const orderAmount = getCartSummary().total;

    // Guardar pago en historial
    const payment = {
        orderId: orderId,
        transactionId: result.transactionId,
        method: result.method,
        amount: orderAmount,
        items: cart.length,
        date: new Date().toISOString(),
        status: 'completed'
    };

    paymentHistory.push(payment);
    localStorage.setItem('ferreweb-payments', JSON.stringify(paymentHistory));

    // Limpiar carrito
    clearCart();

    // Mostrar confirmacion
    showPaymentConfirmation(orderId, result, orderAmount);

    // Enviar email de confirmacion (simulado)
    sendConfirmationEmail(document.getElementById('email').value, orderId);

    // Ocultar checkout
    document.getElementById('checkout').classList.add('hidden');

    showNotification(`✅ ¡Pago exitoso! Orden: ${orderId}`, 'success');

    // Scroll a inicio
    setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 500);
}

// Manejar error de pago
function handlePaymentError(error) {
    showNotification(`âŒ Error: ${error}`, 'error');
    console.error('Error de pago:', error);
}

// Mostrar confirmaciÃ³n de pago
function showPaymentConfirmation(orderId, result, amount) {
    const confirmationHTML = `
        <div style="
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
            z-index: 2000;
            max-width: 500px;
            text-align: center;
            animation: scaleIn 0.4s ease-out;
        ">
            <h2 style="color: #2fb91a; margin-bottom: 1rem;">✅ ¡Pago Completado!</h2>
            <p style="font-size: 1.1rem; margin: 1rem 0;">Gracias por tu compra</p>
            <div style="background: #f5f5f5; padding: 1.5rem; border-radius: 8px; margin: 1.5rem 0;">
                <p><strong>Numero de Orden:</strong></p>
                <p style="color: #2fb91a; font-size: 1.2rem; font-family: monospace;">${orderId}</p>
                <p style="margin-top: 1rem; color: gray; font-size: 0.9rem;">Guarda este numero para tu referencia</p>
            </div>
            <div style="text-align: left; background: #f5f5f5; padding: 1rem; border-radius: 8px; margin: 1rem 0;">
                <p><strong>Metodo de Pago:</strong> ${result.method}</p>
                <p><strong>ID de Transaccion:</strong> <span style="font-family: monospace;">${result.transactionId}</span></p>
                <p><strong>Monto:</strong> $${amount.toLocaleString()}</p>
            </div>
            <p style="color: gray; font-size: 0.85rem; margin-top: 1rem;">Se ha enviado una confirmacion a tu correo electronico</p>
            <button class="btn-primary" onclick="closePaymentConfirmation()" style="width: 100%; margin-top: 1.5rem;">
                Aceptar
            </button>
        </div>
        <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 1999;" onclick="closePaymentConfirmation()"></div>
    `;

    document.body.insertAdjacentHTML('beforeend', confirmationHTML);
}

// Cerrar confirmacion de pago
function closePaymentConfirmation() {
    const overlay = document.querySelector('[style*="z-index: 1999"]');
    const confirmation = document.querySelector('[style*="z-index: 2000"]');
    
    if (overlay) overlay.remove();
    if (confirmation) confirmation.remove();
}

// Validar datos de pago
function validatePaymentData(paymentData) {
    const { customer } = paymentData;
    
    // Validar campos requeridos
    if (!customer.fullName || !customer.email || !customer.phone || !customer.address || !customer.city) {
        showNotification('Por favor completa todos los campos', 'error');
        return false;
    }
    
    // Validar email
    if (!isValidEmail(customer.email)) {
        showNotification('Email invÃ¡lido', 'error');
        return false;
    }
    
    // Validar telÃ©fono
    if (!isValidPhone(customer.phone)) {
        showNotification('TelÃ©fono invÃ¡lido', 'error');
        return false;
    }
    
    return true;
}

// Validar pago con tarjeta
function validateCardPayment(paymentData) {
    const cardNumber = document.getElementById('cardNumber').value;
    const cardExpiry = document.getElementById('cardExpiry').value;
    const cardCVV = document.getElementById('cardCVV').value;
    
    // Remover espacios
    const cleanCardNumber = cardNumber.replace(/\s/g, '');
    
    // Validar nÃºmero de tarjeta (Luhn algorithm)
    if (!isValidCardNumber(cleanCardNumber)) {
        return false;
    }
    
    // Validar fecha de expiraciÃ³n
    if (!isValidCardExpiry(cardExpiry)) {
        return false;
    }
    
    // Validar CVV
    if (!isValidCVV(cardCVV)) {
        return false;
    }
    
    return true;
}

// Algoritmo de Luhn para validar nÃºmero de tarjeta
function isValidCardNumber(cardNumber) {
    let sum = 0;
    let isEven = false;
    
    for (let i = cardNumber.length - 1; i >= 0; i--) {
        let digit = parseInt(cardNumber[i], 10);
        
        if (isEven) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }
        
        sum += digit;
        isEven = !isEven;
    }
    
    return sum % 10 === 0;
}

// Validar fecha de expiraciÃ³n
function isValidCardExpiry(expiry) {
    const match = expiry.match(/^(\d{2})\/(\d{2})$/);
    if (!match) return false;
    
    const month = parseInt(match[1], 10);
    const year = parseInt(match[2], 10);
    
    if (month < 1 || month > 12) return false;
    
    const now = new Date();
    const currentYear = now.getFullYear() % 100;
    const currentMonth = now.getMonth() + 1;
    
    if (year < currentYear) return false;
    if (year === currentYear && month < currentMonth) return false;
    
    return true;
}

// Validar CVV
function isValidCVV(cvv) {
    return /^\d{3,4}$/.test(cvv);
}

// Validar email
function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Validar telÃ©fono
function isValidPhone(phone) {
    const regex = /^[\d\s\-\+\(\)]{7,}$/;
    return regex.test(phone);
}

// Formatear nÃºmero de tarjeta
function formatCardNumber(e) {
    let value = e.target.value.replace(/\s+/g, '');
    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    e.target.value = formattedValue;
}

// Formatear fecha de expiraciÃ³n
function formatCardExpiry(e) {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    
    e.target.value = value;
}

// Validar CVV
function validateCardCVV(e) {
    e.target.value = e.target.value.replace(/\D/g, '');
}

// Validar nÃºmero de tarjeta
function validateCardNumber(e) {
    const cardNumber = e.target.value.replace(/\s/g, '');
    
    if (cardNumber.length !== 16) {
        e.target.style.borderColor = '#ff6b6b';
    } else if (isValidCardNumber(cardNumber)) {
        e.target.style.borderColor = '#2fb91a';
    } else {
        e.target.style.borderColor = '#ff6b6b';
    }
}

// Generar ID de transacciÃ³n
function generateTransactionId() {
    return 'TXN-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

// Generar ID de orden
function generateOrderId() {
    return 'ORD-' + new Date().getFullYear() + '-' + String(paymentHistory.length + 1).padStart(6, '0');
}

// Simular envÃ­o de email de confirmaciÃ³n
function sendConfirmationEmail(email, orderId) {
    console.log(`ðŸ“§ Enviando confirmaciÃ³n a: ${email}`);
    console.log(`ðŸ“‹ Orden ID: ${orderId}`);
    
    // En una aplicaciÃ³n real, esto serÃ­a una llamada API a un servicio de email
    const emailContent = {
        to: email,
        subject: `ConfirmaciÃ³n de Pedido - ${orderId}`,
        body: `
            Gracias por tu compra en FerrreWeb.
            
            NÃºmero de Orden: ${orderId}
            Monto Total: $${getCartSummary().total.toLocaleString()}
            
            Tu pedido serÃ¡ entregado en 3-5 dÃ­as hÃ¡biles.
            
            Para rastrear tu orden, visita: ferreweb.com/track/${orderId}
        `
    };
    
    return emailContent;
}

// Obtener historial de pagos
function getPaymentHistory() {
    return paymentHistory;
}

// Obtener resumen de pagos
function getPaymentSummary() {
    const completedPayments = paymentHistory.filter(p => p.status === 'completed');
    const totalAmount = completedPayments.reduce((sum, p) => sum + p.amount, 0);
    
    return {
        totalPayments: completedPayments.length,
        totalAmount: totalAmount,
        averageAmount: completedPayments.length > 0 ? Math.floor(totalAmount / completedPayments.length) : 0,
        lastPayment: completedPayments[completedPayments.length - 1] || null
    };
}

// Exportar recibo
function exportReceipt(orderId) {
    const payment = paymentHistory.find(p => p.orderId === orderId);
    if (!payment) {
        showNotification('Orden no encontrada', 'error');
        return;
    }
    
    const content = `
        RECIBO DE COMPRA
        ================
        
        Tienda: FerrreWeb
        Fecha: ${new Date(payment.date).toLocaleDateString('es-MX')}
        Orden: ${orderId}
        
        MÃ©todo de Pago: ${payment.method}
        Monto Total: $${payment.amount.toLocaleString()}
        Cantidad de Productos: ${payment.items}
        
        ================
        Gracias por tu compra
    `;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `recibo-${orderId}.txt`;
    a.click();
}


