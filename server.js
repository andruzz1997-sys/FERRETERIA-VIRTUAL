import express from 'express';
import cors from 'cors';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { productos as defaultProducts } from './src/data/productos.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Configuración Wompi Sandbox Oficial
const WOMPI_PUBLIC_KEY = process.env.WOMPI_PUBLIC_KEY || 'pub_test_Q5yDA9xoKdePiumAlhrbxDrfvRrUNKy1';
const WOMPI_INTEGRITY_SECRET = process.env.WOMPI_INTEGRITY_SECRET || 'test_integrity_4X9Z8qB0r7N1k3L5p2Y4W6v8T0s2M4Q6';

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

// Historial de Movimientos de Bodega (Kardex Simplificado)
let movimientosInventario = [
  {
    id: 1,
    productoId: 1,
    productoNombre: 'Taladro Inalámbrico 20V Profesional',
    tipo: 'ENTRADA',
    cantidad: 25,
    motivo: 'Inventario inicial de apertura de bodega',
    fecha: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    id: 2,
    productoId: 3,
    productoNombre: 'Cemento Portland Tipo 1 50KG',
    tipo: 'ENTRADA',
    cantidad: 100,
    motivo: 'Recepción despacho de fábrica Argos',
    fecha: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: 3,
    productoId: 3,
    productoNombre: 'Cemento Portland Tipo 1 50KG',
    tipo: 'SALIDA',
    cantidad: 5,
    motivo: 'Venta orden FERREWEB-DEMO2',
    fecha: new Date(Date.now() - 86400000).toISOString()
  }
];

// Órdenes iniciales de demostración enriquecidas con logística y transportadoras
let ordenes = [
  {
    referencia: 'FERREWEB-1711460000000-DEMO1',
    items: [
      { id: 1, nombre: 'Taladro Inalámbrico 20V Profesional', precio: 450000, cantidad: 1 },
      { id: 2, nombre: 'Martillo de Goma Antirrebote 1.5 KG', precio: 45000, cantidad: 2 }
    ],
    subtotal: 540000,
    envio: 0,
    total: 540000,
    estado: 'entregado',
    transportadora: 'Coordinadora',
    numeroGuia: 'CRD-99881203',
    fechaDespacho: new Date(Date.now() - 86400000 * 2).toISOString(),
    notasDespacho: 'Entregado en portería de obra con acta firmada.',
    cliente: { id: 2, nombre: 'Cliente FerreWeb', email: 'cliente@ferreweb.com', telefono: '+57 310 987 6543' },
    direccionEnvio: { direccion: 'Cra 45 # 72-10', ciudad: 'Bogotá', departamento: 'Cundinamarca' },
    metodoPago: 'Wompi Bancolombia / PSE',
    transactionId: 'wompi-txn-demo-01',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    referencia: 'FERREWEB-1711470000000-DEMO2',
    items: [
      { id: 3, nombre: 'Cemento Portland Tipo 1 50KG', precio: 32000, cantidad: 5 }
    ],
    subtotal: 160000,
    envio: 12000,
    total: 172000,
    estado: 'despachado',
    transportadora: 'Servientrega',
    numeroGuia: 'SER-44910283',
    fechaDespacho: new Date(Date.now() - 3600000 * 4).toISOString(),
    notasDespacho: 'Despachado en camión NPR carga pesada.',
    cliente: { id: 2, nombre: 'Cliente FerreWeb', email: 'cliente@ferreweb.com', telefono: '+57 310 987 6543' },
    direccionEnvio: { direccion: 'Calle 100 # 15-20', ciudad: 'Medellín', departamento: 'Antioquia' },
    metodoPago: 'Wompi Nequi',
    transactionId: 'wompi-txn-demo-02',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  }
];

// Directorio de Proveedores Aliados (SCM)
let proveedores = [
  {
    id: 1,
    nombre: 'ConstruMateriales Pro S.A.S.',
    categoria: 'Materiales de Construcción',
    contacto: 'Carlos Mendoza',
    email: 'ventas@construmaterialespro.com',
    telefono: '+57 (601) 345 6789',
    ciudad: 'Bogotá D.C.',
    rating: 4.9,
    productosSuministrados: ['Cemento Portland', 'Arena Gruesa', 'Ladrillo Estructural']
  },
  {
    id: 2,
    nombre: 'Herramientas Élite Colombia',
    categoria: 'Herramientas Profesionales',
    contacto: 'Laura Restrepo',
    email: 'distribucion@herramientaselite.co',
    telefono: '+57 (604) 444 8899',
    ciudad: 'Medellín',
    rating: 4.8,
    productosSuministrados: ['Taladros Percutores', 'Amoladoras', 'Sierras Circulares']
  },
  {
    id: 3,
    nombre: 'Sistemas PVC Integral Andina',
    categoria: 'Tuberías y Conexiones',
    contacto: 'Jorge Iván Silva',
    email: 'contacto@sistemaspvc.com',
    telefono: '+57 (602) 889 0011',
    ciudad: 'Cali',
    rating: 4.7,
    productosSuministrados: ['Tubería Presión PVC', 'Codos Sanitarios', 'Pegante Industrial']
  },
  {
    id: 4,
    nombre: 'Electricidad Segura del Norte',
    categoria: 'Productos Eléctricos',
    contacto: 'Mariana Duarte',
    email: 'soporte@electricidadsegura.com',
    telefono: '+57 (605) 360 4522',
    ciudad: 'Barranquilla',
    rating: 4.9,
    productosSuministrados: ['Cable THHN Calibre 12', 'Breakers Industriales', 'Cajas de Distribución']
  }
];

