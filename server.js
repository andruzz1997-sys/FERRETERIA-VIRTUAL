import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { productos as defaultProducts } from './src/data/productos.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares requeridos
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos del frontend en caso de ejecutar todo unificado
app.use(express.static(path.join(__dirname, 'dist')));

// ==========================================================================
// ESTADO EN MEMORIA (IN-MEMORY DATABASE)
// ==========================================================================
let usuarios = [
  {
    id: 1,
    nombre: 'Administrador FerreWeb',
    email: 'admin@ferreweb.com',
    password: 'admin123',
    telefono: '+57 300 123 4567',
    rol: 'admin',
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    nombre: 'Cliente FerreWeb',
    email: 'cliente@ferreweb.com',
    password: 'cliente123',
    telefono: '+57 310 987 6543',
    rol: 'cliente',
    createdAt: new Date().toISOString()
  }
];

// Clonar productos iniciales para permitir mutaciones dinámicas en memoria
let productos = JSON.parse(JSON.stringify(defaultProducts));
let ordenes = [];

// ==========================================================================
// RUTAS DE AUTENTICACIÓN
// ==========================================================================

/**
 * POST /api/registro
 * Registra nuevos usuarios en memoria
 */
app.post('/api/registro', (req, res) => {
  try {
    const { nombre, email, password, telefono } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Nombre, correo electrónico y contraseña son obligatorios.'
      });
    }

    const emailNormalizado = email.trim().toLowerCase();

    // Verificar existencia
    const existe = usuarios.find((u) => u.email.toLowerCase() === emailNormalizado);
    if (existe) {
      return res.status(400).json({
        success: false,
        message: 'El correo electrónico ya está registrado.'
      });
    }

    const nuevoUsuario = {
      id: usuarios.length + 1,
      nombre: nombre.trim(),
      email: emailNormalizado,
      password: password,
      telefono: telefono ? telefono.trim() : '',
      rol: 'cliente',
      createdAt: new Date().toISOString()
    };

    usuarios.push(nuevoUsuario);

    console.log(`👤 [REGISTRO] Nuevo usuario registrado: ${nuevoUsuario.email} (${nuevoUsuario.nombre})`);

    return res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente.',
      user: {
        id: nuevoUsuario.id,
        nombre: nuevoUsuario.nombre,
        email: nuevoUsuario.email,
        telefono: nuevoUsuario.telefono,
        rol: nuevoUsuario.rol
      }
    });
  } catch (error) {
    console.error('Error en /api/registro:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno en el servidor al registrar usuario.',
      error: error.message
    });
  }
});

/**
 * POST /api/login
 * Valida credenciales.
 * Si email === 'admin@ferreweb.com' y password === 'admin123', retorna rol 'admin';
 * de lo contrario, rol 'cliente'.
 */
app.post('/api/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Por favor ingresa correo y contraseña.'
      });
    }

    const emailNormalizado = email.trim().toLowerCase();

    // Verificación especial para Administrador oficial FerreWeb
    if (emailNormalizado === 'admin@ferreweb.com' && password === 'admin123') {
      console.log(`🔐 [LOGIN] Administrador autenticado: ${emailNormalizado}`);
      return res.json({
        success: true,
        message: 'Inicio de sesión exitoso como Administrador.',
        token: `jwt-admin-token-${Date.now()}`,
        user: {
          id: 1,
          nombre: 'Administrador FerreWeb',
          email: 'admin@ferreweb.com',
          rol: 'admin'
        }
      });
    }

    // Verificación de usuarios registrados
    const usuario = usuarios.find(
      (u) => u.email.toLowerCase() === emailNormalizado && u.password === password
    );

    if (usuario) {
      console.log(`🔐 [LOGIN] Usuario autenticado: ${usuario.email} [${usuario.rol}]`);
      return res.json({
        success: true,
        message: `Bienvenido de nuevo, ${usuario.nombre}.`,
        token: `jwt-client-token-${Date.now()}`,
        user: {
          id: usuario.id,
          nombre: usuario.nombre,
          email: usuario.email,
          telefono: usuario.telefono,
          rol: usuario.rol || 'cliente'
        }
      });
    }

    // Credenciales incorrectas
    return res.status(401).json({
      success: false,
      message: 'Credenciales inválidas. Verifica tu correo y contraseña.'
    });
  } catch (error) {
    console.error('Error en /api/login:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno en el servidor al iniciar sesión.',
      error: error.message
    });
  }
});

