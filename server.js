const express = require('express');
const path = require('path');
const fs = require('fs');
const compression = require('compression');
const helmet = require('helmet');
const cors = require('cors');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware de seguridad
app.use(helmet());
app.use(cors());
app.use(compression());

// Sesiones
app.use(session({
    secret: 'ferreweb-secret-key-2024',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // En producción usar HTTPS
}));

// Middleware para parsear JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, '.')));

// Variables para almacenar órdenes (en producción usar base de datos)
let orders = [];
let payments = [];
let users = []; // Almacenamiento temporal de usuarios

// ========================================
// RUTAS API
// ========================================

// Obtener productos
app.get('/api/products', (req, res) => {
    try {
        const productsData = require('./data/products.json');
        res.json(productsData);
    } catch (error) {
        console.error('Error leyendo productos:', error);
        res.status(500).json({ error: 'Error al cargar productos' });
    }
});

// Obtener proveedores
app.get('/api/providers', (req, res) => {
    try {
        const providersData = require('./data/providers.json');
        res.json(providersData);
    } catch (error) {
        console.error('Error leyendo proveedores:', error);
        res.status(500).json({ error: 'Error al cargar proveedores' });
    }
});

// Crear orden
app.post('/api/orders', (req, res) => {
    try {
        const { items, customer, payment } = req.body;
        
        // Validar datos
        if (!items || items.length === 0) {
            return res.status(400).json({ error: 'Carrito vacío' });
        }
        
        if (!customer || !payment) {
            return res.status(400).json({ error: 'Datos incompletos' });
        }
        
        // Crear orden
        const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const order = {
            orderId,
            items,
            customer,
            payment,
            total: items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            status: 'pending',
            createdAt: new Date().toISOString()
        };
        
        orders.push(order);
        
        // Guardar en archivo (simulado)
        console.log('📋 Nueva orden creada:', orderId);
        
        res.json({
            success: true,
            orderId,
            message: 'Orden creada exitosamente'
        });
    } catch (error) {
        console.error('Error creando orden:', error);
        res.status(500).json({ error: 'Error al crear orden' });
    }
});

// Procesar pago
app.post('/api/payments', (req, res) => {
    try {
        const { orderId, amount, method, cardData } = req.body;
        
        // Validar tarjeta (simulado)
        if (method === 'credit') {
            if (!cardData || !cardData.cardNumber) {
                return res.status(400).json({ error: 'Datos de tarjeta inválidos' });
            }
            
            // Validar Luhn (simulado)
            const cardNumber = cardData.cardNumber.replace(/\s/g, '');
            if (cardNumber.length !== 16) {
                return res.status(400).json({ error: 'Número de tarjeta inválido' });
            }
        }
        
        const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const payment = {
            transactionId,
            orderId,
            amount,
            method,
            status: 'completed',
            processedAt: new Date().toISOString()
        };
        
        payments.push(payment);
        
        console.log('💳 Pago procesado:', transactionId);
        
        res.json({
            success: true,
            transactionId,
            message: 'Pago procesado exitosamente'
        });
    } catch (error) {
        console.error('Error procesando pago:', error);
        res.status(500).json({ error: 'Error al procesar pago' });
    }
});

// Obtener orden
app.get('/api/orders/:orderId', (req, res) => {
    const { orderId } = req.params;
    const order = orders.find(o => o.orderId === orderId);
    
    if (!order) {
        return res.status(404).json({ error: 'Orden no encontrada' });
    }
    
    res.json(order);
});

// Obtener todas las órdenes (admin)
app.get('/api/admin/orders', (req, res) => {
    // En producción, validar autenticación
    res.json({
        totalOrders: orders.length,
        orders: orders,
        totalRevenue: orders.reduce((sum, o) => sum + o.total, 0)
    });
});