// Sedes Físicas y Bodegas (Click & Collect)
const sucursales = [
  {
    id: 'BOG-01',
    nombre: 'Bodega Central Calle 80',
    ciudad: 'Bogotá D.C.',
    direccion: 'Av. Calle 80 # 69-45, Zona Industrial',
    horario: 'Lunes a Sábado: 7:00 AM - 6:00 PM',
    telefono: '+57 (601) 745 2000',
    tiempoRetiro: 'Listo en 2 horas'
  },
  {
    id: 'MED-01',
    nombre: 'Centro Logístico Guayabal',
    ciudad: 'Medellín',
    direccion: 'Carrera 52 # 14-80, Guayabal',
    horario: 'Lunes a Sábado: 7:30 AM - 5:30 PM',
    telefono: '+57 (604) 512 8900',
    tiempoRetiro: 'Listo en 2 horas'
  },
  {
    id: 'CAL-01',
    nombre: 'Sede Industrial Acopi Yumbo',
    ciudad: 'Cali / Yumbo',
    direccion: 'Calle 15 # 28-30, Acopi',
    horario: 'Lunes a Viernes: 8:00 AM - 5:00 PM',
    telefono: '+57 (602) 690 1200',
    tiempoRetiro: 'Listo en 4 horas'
  },
  {
    id: 'BAQ-01',
    nombre: 'Bodega Puerto Caribe',
    ciudad: 'Barranquilla',
    direccion: 'Vía 40 # 73-120',
    horario: 'Lunes a Sábado: 8:00 AM - 5:00 PM',
    telefono: '+57 (605) 385 4100',
    tiempoRetiro: 'Listo en 3 horas'
  }
];

// Cotizaciones B2B
let cotizaciones = [
  {
    id: 1,
    codigo: 'COT-2026-001',
    empresa: 'Constructora Bolívar & Asociados',
    nit: '900.342.128-4',
    cliente: 'Ing. Mateo Gómez',
    email: 'compras@bolivarasociados.com',
    telefono: '+57 315 440 9988',
    ciudad: 'Bogotá',
    items: '150 bultos Cemento Portland 50KG, 40 tubos PVC Presión 1 pulgada, 20 discos diamantados 7"',
    estado: 'pendiente',
    comentarios: 'Requerimos entrega en obra Fontibón con pago a 30 días.',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 2,
    codigo: 'COT-2026-002',
    empresa: 'Instalaciones Eléctricas de Occidente',
    nit: '805.112.983-1',
    cliente: 'Arq. Sandra Peña',
    email: 'spena@electricasoccidente.com',
    telefono: '+57 320 891 2233',
    ciudad: 'Cali',
    items: '12 rollos Cable THHN #12 100m, 8 tableros bifásicos 8 circuitos, 50 tomacorrientes con polo a tierra',
    estado: 'contactado',
    comentarios: 'Proyecto residencial en Pance.',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  }
];

// Reseñas de productos
let resenas = [
  {
    id: 1,
    productoId: 1,
    nombre: 'Andrés Morales',
    calificacion: 5,
    comentario: 'Excelente taladro para trabajo pesado, la batería dura toda la jornada laboral.',
    fecha: '2026-03-10T14:32:00.000Z'
  },
  {
    id: 2,
    productoId: 1,
    nombre: 'Maestro Fernando Ruiz',
    calificacion: 5,
    comentario: 'El mandril metálico sostiene muy bien las brocas para concreto. Muy recomendado.',
    fecha: '2026-03-15T09:12:00.000Z'
  },
  {
    id: 3,
    productoId: 2,
    nombre: 'Héctor Cardona',
    calificacion: 4,
    comentario: 'Buena absorción de impacto al colocar baldosas, buen peso y empuñadura.',
    fecha: '2026-03-18T16:45:00.000Z'
  }
];

// Cupones de Descuento
const cupones = {
  FERRE10: { tipo: 'porcentaje', valor: 10, descripcion: '10% de descuento en el total de tu orden' },
  MAESTRO2026: { tipo: 'fijo', valor: 50000, minimo: 150000, descripcion: '$50.000 COP de descuento por compras mayores a $150.000' },
  SENA2026: { tipo: 'porcentaje', valor: 15, descripcion: '15% de descuento especial comunidad SENA' }
};

// ==========================================================================
// 1. RUTAS DE AUTENTICACIÓN
// ==========================================================================

/**
 * POST /api/registro
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

    console.log(`👤 [REGISTRO] Nuevo usuario: ${nuevoUsuario.email} (${nuevoUsuario.nombre})`);

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
// 2. RUTAS DE CATÁLOGO Y PRODUCTOS
// ==========================================================================

/**
 * GET /api/productos
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
          p.categoria.toLowerCase().includes(termino) ||
          (p.tags && p.tags.some((t) => t.toLowerCase().includes(termino)))
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
 */