// ==========================================================================
// RUTAS DE PRODUCTOS (CATÁLOGO DINÁMICO)
// ==========================================================================

/**
 * GET /api/productos
 * Devuelve la lista dinámica de productos con precios regular y de oferta
 */
app.get('/api/productos', (req, res) => {
  try {
    const { categoria, enOferta, q } = req.query;
    let resultado = [...productos];

    if (categoria && categoria !== 'todas') {
      resultado = resultado.filter(
        (p) => p.categoria.toLowerCase() === categoria.toLowerCase()
      );
    }

    if (enOferta === 'true') {
      resultado = resultado.filter((p) => p.enOferta === true);
    }

    if (q) {
      const termino = q.toLowerCase();
      resultado = resultado.filter(
        (p) =>
          p.nombre.toLowerCase().includes(termino) ||
          p.descripcion.toLowerCase().includes(termino) ||
          p.categoria.toLowerCase().includes(termino)
      );
    }

    return res.json(resultado);
  } catch (error) {
    console.error('Error en GET /api/productos:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al consultar productos.',
      error: error.message
    });
  }
});

// Compatibilidad con GET /api/products
app.get('/api/products', (req, res) => {
  res.json({ products: productos });
});

/**
 * GET /api/productos/:id
 * Detalle de un producto individual
 */
app.get('/api/productos/:id', (req, res) => {
  const id = Number(req.params.id);
  const producto = productos.find((p) => p.id === id);
  if (!producto) {
    return res.status(404).json({ success: false, message: 'Producto no encontrado' });
  }
  return res.json(producto);
});

// ==========================================================================
// RUTAS CRUD ADMIN DE PRODUCTOS
// ==========================================================================

/**
 * POST /api/admin/productos
 * Crear nuevo producto u oferta
 */
app.post('/api/admin/productos', (req, res) => {
  try {
    const {
      nombre,
      categoria,
      precio,
      precioAnterior,
      enOferta,
      descuento,
      stock,
      descripcion,
      caracteristicas,
      imagen,
      tags
    } = req.body;

    if (!nombre || precio === undefined || precio === null) {
      return res.status(400).json({
        success: false,
        message: 'El nombre y el precio del producto son obligatorios.'
      });
    }

    const nuevoId = productos.length > 0 ? Math.max(...productos.map((p) => Number(p.id) || 0)) + 1 : 1;
    const precioNum = Number(precio);
    const estaEnOferta = Boolean(enOferta);
    const descuentoNum = estaEnOferta ? (Number(descuento) || 10) : 0;
    const precioReg = precioAnterior
      ? Number(precioAnterior)
      : (estaEnOferta ? Math.round(precioNum * (1 + descuentoNum / 100)) : null);

    const nuevoProducto = {
      id: nuevoId,
      nombre: String(nombre).trim(),
      categoria: categoria || 'Herramientas',
      precio: precioNum,
      precioAnterior: precioReg,
      enOferta: estaEnOferta,
      descuento: descuentoNum,
      descripcion: descripcion || 'Suministro industrial con garantía de calidad FERREWEB.',
      caracteristicas: Array.isArray(caracteristicas)
        ? caracteristicas
        : [
            caracteristicas || 'Garantía oficial y certificado de calidad',
            'Envío prioritario a toda Colombia'
          ],
      stock: Number(stock) >= 0 ? Number(stock) : 10,
      rating: 5.0,
      icono: '🔧',
      imagen:
        imagen ||
        'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80',
      tags: Array.isArray(tags) ? tags : [categoria ? categoria.toLowerCase() : 'herramientas', 'ferreteria']
    };

    productos.unshift(nuevoProducto);

    console.log(`📦 [ADMIN] Producto creado: ID ${nuevoProducto.id} - ${nuevoProducto.nombre}`);

    return res.status(201).json({
      success: true,
      message: 'Producto creado exitosamente.',
      producto: nuevoProducto
    });
  } catch (error) {
    console.error('Error en POST /api/admin/productos:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al crear producto.',
      error: error.message
    });
  }
});

