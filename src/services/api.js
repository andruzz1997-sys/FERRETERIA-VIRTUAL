import { productos as fallbackProductos } from '../data/productos.js';

/**
 * Servicio de Comunicación con la API REST de FERREWEB
 * Backend URL: http://localhost:5000/api
 */
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Obtener listado dinámico de productos
 */
export async function obtenerProductos() {
  try {
    const res = await fetch(`${API_URL}/productos`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    return Array.isArray(data) ? data : (data.productos || fallbackProductos);
  } catch (err) {
    console.warn('⚠️ [API] No se pudo conectar con el servidor backend en 5000, usando datos locales:', err.message);
    return fallbackProductos;
  }
}

/**
 * Iniciar Sesión (Login)
 * Valida credenciales contra POST /api/login
 */
export async function loginUsuario(email, password) {
  try {
    const res = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Error al iniciar sesión');
    }
    return data;
  } catch (err) {
    // Modo demo offline si el backend no está disponible en GitHub Pages
    if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
      console.warn('⚠️ Backend offline, aplicando validación local para modo demostración.');
      if (email.trim().toLowerCase() === 'admin@ferreweb.com' && password === 'admin123') {
        return {
          success: true,
          message: 'Inicio de sesión exitoso como Administrador',
          token: 'jwt-admin-offline',
          user: { id: 1, nombre: 'Administrador FerreWeb', email: 'admin@ferreweb.com', rol: 'admin' }
        };
      } else if (email && password) {
        return {
          success: true,
          message: 'Inicio de sesión exitoso',
          token: 'jwt-client-offline',
          user: { id: 2, nombre: 'Cliente FerreWeb', email, rol: 'cliente' }
        };
      }
    }
    throw err;
  }
}

/**
 * Registrar nuevo usuario
 * Envía datos a POST /api/registro
 */
export async function registrarUsuario({ nombre, email, password, telefono }) {
  try {
    const res = await fetch(`${API_URL}/registro`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, email, password, telefono })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Error al registrar usuario');
    }
    return data;
  } catch (err) {
    if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
      console.warn('⚠️ Backend offline, simulando registro local.');
      return {
        success: true,
        message: 'Usuario registrado exitosamente (Modo Demo)',
        user: { id: Date.now(), nombre, email, telefono, rol: 'cliente' }
      };
    }
    throw err;
  }
}

/**
 * Crear producto (Admin)
 * POST /api/admin/productos
 */
export async function crearProductoAdmin(producto) {
  const res = await fetch(`${API_URL}/admin/productos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(producto)
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Error al crear producto');
  }
  return data;
}

/**
 * Actualizar producto (Admin)
 * PUT /api/admin/productos/:id
 */
export async function actualizarProductoAdmin(id, datos) {
  const res = await fetch(`${API_URL}/admin/productos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Error al actualizar producto');
  }
  return data;
}

/**
 * Eliminar producto (Admin)
 * DELETE /api/admin/productos/:id
 */
export async function eliminarProductoAdmin(id) {
  const res = await fetch(`${API_URL}/admin/productos/${id}`, {
    method: 'DELETE'
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Error al eliminar producto');
  }
  return data;
}

/**
 * Iniciar Checkout y redirección de pago real
 * POST /api/crear-pago
 */
export async function crearPago({ items, total, customer }) {
  try {
    const res = await fetch(`${API_URL}/crear-pago`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items, total, customer })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Error al generar la pasarela de pago');
    }
    return data;
  } catch (err) {
    if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
      // Fallback directo a Wompi Checkout con llave de prueba si el backend está desconectado
      const granTotal = total >= 350000 ? total : total + 12000;
      const totalEnCentavos = Math.round(granTotal * 100);
      const ref = `FERREWEB-${Date.now()}`;
      const urlRetorno = encodeURIComponent(window.location.origin + window.location.pathname + '#/?pago=exitoso&ref=' + ref);
      return {
        success: true,
        url: `https://checkout.wompi.co/p/?public-key=pub_test_Q5yDA9xoKdePiumAlhrbxDrfvRrUNKy1&currency=COP&amount-in-cents=${totalEnCentavos}&reference=${ref}&redirect-url=${urlRetorno}`,
        referencia: ref
      };
    }
    throw err;
  }
}