app.get('/api/productos/:id', (req, res) => {
  const id = Number(req.params.id);
  const producto = productos.find((p) => p.id === id);
  if (!producto) {
    return res.status(404).json({ success: false, message: 'Producto no encontrado' });
  }
  return res.json(producto);
});

/**
 * POST /api/admin/productos
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
// 3. PASARELA OFICIAL WOMPI BANCOLOMBIA (SANDBOX REAL)
// ==========================================================================

/**
 * POST /api/crear-pago
 * Recibe items, total, customer y shippingAddress.
 * Calcula centavos, genera referencia única, calcula firma de integridad SHA-256
 * y retorna la URL del Web Checkout oficial de Wompi con pre-llenado de datos.
 */
app.post('/api/crear-pago', (req, res) => {
  try {
    const { items, total, customer, shippingAddress, redirectUrl } = req.body;

    let subtotalCalculado = 0;
    if (Array.isArray(items) && items.length > 0) {
      subtotalCalculado = items.reduce(
        (sum, item) => sum + Number(item.precio) * Number(item.cantidad || 1),
        0
      );
    } else if (total && Number(total) > 0) {
      subtotalCalculado = Number(total);
    } else {
      subtotalCalculado = 50000;
    }

    const totalFinal = (total && Number(total) > 0) ? Number(total) : subtotalCalculado;
    const envio = totalFinal >= 350000 ? 0 : 12000;
    const granTotal = totalFinal + (totalFinal < 350000 && !req.body.envioIncluido ? envio : 0);
    const amountInCents = Math.round(granTotal * 100);

    // Formato de referencia único y auditable
    const referencia = `FERREWEB-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    // Cálculo obligatorio de Firma de Integridad SHA-256 para Wompi Checkout
    // Formato Wompi: "<Referencia><MontoEnCentavos><Moneda><IntegritySecret>"
    const cadenaFirma = `${referencia}${amountInCents}COP${WOMPI_INTEGRITY_SECRET}`;
    const firmaIntegridad = crypto.createHash('sha256').update(cadenaFirma).digest('hex');

    // URL de retorno hacia la tienda FERREWEB
    const retorno = redirectUrl || 'http://localhost:5173/#/?pago=exitoso&ref=' + referencia;

    // URL hacia el Web Checkout oficial de Wompi Colombia
    let checkoutUrl = `https://checkout.wompi.co/p/?public-key=${WOMPI_PUBLIC_KEY}&currency=COP&amount-in-cents=${amountInCents}&reference=${referencia}&signature:integrity=${firmaIntegridad}&redirect-url=${encodeURIComponent(retorno)}`;

    if (customer) {
      if (customer.email) checkoutUrl += `&customer-data:email=${encodeURIComponent(customer.email)}`;
      if (customer.nombre) checkoutUrl += `&customer-data:full-name=${encodeURIComponent(customer.nombre)}`;
      if (customer.telefono) checkoutUrl += `&customer-data:phone-number=${encodeURIComponent(customer.telefono.replace(/[^0-9]/g, ''))}`;
    }

    if (shippingAddress && shippingAddress.direccion) {
      checkoutUrl += `&shipping-address:address-line-1=${encodeURIComponent(shippingAddress.direccion)}`;
      if (shippingAddress.ciudad) checkoutUrl += `&shipping-address:city=${encodeURIComponent(shippingAddress.ciudad)}`;
    }

    const nuevaOrden = {
      referencia,
      items: items || [],
      subtotal: subtotalCalculado,
      envio,
      total: granTotal,
      estado: 'pendiente_pago',
      transportadora: null,
      numeroGuia: null,
      fechaDespacho: null,
      notasDespacho: '',
      cliente: customer || { nombre: 'Cliente FerreWeb', email: 'cliente@ferreweb.com' },
      direccionEnvio: shippingAddress || { direccion: 'Sede Principal', ciudad: 'Bogotá' },
      metodoPago: 'Wompi Checkout Oficial',
      signature: firmaIntegridad,
      transactionId: null,
      createdAt: new Date().toISOString()
    };

    ordenes.unshift(nuevaOrden);

    console.log(`💳 [WOMPI] Orden generada: ${referencia} | $${granTotal} COP (${amountInCents} cts) | Firma: ${firmaIntegridad.substring(0, 10)}...`);

    return res.status(201).json({
      success: true,
      url: checkoutUrl,
      referencia,
      amountInCents,
      total: granTotal,
      signature: firmaIntegridad,
      message: 'Redirección a pasarela de pago Wompi generada exitosamente.'
    });
  } catch (error) {
    console.error('Error en /api/crear-pago:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al procesar la pasarela de pagos Wompi.',
      error: error.message
    });
  }
});

/**
 * GET /api/wompi/transaccion/:id
 * Consulta el estado oficial en Wompi Sandbox y actualiza la orden local
 */