/**
 * Controlador de actualización de producto
 * Soporta PUT /api/admin/productos/:id y PUT /api/admin/productos
 */
const manejarActualizacionProducto = (req, res) => {
  try {
    const id = Number(req.params.id || req.body.id);
    if (!id) {
      return res.status(400).json({ success: false, message: 'ID de producto no proporcionado.' });
    }

    const index = productos.findIndex((p) => p.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: `Producto con ID ${id} no encontrado.` });
    }

    const actual = productos[index];
    const {
      nombre,
      categoria,
      precio,
      precioAnterior,
      enOferta,
      descuento,
      stock,
      descripcion,
      imagen
    } = req.body;

    const nuevoPrecio = precio !== undefined ? Number(precio) : actual.precio;
    const nuevoEnOferta = enOferta !== undefined ? Boolean(enOferta) : actual.enOferta;
    const nuevoDescuento = nuevoEnOferta
      ? (descuento !== undefined ? Number(descuento) : (actual.descuento || 10))
      : 0;

    let nuevoPrecioAnterior = actual.precioAnterior;
    if (precioAnterior !== undefined) {
      nuevoPrecioAnterior = precioAnterior ? Number(precioAnterior) : null;
    } else if (nuevoEnOferta && !actual.precioAnterior) {
      nuevoPrecioAnterior = Math.round(nuevoPrecio * 1.15);
    } else if (!nuevoEnOferta) {
      nuevoPrecioAnterior = null;
    }

    productos[index] = {
      ...actual,
      nombre: nombre !== undefined ? String(nombre).trim() : actual.nombre,
      categoria: categoria !== undefined ? categoria : actual.categoria,
      precio: nuevoPrecio,
      precioAnterior: nuevoPrecioAnterior,
      enOferta: nuevoEnOferta,
      descuento: nuevoDescuento,
      stock: stock !== undefined ? Number(stock) : actual.stock,
      descripcion: descripcion !== undefined ? descripcion : actual.descripcion,
      imagen: imagen !== undefined ? imagen : actual.imagen
    };

    console.log(`✏️ [ADMIN] Producto actualizado: ID ${id} - ${productos[index].nombre} (Stock: ${productos[index].stock})`);

    return res.json({
      success: true,
      message: 'Producto actualizado exitosamente.',
      producto: productos[index]
    });
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al actualizar producto.',
      error: error.message
    });
  }
};

app.put('/api/admin/productos/:id', manejarActualizacionProducto);
app.put('/api/admin/productos', manejarActualizacionProducto);

/**
 * Controlador de eliminación de producto
 * Soporta DELETE /api/admin/productos/:id y DELETE /api/admin/productos
 */
const manejarEliminacionProducto = (req, res) => {
  try {
    const id = Number(req.params.id || req.body.id || req.query.id);
    if (!id) {
      return res.status(400).json({ success: false, message: 'ID de producto no proporcionado.' });
    }

    const index = productos.findIndex((p) => p.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: `Producto con ID ${id} no encontrado.` });
    }

    const eliminado = productos.splice(index, 1)[0];
    console.log(`🗑️ [ADMIN] Producto eliminado: ID ${id} - ${eliminado.nombre}`);

    return res.json({
      success: true,
      message: `Producto "${eliminado.nombre}" eliminado exitosamente.`,
      producto: eliminado
    });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al eliminar producto.',
      error: error.message
    });
  }
};

app.delete('/api/admin/productos/:id', manejarEliminacionProducto);
app.delete('/api/admin/productos', manejarEliminacionProducto);

// ==========================================================================
// PASARELA DE PAGO REAL (WOMPI / MERCADO PAGO CHECKOUT)
// ==========================================================================