// Buscar productos
app.get('/api/search', (req, res) => {
    try {
        const { q } = req.query;
        
        if (!q) {
            return res.status(400).json({ error: 'Consulta vacía' });
        }
        
        const productsData = require('./data/products.json');
        const results = productsData.products.filter(p =>
            p.name.toLowerCase().includes(q.toLowerCase()) ||
            p.description.toLowerCase().includes(q.toLowerCase()) ||
            p.category.toLowerCase().includes(q.toLowerCase())
        );
        
        res.json({
            query: q,
            count: results.length,
            results
        });
    } catch (error) {
        console.error('Error buscando:', error);
        res.status(500).json({ error: 'Error en la búsqueda' });
    }
});

// ========================================
// RUTAS DE AUTENTICACIÓN
// ========================================

// Registro de usuario
app.post('/api/auth/register', (req, res) => {
    try {
        const { name, email, password, phone } = req.body;
        
        // Validar datos
        if (!name || !email || !password || !phone) {
            return res.status(400).json({ message: 'Todos los campos son requeridos' });
        }
        
        // Verificar si el usuario ya existe
        const existingUser = users.find(u => u.email === email);
        if (existingUser) {
            return res.status(400).json({ message: 'El correo electrónico ya está registrado' });
        }
        
        // Crear usuario (en producción hashear contraseña)
        const user = {
            id: users.length + 1,
            name,
            email,
            password, // En producción: bcrypt.hashSync(password, 10)
            phone,
            createdAt: new Date().toISOString()
        };
        
        users.push(user);
        
        console.log('👤 Nuevo usuario registrado:', email);
        
        res.json({
            success: true,
            message: 'Usuario registrado exitosamente'
        });
    } catch (error) {
        console.error('Error registrando usuario:', error);
        res.status(500).json({ message: 'Error al registrar usuario' });
    }
});

// Login de usuario
app.post('/api/auth/login', (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Buscar usuario
        const user = users.find(u => u.email === email);
        
        if (!user) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }
        
        // Verificar contraseña (en producción usar bcrypt)
        if (user.password !== password) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }
        
        // Crear sesión
        req.session.userId = user.id;
        req.session.user = {
            id: user.id,
            name: user.name,
            email: user.email
        };
        
        console.log('🔐 Usuario inició sesión:', email);
        
        res.json({
            success: true,
            user: req.session.user,
            message: 'Inicio de sesión exitoso'
        });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ message: 'Error al iniciar sesión' });
    }
});

// Logout
app.post('/api/auth/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Error al cerrar sesión' });
        }
        res.json({ success: true, message: 'Sesión cerrada' });
    });
});

// Obtener usuario actual
app.get('/api/auth/me', (req, res) => {
    if (req.session.user) {
        res.json({ user: req.session.user });
    } else {
        res.status(401).json({ message: 'No autenticado' });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Rutas para página principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Error 404
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'index.html'));
});

// Manejo de errores global
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        error: 'Error del servidor',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Error interno'
    });
});

// ========================================
// INICIAR SERVIDOR
// ========================================
app.listen(PORT, () => {
    console.log('\n🔨 =====================================');
    console.log('🔨 FERREWEB - Servidor Iniciado');
    console.log('🔨 =====================================');
    console.log(`📌 URL: http://localhost:${PORT}`);
    console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
    console.log('🔨 =====================================\n');
    
    // Mostrar comandos disponibles
    console.log('📋 Comandos disponibles:');
    console.log('   GET  /api/products       - Obtener productos');
    console.log('   GET  /api/providers      - Obtener proveedores');
    console.log('   GET  /api/search?q=      - Buscar productos');
    console.log('   POST /api/orders         - Crear nueva orden');
    console.log('   POST /api/payments       - Procesar pago');
    console.log('   GET  /api/health         - Ver estado del servidor\n');
});

// Manejo de cierre graceful
process.on('SIGTERM', () => {
    console.log('\n🛑 Señal SIGTERM recibida. Cerrando servidor...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('\n🛑 Ctrl+C presionado. Cerrando servidor...');
    process.exit(0);
});