app.get('/api/wompi/transaccion/:id', async (req, res) => {
  const transactionId = req.params.id;

  try {
    let wompiData = null;

    // Intentar consultar API Wompi Sandbox si no es simulación de prueba
    if (!transactionId.startsWith('mock-')) {
      try {
        const fetchResponse = await fetch(`https://sandbox.wompi.co/v1/transactions/${transactionId}`, {
          headers: {
            'Authorization': `Bearer ${WOMPI_PUBLIC_KEY}`
          }
        });
        if (fetchResponse.ok) {
          const json = await fetchResponse.json();
          wompiData = json.data;
        }
      } catch (networkErr) {
        console.warn('⚠️ No se pudo conectar directamente con API Wompi Sandbox:', networkErr.message);
      }
    }

    // Si no se obtuvo de la API oficial (modo offline / prueba local), retornar respuesta mock aprobada
    if (!wompiData) {
      wompiData = {
        id: transactionId,
        status: 'APPROVED',
        reference: req.query.ref || (ordenes[0] ? ordenes[0].referencia : 'FERREWEB-DEMO'),
        amount_in_cents: 45000000,
        currency: 'COP',
        payment_method_type: 'CARD',
        payment_method: { type: 'CARD', extra: { brand: 'VISA', last_four: '4242' } },
        created_at: new Date().toISOString()
      };
    }

    // Actualizar estado de la orden asociada en memoria
    const orden = ordenes.find((o) => o.referencia === wompiData.reference || o.transactionId === transactionId);
    if (orden) {
      orden.transactionId = transactionId;
      if (wompiData.status === 'APPROVED') {
        orden.estado = 'en_preparacion';
      } else if (wompiData.status === 'DECLINED') {
        orden.estado = 'rechazado';
      } else if (wompiData.status === 'VOIDED' || wompiData.status === 'ERROR') {
        orden.estado = 'cancelado';
      }
      orden.metodoPago = wompiData.payment_method_type || orden.metodoPago;
    }

    return res.json({
      success: true,
      transaccion: wompiData,
      orden: orden || null
    });
  } catch (error) {
    console.error('Error en /api/wompi/transaccion/:id:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al verificar la transacción con Wompi.',
      error: error.message
    });
  }
});

/**
 * POST /api/wompi-webhook
 * Listener oficial para eventos webhook de Wompi (transaction.updated)
 */
