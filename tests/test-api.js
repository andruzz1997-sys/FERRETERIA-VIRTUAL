import http from 'http';
import app from '../server.js';

process.env.NODE_ENV = 'test';
const PORT = 5001; // Puerto aislado para suite de pruebas automatizadas

const server = app.listen(PORT, async () => {
  console.log(`\n=============================================================`);
  console.log(`🧪 INICIANDO SUITE DE PRUEBAS DE INTEGRACIÓN: FERREWEB API`);
  console.log(`📌 Evidencia SENA: GA7-220501096-AA5-EV03`);
  console.log(`📌 Servidor de pruebas activo en: http://localhost:${PORT}`);
  console.log(`=============================================================\n`);

  const requestJSON = (method, path, body = null) => {
    return new Promise((resolve, reject) => {
      const data = body ? JSON.stringify(body) : null;
      const headers = { 'Content-Type': 'application/json' };
      if (data) {
        headers['Content-Length'] = Buffer.byteLength(data);
      }

      const req = http.request({
        hostname: 'localhost',
        port: PORT,
        path,
        method,
        headers
      }, (res) => {
        let resData = '';
        res.on('data', chunk => resData += chunk);
        res.on('end', () => {
          let parsed = {};
          try {
            parsed = resData ? JSON.parse(resData) : {};
          } catch (e) {
            parsed = { raw: resData };
          }
          resolve({ status: res.statusCode, body: parsed });
        });
      });

      req.on('error', reject);
      if (data) req.write(data);
      req.end();
    });
  };

  const getJSON = (path) => requestJSON('GET', path);
  const postJSON = (path, body) => requestJSON('POST', path, body);
  const putJSON = (path, body) => requestJSON('PUT', path, body);
  const patchJSON = (path, body) => requestJSON('PATCH', path, body);
  const deleteJSON = (path) => requestJSON('DELETE', path);

  let passedTests = 0;
  let totalTests = 0;

  const assert = (condition, name, status, expectedStatus) => {
    totalTests++;
    if (condition) {
      passedTests++;
      console.log(`✅ [TEST ${totalTests}] ${name} -> Código: ${status} (Esperado: ${expectedStatus})`);
    } else {
      console.error(`❌ [TEST ${totalTests}] ${name} -> FALLÓ con Código: ${status} (Esperado: ${expectedStatus})`);
      throw new Error(`Fallo en prueba: ${name}`);
    }
  };

  try {
    // 1. Health Check
    const health = await getJSON('/api/health');
    assert(health.status === 200, 'GET /api/health (Estado del Servidor)', health.status, 200);

    // 2. Registro de Usuario
    const regRes = await postJSON('/api/registro', {
      nombre: 'Aprendiz SENA QA',
      email: `qa_${Date.now()}@sena.edu.co`,
      password: 'password123',
      telefono: '3101234567'
    });
    assert(regRes.status === 201, 'POST /api/registro (Crear Usuario Cliente)', regRes.status, 201);

    // 3. Login Admin
    const loginAdmin = await postJSON('/api/login', {
      email: 'admin@ferreweb.com',
      password: 'admin123'
    });
    assert(loginAdmin.status === 200 && loginAdmin.body.user.rol === 'admin', 'POST /api/login (Autenticación Administrador)', loginAdmin.status, 200);

    // 4. Login Cliente
    const loginClient = await postJSON('/api/login', {
      email: 'cliente@ferreweb.com',
      password: 'cliente123'
    });
    assert(loginClient.status === 200 && loginClient.body.user.rol === 'cliente', 'POST /api/login (Autenticación Cliente)', loginClient.status, 200);

    // 5. Catálogo General
    const prods = await getJSON('/api/productos');
    assert(prods.status === 200 && Array.isArray(prods.body), 'GET /api/productos (Consultar Catálogo)', prods.status, 200);

    // 6. Detalle Individual de Producto
    const prodDetalle = await getJSON('/api/productos/1');
    assert(prodDetalle.status === 200 && prodDetalle.body.id === 1, 'GET /api/productos/:id (Ficha Técnica Producto)', prodDetalle.status, 200);

    // 7. Crear Producto (Admin)
    const nuevoProd = await postJSON('/api/admin/productos', {
      nombre: 'Generador Eléctrico a Gasolina 3500W',
      categoria: 'Electricidad',
      precio: 1850000,
      stock: 4,
      enOferta: true,
      descuento: 12
    });
    assert(nuevoProd.status === 201 && nuevoProd.body.producto.id, 'POST /api/admin/productos (Registrar Producto)', nuevoProd.status, 201);
    const prodId = nuevoProd.body.producto.id;

    // 8. Actualizar Producto (Admin)
    const editProd = await putJSON(`/api/admin/productos/${prodId}`, {
      nombre: 'Generador Eléctrico a Gasolina 3500W Pro',
      precio: 1790000
    });
    assert(editProd.status === 200, 'PUT /api/admin/productos/:id (Actualizar Producto)', editProd.status, 200);

    // 9. Reabastecer Stock por Lote (Admin)
    const restock = await patchJSON(`/api/admin/productos/${prodId}/reabastecer`, {
      cantidad: 20
    });
    assert(restock.status === 200 && restock.body.producto.stock >= 24, 'PATCH /api/admin/productos/:id/reabastecer (Sumar Unidades)', restock.status, 200);

    // 10. Alertas de Inventario Crítico
    const alertas = await getJSON('/api/admin/inventario/alertas?umbral=5');
    assert(alertas.status === 200 && Array.isArray(alertas.body.productosCriticos), 'GET /api/admin/inventario/alertas (Monitor Stock <= 5)', alertas.status, 200);

    // 11. Pasarela Oficial Wompi (Firma SHA-256)
    const pago = await postJSON('/api/crear-pago', {
      items: [{ id: 1, nombre: 'Taladro Inalámbrico', precio: 450000, cantidad: 1 }],
      total: 450000,
      customer: { nombre: 'Andrés SENA', email: 'andres@sena.edu.co', telefono: '3001234567' },
      shippingAddress: { direccion: 'Calle 100 # 15-20', ciudad: 'Bogotá' }
    });
    assert(
      pago.status === 201 && pago.body.url.includes('checkout.wompi.co') && pago.body.signature,
      'POST /api/crear-pago (Generar Wompi Checkout con Firma SHA-256)',
      pago.status,
      201
    );
    const refGenerada = pago.body.referencia;

    // 12. Consultar Transacción Wompi Sandbox
    const txnWompi = await getJSON(`/api/wompi/transaccion/mock-txn-12345?ref=${refGenerada}`);
    assert(txnWompi.status === 200 && txnWompi.body.transaccion.status === 'APPROVED', 'GET /api/wompi/transaccion/:id (Verificar Wompi)', txnWompi.status, 200);

    // 13. Webhook Listener Wompi
    const webhook = await postJSON('/api/wompi-webhook', {
      event: 'transaction.updated',
      data: {
        transaction: {
          id: 'wompi-hook-01',
          reference: refGenerada,
          status: 'APPROVED'
        }
      }
    });
    assert(webhook.status === 200 && webhook.body.received, 'POST /api/wompi-webhook (Listener de Eventos Wompi)', webhook.status, 200);

    // 14. Historial de Pedidos del Cliente (OMS)
    const historial = await getJSON('/api/pedidos/usuario/2');
    assert(historial.status === 200 && Array.isArray(historial.body.pedidos), 'GET /api/pedidos/usuario/:usuarioId (Historial de Compras)', historial.status, 200);

    // 15. Rastrear Pedido Público (Tracking)
    const tracking = await getJSON(`/api/pedidos/rastreo/${refGenerada}`);
    assert(tracking.status === 200 && tracking.body.referencia === refGenerada, 'GET /api/pedidos/rastreo/:referencia (Tracking Logístico)', tracking.status, 200);

    // 16. Listado de Pedidos Admin
    const pedidosAdmin = await getJSON('/api/admin/pedidos');
    assert(pedidosAdmin.status === 200 && Array.isArray(pedidosAdmin.body.pedidos), 'GET /api/admin/pedidos (Consola de Órdenes OMS)', pedidosAdmin.status, 200);

    // 17. Cambiar Estado del Pedido (Admin)
    const estadoPedido = await patchJSON(`/api/admin/pedidos/${refGenerada}/estado`, {
      nuevoEstado: 'despachado'
    });
    assert(estadoPedido.status === 200 && estadoPedido.body.orden.estado === 'despachado', 'PATCH /api/admin/pedidos/:referencia/estado (Transición de Estado)', estadoPedido.status, 200);

    // 18. Directorio de Proveedores (SCM)
    const provs = await getJSON('/api/proveedores');
    assert(provs.status === 200 && Array.isArray(provs.body.proveedores), 'GET /api/proveedores (Directorio Marcas Aliadas)', provs.status, 200);

    // 19. Registrar Nuevo Proveedor (Admin)
    const nuevoProv = await postJSON('/api/admin/proveedores', {
      nombre: 'Aceros Industriales de Colombia S.A.S.',
      categoria: 'Estructuras y Metales',
      contacto: 'Ing. Javier Soler',
      email: 'ventas@acerosindustriales.co',
      telefono: '+57 (601) 456 7890',
      ciudad: 'Bogotá'
    });
    assert(nuevoProv.status === 201 && nuevoProv.body.proveedor.id, 'POST /api/admin/proveedores (Registro Proveedor SCM)', nuevoProv.status, 201);
    const provId = nuevoProv.body.proveedor.id;

    // 20. Retirar Proveedor (Admin)
    const delProv = await deleteJSON(`/api/admin/proveedores/${provId}`);
    assert(delProv.status === 200, 'DELETE /api/admin/proveedores/:id (Retiro de Proveedor)', delProv.status, 200);

    // 21. Sedes Físicas Click & Collect
    const sedes = await getJSON('/api/sucursales');
    assert(sedes.status === 200 && Array.isArray(sedes.body.sucursales), 'GET /api/sucursales (Sedes Retiro en Tienda)', sedes.status, 200);

    // 22. Métricas y KPIs de Negocio
    const kpis = await getJSON('/api/admin/metricas');
    assert(kpis.status === 200 && kpis.body.kpis.totalUnidadesInventario !== undefined, 'GET /api/admin/metricas (KPIs Ejecutivos)', kpis.status, 200);

    // 23. Solicitar Cotización B2B
    const cotizacion = await postJSON('/api/cotizaciones', {
      empresa: 'Consorcio Obras Andinas',
      nit: '901.442.871-3',
      cliente: 'Ing. Roberto Silva',
      email: 'rsilva@obrasandinas.com',
      telefono: '318 765 4321',
      ciudad: 'Medellín',
      items: '500 bultos cemento, 80 tubos sanitarios, 30 galones pintura'
    });
    assert(cotizacion.status === 201 && cotizacion.body.codigo, 'POST /api/cotizaciones (Recepción B2B Constructores)', cotizacion.status, 201);
    const cotId = cotizacion.body.cotizacion.id;

    // 24. Listado de Cotizaciones Admin
    const cotsAdmin = await getJSON('/api/admin/cotizaciones');
    assert(cotsAdmin.status === 200 && Array.isArray(cotsAdmin.body.cotizaciones), 'GET /api/admin/cotizaciones (Bandeja Cotizaciones B2B)', cotsAdmin.status, 200);

    // 25. Actualizar Estado de Cotización
    const cotEstado = await patchJSON(`/api/admin/cotizaciones/${cotId}/estado`, {
      estado: 'contactado'
    });
    assert(cotEstado.status === 200 && cotEstado.body.cotizacion.estado === 'contactado', 'PATCH /api/admin/cotizaciones/:id/estado (Atender Cotización)', cotEstado.status, 200);

    // 26. Consultar Reseñas de Producto
    const reviews = await getJSON('/api/productos/1/resenas');
    assert(reviews.status === 200 && reviews.body.promedioEstrellas !== undefined, 'GET /api/productos/:id/resenas (Social Proof)', reviews.status, 200);

    // 27. Publicar Nueva Reseña
    const addReview = await postJSON('/api/productos/1/resenas', {
      nombre: 'Ingeniero Evaluador SENA',
      calificacion: 5,
      comentario: 'Excelente suministro con ficha técnica precisa y rendimiento superior.'
    });
    assert(addReview.status === 201 && addReview.body.resena.id, 'POST /api/productos/:id/resenas (Publicar Calificación)', addReview.status, 201);

    // 28. Validar Cupón Promocional
    const cupon = await postJSON('/api/cupones/validar', {
      codigo: 'FERRE10',
      subtotal: 500000
    });
    assert(cupon.status === 200 && cupon.body.valido === true && cupon.body.descuentoCalculado === 50000, 'POST /api/cupones/validar (Validar Descuento FERRE10)', cupon.status, 200);

    // 29. Eliminar Producto Creado (Limpieza)
    const delProd = await deleteJSON(`/api/admin/productos/${prodId}`);
    assert(delProd.status === 200, 'DELETE /api/admin/productos/:id (Eliminar Producto)', delProd.status, 200);

    console.log(`\n=============================================================`);
    console.log(`🎉 ¡ÉXITO TOTAL! ${passedTests} DE ${totalTests} PRUEBAS COMPLETADAS SATISFACTORIAMENTE.`);
    console.log(`💯 Ninguna ruta arrojó códigos de error 500.`);
    console.log(`=============================================================\n`);

    server.close(() => process.exit(0));
  } catch (error) {
    console.error('\n❌ ERROR EN LA EJECUCIÓN DE PRUEBAS:', error.message);
    server.close(() => process.exit(1));
  }
});
