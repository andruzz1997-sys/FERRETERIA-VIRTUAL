import http from 'http';
import app from '../server.js';

const PORT = 5001; // Usar 5001 para las pruebas automatizadas
const server = app.listen(PORT, async () => {
  console.log(`🧪 Servidor de pruebas iniciado en http://localhost:${PORT}`);

  const postJSON = (path, body) => {
    return new Promise((resolve, reject) => {
      const data = JSON.stringify(body);
      const req = http.request({
        hostname: 'localhost',
        port: PORT,
        path,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(data)
        }
      }, (res) => {
        let resData = '';
        res.on('data', chunk => resData += chunk);
        res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(resData) }));
      });
      req.on('error', reject);
      req.write(data);
      req.end();
    });
  };

  const getJSON = (path) => {
    return new Promise((resolve, reject) => {
      http.get(`http://localhost:${PORT}${path}`, (res) => {
        let resData = '';
        res.on('data', chunk => resData += chunk);
        res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(resData) }));
      }).on('error', reject);
    });
  };

  const putJSON = (path, body) => {
    return new Promise((resolve, reject) => {
      const data = JSON.stringify(body);
      const req = http.request({
        hostname: 'localhost',
        port: PORT,
        path,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(data)
        }
      }, (res) => {
        let resData = '';
        res.on('data', chunk => resData += chunk);
        res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(resData) }));
      });
      req.on('error', reject);
      req.write(data);
      req.end();
    });
  };

  const deleteJSON = (path) => {
    return new Promise((resolve, reject) => {
      const req = http.request({
        hostname: 'localhost',
        port: PORT,
        path,
        method: 'DELETE'
      }, (res) => {
        let resData = '';
        res.on('data', chunk => resData += chunk);
        res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(resData) }));
      });
      req.on('error', reject);
      req.end();
    });
  };

  try {
    console.log('\n--- 1. Test POST /api/registro ---');
    const regRes = await postJSON('/api/registro', {
      nombre: 'Aprendiz SENA',
      email: 'aprendiz@sena.edu.co',
      password: 'password123',
      telefono: '3001112233'
    });
    console.log('Status:', regRes.status, '| User:', regRes.body.user);
    if (regRes.status !== 201 || regRes.body.user.rol !== 'cliente') {
      throw new Error('Fallo en registro');
    }

    console.log('\n--- 2. Test POST /api/login (Admin) ---');
    const loginAdmin = await postJSON('/api/login', {
      email: 'admin@ferreweb.com',
      password: 'admin123'
    });
    console.log('Status:', loginAdmin.status, '| Rol:', loginAdmin.body.user.rol);
    if (loginAdmin.body.user.rol !== 'admin') {
      throw new Error('El rol de admin debe ser "admin"');
    }

    console.log('\n--- 3. Test POST /api/login (Cliente) ---');
    const loginClient = await postJSON('/api/login', {
      email: 'aprendiz@sena.edu.co',
      password: 'password123'
    });
    console.log('Status:', loginClient.status, '| Rol:', loginClient.body.user.rol);
    if (loginClient.body.user.rol !== 'cliente') {
      throw new Error('El rol debe ser "cliente"');
    }

    console.log('\n--- 4. Test GET /api/productos ---');
    const prodsRes = await getJSON('/api/productos');
    console.log('Status:', prodsRes.status, '| Total productos:', prodsRes.body.length);
    if (!Array.isArray(prodsRes.body) || prodsRes.body.length === 0) {
      throw new Error('Fallo al obtener productos');
    }

    console.log('\n--- 5. Test POST /api/admin/productos (Crear Producto) ---');
    const nuevoProd = await postJSON('/api/admin/productos', {
      nombre: 'Compresor de Aire Industrial 50L',
      categoria: 'Herramientas',
      precio: 850000,
      enOferta: true,
      descuento: 15,
      stock: 8
    });
    console.log('Status:', nuevoProd.status, '| Creado ID:', nuevoProd.body.producto.id);
    const idCreado = nuevoProd.body.producto.id;

    console.log('\n--- 6. Test PUT /api/admin/productos/:id (Ajustar Stock y Oferta) ---');
    const editRes = await putJSON(`/api/admin/productos/${idCreado}`, {
      stock: 25,
      precio: 799000
    });
    console.log('Status:', editRes.status, '| Nuevo stock:', editRes.body.producto.stock, '| Nuevo precio:', editRes.body.producto.precio);

    console.log('\n--- 7. Test DELETE /api/admin/productos/:id ---');
    const delRes = await deleteJSON(`/api/admin/productos/${idCreado}`);
    console.log('Status:', delRes.status, '| Mensaje:', delRes.body.message);

    console.log('\n--- 8. Test POST /api/crear-pago (Pasarela de Pago Wompi) ---');
    const pagoRes = await postJSON('/api/crear-pago', {
      items: [{ id: 1, nombre: 'Taladro', precio: 450000, cantidad: 1 }],
      total: 450000
    });
    console.log('Status:', pagoRes.status, '| URL Pasarela:', pagoRes.body.url);
    if (!pagoRes.body.url.includes('checkout.wompi.co')) {
      throw new Error('La URL de pasarela no contiene checkout.wompi.co');
    }

    console.log('\n🎉 ¡TODOS LOS ENDPOINTS FUNCIONAN CORRECTAMENTE!');
    server.close(() => process.exit(0));
  } catch (error) {
    console.error('❌ Error en pruebas:', error);
    server.close(() => process.exit(1));
  }
});