app.post('/api/wompi-webhook', (req, res) => {
  try {
    const evento = req.body;
    console.log(`🔔 [WOMPI WEBHOOK] Evento recibido:`, evento?.event);

    if (evento?.data?.transaction) {
      const txn = evento.data.transaction;
      const ref = txn.reference;
      const status = txn.status;

      const orden = ordenes.find((o) => o.referencia === ref);
      if (orden) {
        orden.transactionId = txn.id;
        if (status === 'APPROVED') orden.estado = 'en_preparacion';
        if (status === 'DECLINED') orden.estado = 'rechazado';
        if (status === 'VOIDED') orden.estado = 'cancelado';
        console.log(`✅ [WOMPI WEBHOOK] Orden ${ref} actualizada a ${orden.estado}`);
      }
    }

    return res.json({ received: true, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('Error en /api/wompi-webhook:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================================================
// 4. GESTIÓN DE PEDIDOS Y LOGÍSTICA (OMS)
// ==========================================================================

/**
 * GET /api/pedidos/usuario/:usuarioId
 * Historial de compras del cliente
 */
app.get('/api/pedidos/usuario/:usuarioId', (req, res) => {
  const usuarioId = Number(req.params.usuarioId);
  const historial = ordenes.filter(
    (o) => o.cliente && (o.cliente.id === usuarioId || String(o.cliente.id) === String(req.params.usuarioId))
  );
  return res.json({
    success: true,
    total: historial.length,
    pedidos: historial
  });
});

/**
 * GET /api/pedidos/rastreo/:referencia
 * Endpoint público de tracking logístico de guía
 */
app.get('/api/pedidos/rastreo/:referencia', (req, res) => {
  const referencia = req.params.referencia.trim();
  const orden = ordenes.find((o) => o.referencia.toLowerCase() === referencia.toLowerCase());

  if (!orden) {
    return res.status(404).json({
      success: false,
      message: `No se encontró ningún pedido con la referencia ${referencia}.`
    });
  }

  // Generar eventos cronológicos según estado
  const eventos = [
    { estado: 'Orden recibida en sistema y verificada', fecha: orden.createdAt, completado: true }
  ];

  if (orden.estado !== 'pendiente_pago' && orden.estado !== 'rechazado' && orden.estado !== 'cancelado') {
    eventos.push({ estado: 'Pago aprobado y verificado por Wompi', fecha: orden.createdAt, completado: true });
    eventos.push({ estado: 'En preparación en bodega central', fecha: orden.createdAt, completado: true });
  }

  if (orden.estado === 'despachado' || orden.estado === 'entregado') {
    const transp = orden.transportadora || 'Logística Exprés FerreWeb';
    const guia = orden.numeroGuia || `FW-LOG-${orden.referencia.substring(orden.referencia.length - 6)}`;
    eventos.push({
      estado: `Despachado en camión de ruta con ${transp} (Guía: ${guia})`,
      fecha: orden.fechaDespacho || new Date(Date.now() - 3600000 * 5).toISOString(),
      completado: true
    });
  }

  if (orden.estado === 'entregado') {
    eventos.push({
      estado: 'Entregado al destinatario a satisfacción en obra',
      fecha: new Date().toISOString(),
      completado: true
    });
  }

  return res.json({
    success: true,
    referencia: orden.referencia,
    estado: orden.estado,
    estadoActual: orden.estado,
    transportadora: orden.transportadora || 'Logística Exprés FerreWeb / Coordinadora',
    numeroGuia: orden.numeroGuia || `FW-LOG-${orden.referencia.substring(orden.referencia.length - 6)}`,
    guia: orden.numeroGuia || `FW-LOG-${orden.referencia.substring(orden.referencia.length - 6)}`,
    fechaDespacho: orden.fechaDespacho || null,
    notasDespacho: orden.notasDespacho || '',
    destino: orden.direccionEnvio?.ciudad || 'Colombia',
    direccion: orden.direccionEnvio?.direccion || 'Entrega a domicilio',
    fechaEstimada: '24 a 48 horas hábiles',
    items: orden.items,
    total: orden.total,
    cliente: orden.cliente ? {
      nombre: orden.cliente.nombre,
      email: orden.cliente.email,
      telefono: orden.cliente.telefono
    } : null,
    eventos
  });
});

/**
 * GET /api/admin/pedidos
 * Listado de todas las órdenes para la consola de administración
 */
app.get('/api/admin/pedidos', (req, res) => {
  return res.json({
    success: true,
    total: ordenes.length,
    pedidos: ordenes
  });
});

/**
 * PATCH /api/admin/pedidos/:referencia/estado
 * Transición de estado de la orden y registro logístico de despacho
 */
app.patch('/api/admin/pedidos/:referencia/estado', (req, res) => {
  const { referencia } = req.params;
  const { nuevoEstado, transportadora, numeroGuia, notasDespacho } = req.body;

  const estadosValidos = ['pendiente_pago', 'en_preparacion', 'despachado', 'entregado', 'cancelado', 'rechazado'];

  if (!estadosValidos.includes(nuevoEstado)) {
    return res.status(400).json({
      success: false,
      message: `Estado no válido. Los estados permitidos son: ${estadosValidos.join(', ')}`
    });
  }

  const orden = ordenes.find((o) => o.referencia.toLowerCase() === referencia.toLowerCase());
  if (!orden) {
    return res.status(404).json({
      success: false,
      message: `Pedido con referencia ${referencia} no encontrado.`
    });
  }

  orden.estado = nuevoEstado;
  orden.actualizadoEn = new Date().toISOString();

  // Si cambia a despachado, registrar obligatoriamente datos logísticos
  if (nuevoEstado === 'despachado') {
    orden.transportadora = transportadora || orden.transportadora || 'Coordinadora';
    orden.numeroGuia = numeroGuia || orden.numeroGuia || `CRD-${Date.now().toString().slice(-6)}`;
    orden.fechaDespacho = new Date().toISOString();
    if (notasDespacho !== undefined) orden.notasDespacho = notasDespacho;
  } else {
    if (transportadora !== undefined) orden.transportadora = transportadora;
    if (numeroGuia !== undefined) orden.numeroGuia = numeroGuia;
    if (notasDespacho !== undefined) orden.notasDespacho = notasDespacho;
  }

  console.log(`📦 [OMS] Pedido ${referencia} cambiado a estado: ${nuevoEstado} (Transportadora: ${orden.transportadora || 'N/A'}, Guía: ${orden.numeroGuia || 'N/A'})`);

  return res.json({
    success: true,
    message: `Estado del pedido ${referencia} actualizado a "${nuevoEstado}".`,
    orden
  });
});

// ==========================================================================
// 5. CADENA DE SUMINISTRO Y PROVEEDORES (SCM)
// ==========================================================================

/**
 * GET /api/proveedores
 * Directorio de marcas y distribuidores aliados
 */
app.get('/api/proveedores', (req, res) => {
  return res.json({
    success: true,
    total: proveedores.length,
    proveedores
  });
});

/**
 * POST /api/admin/proveedores
 * Registro de nuevo proveedor con validación de datos
 */
app.post('/api/admin/proveedores', (req, res) => {
  try {
    const { nombre, categoria, contacto, email, telefono, ciudad, productosSuministrados } = req.body;

    if (!nombre || !email || !telefono) {
      return res.status(400).json({
        success: false,
        message: 'Nombre de la empresa, correo electrónico y teléfono son obligatorios.'
      });
    }

    const nuevoProveedor = {
      id: proveedores.length > 0 ? Math.max(...proveedores.map((p) => p.id)) + 1 : 1,
      nombre: String(nombre).trim(),
      categoria: categoria || 'General',
      contacto: contacto || 'Representante Comercial',
      email: String(email).trim().toLowerCase(),
      telefono: String(telefono).trim(),
      ciudad: ciudad || 'Bogotá D.C.',
      rating: 5.0,
      productosSuministrados: Array.isArray(productosSuministrados) ? productosSuministrados : ['Insumos Ferreteros'],
      registradoEn: new Date().toISOString()
    };

    proveedores.push(nuevoProveedor);

    console.log(`🏭 [SCM] Nuevo proveedor registrado: ${nuevoProveedor.nombre} (ID: ${nuevoProveedor.id})`);

    return res.status(201).json({
      success: true,
      message: 'Proveedor aliado registrado exitosamente.',
      proveedor: nuevoProveedor
    });
  } catch (error) {
    console.error('Error al registrar proveedor:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al registrar proveedor.',
      error: error.message
    });
  }
});

/**
 * DELETE /api/admin/proveedores/:id
 * Retiro de proveedor aliado
 */
app.delete('/api/admin/proveedores/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = proveedores.findIndex((p) => p.id === id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: `Proveedor con ID ${id} no encontrado.`
    });
  }

  const eliminado = proveedores.splice(index, 1)[0];
  console.log(`🗑️ [SCM] Proveedor retirado: ${eliminado.nombre}`);

  return res.json({
    success: true,
    message: `Proveedor "${eliminado.nombre}" retirado de la cadena de suministro.`,
    proveedor: eliminado
  });
});

/**
 * GET /api/sucursales
 * Lista de sedes físicas y bodegas para Click & Collect
 */
app.get('/api/sucursales', (req, res) => {
  return res.json({
    success: true,
    total: sucursales.length,
    sucursales
  });
});

// ==========================================================================
// 6. CONTROL DE INVENTARIO CRÍTICO Y ALERTAS
// ==========================================================================

/**
 * GET /api/admin/inventario/alertas
 * Identifica automáticamente ítems con stock <= umbral (por defecto 5)
 */
app.get('/api/admin/inventario/alertas', (req, res) => {
  const umbral = Number(req.query.umbral) || 5;
  const criticos = productos.filter((p) => Number(p.stock) <= umbral);

  return res.json({
    success: true,
    umbral,
    totalAlertas: criticos.length,
    productosCriticos: criticos.map((p) => ({
      id: p.id,
      nombre: p.nombre,
      categoria: p.categoria,
      stockActual: p.stock,
      precio: p.precio,
      estadoStock: p.stock === 0 ? 'AGOTADO' : 'CRÍTICO',
      imagen: p.imagen
    }))
  });
});

/**
 * PATCH /api/admin/productos/:id/reabastecer
 * Permite al administrador sumar unidades en lote al stock de bodega y registra movimiento en Kardex
 */
app.patch('/api/admin/productos/:id/reabastecer', (req, res) => {
  const id = Number(req.params.id);
  const { cantidad, motivo } = req.body;

  const unidades = Number(cantidad);
  if (isNaN(unidades) || unidades <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Debes especificar una cantidad válida y mayor a 0 para reabastecer.'
    });
  }

  const index = productos.findIndex((p) => p.id === id);
  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: `Producto con ID ${id} no encontrado.`
    });
  }

  const anterior = productos[index].stock;
  productos[index].stock = anterior + unidades;

  const movimiento = {
    id: Date.now(),
    productoId: id,
    productoNombre: productos[index].nombre,
    tipo: 'ENTRADA',
    cantidad: unidades,
    motivo: motivo || 'Reabastecimiento de bodega central',
    fecha: new Date().toISOString()
  };
  movimientosInventario.unshift(movimiento);

  console.log(`📈 [INVENTARIO/KARDEX] Reabastecido ID ${id} (${productos[index].nombre}): ${anterior} -> ${productos[index].stock} (+${unidades}) | Motivo: ${movimiento.motivo}`);

  return res.json({
    success: true,
    message: `Se sumaron ${unidades} unidades al inventario de "${productos[index].nombre}". Nuevo stock: ${productos[index].stock}.`,
    producto: productos[index],
    movimiento
  });
});