/**
 * POST /api/crear-pago
 * Recibe la lista de compra y el total del carrito, generando un enlace de redirección
 * hacia la pasarela de pago real (Wompi Checkout oficial de Bancolombia / Mercado Pago)
 */
app.post('/api/crear-pago', (req, res) => {
  try {
    const { items, total, customer } = req.body;

    // Calcular total seguro en pesos
    let totalCalculado = 0;
    if (total && Number(total) > 0) {
      totalCalculado = Number(total);
    } else if (Array.isArray(items) && items.length > 0) {
      totalCalculado = items.reduce(
        (sum, item) => sum + Number(item.precio) * Number(item.cantidad || 1),
        0
      );
    } else {
      totalCalculado = 50000; // Valor base de prueba si no se especifica
    }

    // Costo de envío según política de FerreWeb (> $350.000 COP es gratis)
    const envio = totalCalculado >= 350000 ? 0 : 12000;
    const granTotal = totalCalculado + envio;
    const totalEnCentavos = Math.round(granTotal * 100);

    // Generar referencia única de orden
    const referencia = `FERREWEB-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    // Llave pública de prueba oficial de Wompi Checkout Colombia
    const WOMPI_PUBLIC_KEY = process.env.WOMPI_PUBLIC_KEY || 'pub_test_Q5yDA9xoKdePiumAlhrbxDrfvRrUNKy1';
    
    // URL de retorno a la tienda (soporta HashRouter de Vite en localhost o GitHub Pages)
    const urlRetorno = encodeURIComponent('http://localhost:5173/#/?pago=exitoso&ref=' + referencia);

    // Enlace directo al Checkout oficial de Wompi (soporta Nequi, PSE, Tarjeta y Bancolombia)
    const checkoutUrl = `https://checkout.wompi.co/p/?public-key=${WOMPI_PUBLIC_KEY}&currency=COP&amount-in-cents=${totalEnCentavos}&reference=${referencia}&redirect-url=${urlRetorno}`;

    // Registrar orden en memoria
    const nuevaOrden = {
      referencia,
      items: items || [],
      subtotal: totalCalculado,
      envio,
      total: granTotal,
      estado: 'pendiente_pago',
      cliente: customer || { nombre: 'Cliente FerreWeb' },
      createdAt: new Date().toISOString()
    };
    ordenes.push(nuevaOrden);

    console.log(`💳 [PAGO] Pasarela generada para ${referencia} | Total: $${granTotal} COP (${totalEnCentavos} centavos)`);

    return res.json({
      success: true,
      url: checkoutUrl,
      referencia,
      total: granTotal,
      moneda: 'COP',
      message: 'Redirección a pasarela de pago generada exitosamente.'
    });
  } catch (error) {
    console.error('Error en /api/crear-pago:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al procesar la pasarela de pagos.',
      error: error.message
    });
  }
});

// ==========================================================================
// ESTADO Y SALUD DEL SERVIDOR
// ==========================================================================
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    servicio: 'FERREWEB API REST',
    tienda: 'FERREWEB Oficial Colombia',
    puerto: PORT,
    productosRegistrados: productos.length,
    usuariosRegistrados: usuarios.length,
    timestamp: new Date().toISOString()
  });
});

// Iniciar servidor Express en el puerto 5000
app.listen(PORT, () => {
  console.log('\n=============================================================');
  console.log('🚀 FERREWEB - SERVIDOR BACKEND API REST ACTIVO');
  console.log('=============================================================');
  console.log(`📌 URL Base:         http://localhost:${PORT}`);
  console.log(`📦 Catálogo:         GET    http://localhost:${PORT}/api/productos`);
  console.log(`🔐 Iniciar Sesión:   POST   http://localhost:${PORT}/api/login`);
  console.log(`👤 Registro:         POST   http://localhost:${PORT}/api/registro`);
  console.log(`🛠️ Admin Productos:  CRUD   http://localhost:${PORT}/api/admin/productos`);
  console.log(`💳 Pasarela Pagos:   POST   http://localhost:${PORT}/api/crear-pago`);
  console.log(`🩺 Health Check:     GET    http://localhost:${PORT}/api/health`);
  console.log('=============================================================\n');
});

export default app;