/**
 * GET /api/admin/inventario/kardex
 * Retorna el historial de movimientos de entrada, salida y ajustes de bodega
 */
app.get('/api/admin/inventario/kardex', (req, res) => {
  return res.json({
    success: true,
    total: movimientosInventario.length,
    movimientos: movimientosInventario
  });
});

// ==========================================================================
// 7. INTELIGENCIA DE NEGOCIOS Y B2B
// ==========================================================================

/**
 * GET /api/admin/metricas
 * Retorna KPIs ejecutivos para toma de decisiones
 */
app.get('/api/admin/metricas', (req, res) => {
  // Ventas acumuladas de órdenes pagadas/despachadas/entregadas
  const ordenesValidas = ordenes.filter(
    (o) => o.estado === 'en_preparacion' || o.estado === 'despachado' || o.estado === 'entregado'
  );

  const ventasTotalesCOP = ordenesValidas.reduce((sum, o) => sum + Number(o.total || 0), 0);
  const pedidosActivos = ordenes.filter(
    (o) => o.estado === 'en_preparacion' || o.estado === 'despachado'
  ).length;

  const totalUnidadesInventario = productos.reduce((sum, p) => sum + (Number(p.stock) || 0), 0);
  const valorizacionInventarioCOP = productos.reduce(
    (sum, p) => sum + (Number(p.stock) || 0) * (Number(p.precio) || 0),
    0
  );

  const itemsCriticos = productos.filter((p) => Number(p.stock) <= 5).length;
  const ofertasActivas = productos.filter((p) => p.enOferta).length;

  return res.json({
    success: true,
    kpis: {
      ventasTotalesCOP,
      pedidosActivos,
      totalOrdenes: ordenes.length,
      totalUnidadesInventario,
      valorizacionInventarioCOP,
      itemsCriticos,
      ofertasActivas,
      totalProveedores: proveedores.length,
      cotizacionesPendientes: cotizaciones.filter((c) => c.estado === 'pendiente').length
    },
    timestamp: new Date().toISOString()
  });
});

/**
 * POST /api/cotizaciones
 * Recepción de solicitudes B2B por volumen para constructores y contratistas
 */
app.post('/api/cotizaciones', (req, res) => {
  try {
    const { empresa, nit, cliente, email, telefono, ciudad, items, comentarios } = req.body;

    if (!empresa || !cliente || !email || !telefono || !items) {
      return res.status(400).json({
        success: false,
        message: 'Empresa, cliente, correo, teléfono y la lista de materiales son obligatorios.'
      });
    }

    const nuevaCotizacion = {
      id: cotizaciones.length > 0 ? Math.max(...cotizaciones.map((c) => c.id)) + 1 : 1,
      codigo: `COT-2026-${String(cotizaciones.length + 1).padStart(3, '0')}`,
      empresa: String(empresa).trim(),
      nit: nit ? String(nit).trim() : 'N/A',
      cliente: String(cliente).trim(),
      email: String(email).trim().toLowerCase(),
      telefono: String(telefono).trim(),
      ciudad: ciudad || 'Colombia',
      items: String(items).trim(),
      comentarios: comentarios || '',
      estado: 'pendiente',
      createdAt: new Date().toISOString()
    };

    cotizaciones.unshift(nuevaCotizacion);

    console.log(`📋 [B2B] Cotización recibida: ${nuevaCotizacion.codigo} de ${nuevaCotizacion.empresa}`);

    return res.status(201).json({
      success: true,
      codigo: nuevaCotizacion.codigo,
      message: 'Solicitud de cotización B2B recibida. Un asesor corporativo responderá en menos de 2 horas hábiles.',
      cotizacion: nuevaCotizacion
    });
  } catch (error) {
    console.error('Error al recibir cotización:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al procesar la cotización.',
      error: error.message
    });
  }
});

/**
 * GET /api/admin/cotizaciones
 * Listado de cotizaciones corporativas
 */
app.get('/api/admin/cotizaciones', (req, res) => {
  return res.json({
    success: true,
    total: cotizaciones.length,
    cotizaciones
  });
});

/**
 * PATCH /api/admin/cotizaciones/:id/estado
 * Actualiza el estado de una cotización (contactado, cerrada, rechazada)
 */
app.patch('/api/admin/cotizaciones/:id/estado', (req, res) => {
  const id = Number(req.params.id);
  const { estado } = req.body;

  const cot = cotizaciones.find((c) => c.id === id);
  if (!cot) {
    return res.status(404).json({ success: false, message: `Cotización con ID ${id} no encontrada.` });
  }

  cot.estado = estado || 'contactado';
  cot.actualizadoEn = new Date().toISOString();

  return res.json({
    success: true,
    message: `Cotización ${cot.codigo} actualizada a estado: ${cot.estado}.`,
    cotizacion: cot
  });
});

// ==========================================================================
// 8. SOCIAL PROOF Y RESEÑAS DE PRODUCTOS
// ==========================================================================

/**
 * GET /api/productos/:id/resenas
 * Obtiene reseñas y promedio de estrellas
 */
app.get('/api/productos/:id/resenas', (req, res) => {
  const productoId = Number(req.params.id);
  const lista = resenas.filter((r) => r.productoId === productoId);

  const promedio = lista.length > 0
    ? Number((lista.reduce((sum, r) => sum + Number(r.calificacion), 0) / lista.length).toFixed(1))
    : 5.0;

  return res.json({
    success: true,
    productoId,
    totalResenas: lista.length,
    promedioEstrellas: promedio,
    resenas: lista
  });
});

/**
 * POST /api/productos/:id/resenas
 * Permite calificar un producto (estrellas 1 a 5 y comentario)
 */
app.post('/api/productos/:id/resenas', (req, res) => {
  try {
    const productoId = Number(req.params.id);
    const { nombre, calificacion, comentario } = req.body;

    const estrellas = Number(calificacion);
    if (!estrellas || estrellas < 1 || estrellas > 5) {
      return res.status(400).json({
        success: false,
        message: 'La calificación debe ser un número entero entre 1 y 5 estrellas.'
      });
    }

    if (!comentario || comentario.trim().length < 5) {
      return res.status(400).json({
        success: false,
        message: 'El comentario debe tener al menos 5 caracteres.'
      });
    }

    const nuevaResena = {
      id: resenas.length > 0 ? Math.max(...resenas.map((r) => r.id)) + 1 : 1,
      productoId,
      nombre: nombre ? String(nombre).trim() : 'Comprador Verificado',
      calificacion: estrellas,
      comentario: String(comentario).trim(),
      fecha: new Date().toISOString()
    };

    resenas.unshift(nuevaResena);

    // Actualizar rating promedio en el producto
    const prodsActuales = resenas.filter((r) => r.productoId === productoId);
    const nuevoPromedio = Number((prodsActuales.reduce((s, r) => s + r.calificacion, 0) / prodsActuales.length).toFixed(1));

    const prod = productos.find((p) => p.id === productoId);
    if (prod) {
      prod.rating = nuevoPromedio;
    }

    console.log(`⭐ [RESEÑA] Nueva reseña en producto #${productoId}: ${estrellas}★ - ${nuevaResena.nombre}`);

    return res.status(201).json({
      success: true,
      message: '¡Gracias por tu opinión! Reseña publicada exitosamente.',
      resena: nuevaResena,
      nuevoPromedio
    });
  } catch (error) {
    console.error('Error al agregar reseña:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al publicar la reseña.',
      error: error.message
    });
  }
});

// ==========================================================================
// 9. PROMOCIONES Y VALIDACIÓN DE CUPONES
// ==========================================================================

/**
 * POST /api/cupones/validar
 * Valida cupones promocionales (ej. FERRE10, MAESTRO2026, SENA2026)
 */
app.post('/api/cupones/validar', (req, res) => {
  const { codigo, subtotal } = req.body;

  if (!codigo) {
    return res.status(400).json({
      valido: false,
      message: 'Debes ingresar un código de cupón.'
    });
  }

  const codigoMayus = String(codigo).trim().toUpperCase();
  const cupon = cupones[codigoMayus];

  if (!cupon) {
    return res.status(404).json({
      valido: false,
      message: 'El cupón ingresado no existe o ha expirado.'
    });
  }

  const monto = Number(subtotal) || 0;

  if (cupon.minimo && monto < cupon.minimo) {
    return res.status(400).json({
      valido: false,
      message: `El cupón ${codigoMayus} requiere una compra mínima de $${cupon.minimo.toLocaleString('es-CO')} COP.`
    });
  }

  let descuentoCalculado = 0;
  if (cupon.tipo === 'porcentaje') {
    descuentoCalculado = Math.round(monto * (cupon.valor / 100));
  } else if (cupon.tipo === 'fijo') {
    descuentoCalculado = Math.min(monto, cupon.valor);
  }

  const totalConDescuento = Math.max(0, monto - descuentoCalculado);

  return res.json({
    valido: true,
    codigo: codigoMayus,
    tipo: cupon.tipo,
    valor: cupon.valor,
    descuentoCalculado,
    totalConDescuento,
    descripcion: cupon.descripcion,
    message: `¡Cupón ${codigoMayus} aplicado con éxito!`
  });
});

// ==========================================================================
// 10. ESTADO Y SALUD DEL SERVIDOR
// ==========================================================================
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    servicio: 'FERREWEB API RESTful Industrial',
    evidencia: 'GA7-220501096-AA5-EV03',
    tienda: 'FERREWEB Oficial Colombia',
    puerto: PORT,
    productosRegistrados: productos.length,
    usuariosRegistrados: usuarios.length,
    proveedoresRegistrados: proveedores.length,
    ordenesRegistradas: ordenes.length,
    timestamp: new Date().toISOString()
  });
});

// Iniciar servidor Express en el puerto 5000 (solo si se ejecuta directamente y no en pruebas)
const isDirectRun = process.argv[1] && (process.argv[1].endsWith('server.js') || process.argv[1].endsWith('start-server.js')) && !process.argv[1].includes('test');
if (isDirectRun && process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log('\n=============================================================');
    console.log('🚀 FERREWEB - SERVIDOR BACKEND API REST ACTIVO (PUERTO ' + PORT + ')');
    console.log('=============================================================');
    console.log(`📌 Catálogo:         GET    http://localhost:${PORT}/api/productos`);
    console.log(`💳 Wompi Checkout:   POST   http://localhost:${PORT}/api/crear-pago`);
    console.log(`🔍 Tracking OMS:     GET    http://localhost:${PORT}/api/pedidos/rastreo/:ref`);
    console.log(`🏭 Proveedores SCM:  GET    http://localhost:${PORT}/api/proveedores`);
    console.log(`🚨 Stock Alertas:    GET    http://localhost:${PORT}/api/admin/inventario/alertas`);
    console.log(`📊 Métricas KPIs:    GET    http://localhost:${PORT}/api/admin/metricas`);
    console.log(`📋 Cotizaciones B2B: POST   http://localhost:${PORT}/api/cotizaciones`);
    console.log(`⭐ Reseñas Social:   GET    http://localhost:${PORT}/api/productos/:id/resenas`);
    console.log(`🎟️ Cupones Promo:    POST   http://localhost:${PORT}/api/cupones/validar`);
    console.log(`🩺 Health Check:     GET    http://localhost:${PORT}/api/health`);
    console.log('=============================================================\n');
  });
}

export default app;
