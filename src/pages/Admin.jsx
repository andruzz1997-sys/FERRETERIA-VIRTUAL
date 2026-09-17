import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldAlert, 
  Plus, 
  Edit3, 
  Trash2, 
  Package, 
  Tag, 
  TrendingUp, 
  Check, 
  X, 
  Save, 
  AlertCircle,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { 
  obtenerProductos, 
  crearProductoAdmin, 
  actualizarProductoAdmin, 
  eliminarProductoAdmin 
} from '../services/api';
import { formatearPrecioCOP, categorias } from '../data/productos';

/**
 * Panel de Administración Protegido (/admin)
 * Permite gestionar inventario, stock y definir precios en oferta.
 * Evidencia: SENA GA7-220501096-AA4-EV03
 */
export default function Admin({ currentUser, onOpenAuthModal }) {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState(null);
  const [error, setError] = useState(null);

  // Estado del modal/formulario de producto
  const [modalAbierto, setModalAbierto] = useState(false);
  const [productoEditando, setProductoEditando] = useState(null);

  // Formulario
  const [formNombre, setFormNombre] = useState('');
  const [formCategoria, setFormCategoria] = useState('Herramientas');
  const [formPrecio, setFormPrecio] = useState('');
  const [formPrecioAnterior, setFormPrecioAnterior] = useState('');
  const [formEnOferta, setFormEnOferta] = useState(false);
  const [formDescuento, setFormDescuento] = useState(10);
  const [formStock, setFormStock] = useState(15);
  const [formImagen, setFormImagen] = useState('');
  const [formDescripcion, setFormDescripcion] = useState('');

  // Cargar productos del backend
  const cargarProductos = async () => {
    setLoading(true);
    try {
      const data = await obtenerProductos();
      setProductos(data);
    } catch (err) {
      setError('Error al cargar inventario: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const mostrarMensaje = (txt) => {
    setMensaje(txt);
    setTimeout(() => setMensaje(null), 3000);
  };

  // Abrir modal para crear
  const handleCrearNuevo = () => {
    setProductoEditando(null);
    setFormNombre('');
    setFormCategoria('Herramientas');
    setFormPrecio('');
    setFormPrecioAnterior('');
    setFormEnOferta(false);
    setFormDescuento(10);
    setFormStock(20);
    setFormImagen('https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80');
    setFormDescripcion('');
    setModalAbierto(true);
  };

  // Abrir modal para editar
  const handleEditar = (p) => {
    setProductoEditando(p);
    setFormNombre(p.nombre);
    setFormCategoria(p.categoria);
    setFormPrecio(p.precio);
    setFormPrecioAnterior(p.precioAnterior || '');
    setFormEnOferta(p.enOferta || false);
    setFormDescuento(p.descuento || 0);
    setFormStock(p.stock);
    setFormImagen(p.imagen || '');
    setFormDescripcion(p.descripcion || '');
    setModalAbierto(true);
  };

  // Guardar (Crear o Actualizar)
  const handleGuardarProducto = async (e) => {
    e.preventDefault();
    setError(null);

    const payload = {
      nombre: formNombre,
      categoria: formCategoria,
      precio: Number(formPrecio),
      precioAnterior: formPrecioAnterior ? Number(formPrecioAnterior) : null,
      enOferta: formEnOferta,
      descuento: formEnOferta ? Number(formDescuento) : 0,
      stock: Number(formStock),
      imagen: formImagen,
      descripcion: formDescripcion
    };

    try {
      if (productoEditando) {
        // Actualizar
        const resp = await actualizarProductoAdmin(productoEditando.id, payload);
        mostrarMensaje(`Producto "${resp.producto?.nombre || formNombre}" actualizado exitosamente.`);
      } else {
        // Crear
        const resp = await crearProductoAdmin(payload);
        mostrarMensaje(`Producto "${resp.producto?.nombre || formNombre}" creado en el catálogo.`);
      }
      setModalAbierto(false);
      await cargarProductos();
    } catch (err) {
      setError(err.message || 'Error al guardar el producto');
    }
  };

  // Ajuste rápido de stock (+ / -)
  const handleAjustarStock = async (p, delta) => {
    const nuevoStock = Math.max(0, p.stock + delta);
    try {
      await actualizarProductoAdmin(p.id, { stock: nuevoStock });
      setProductos((prev) =>
        prev.map((item) => (item.id === p.id ? { ...item, stock: nuevoStock } : item))
      );
      mostrarMensaje(`Stock de "${p.nombre}" actualizado a ${nuevoStock}`);
    } catch (err) {
      setError('Error al actualizar stock: ' + err.message);
    }
  };

  // Conmutador rápido de oferta
  const handleToggleOferta = async (p) => {
    const nuevoEnOferta = !p.enOferta;
    const nuevoDescuento = nuevoEnOferta ? (p.descuento || 10) : 0;
    const nuevoPrecioAnterior = nuevoEnOferta 
      ? (p.precioAnterior || Math.round(p.precio * 1.2)) 
      : null;

    try {
      await actualizarProductoAdmin(p.id, {
        enOferta: nuevoEnOferta,
        descuento: nuevoDescuento,
        precioAnterior: nuevoPrecioAnterior
      });
      setProductos((prev) =>
        prev.map((item) =>
          item.id === p.id
            ? { ...item, enOferta: nuevoEnOferta, descuento: nuevoDescuento, precioAnterior: nuevoPrecioAnterior }
            : item
        )
      );
      mostrarMensaje(`Oferta ${nuevoEnOferta ? 'activada' : 'desactivada'} para "${p.nombre}"`);
    } catch (err) {
      setError('Error al cambiar oferta: ' + err.message);
    }
  };

  // Eliminar producto
  const handleEliminar = async (id, nombre) => {
    if (!window.confirm(`¿Estás seguro de eliminar el producto "${nombre}" del catálogo?`)) {
      return;
    }

    try {
      await eliminarProductoAdmin(id);
      mostrarMensaje(`Producto "${nombre}" eliminado del catálogo.`);
      setProductos((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setError('Error al eliminar: ' + err.message);
    }
  };

  // Validación de seguridad para rol de Administrador
  const esAdmin = currentUser && currentUser.rol === 'admin';

  if (!esAdmin) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center', maxWidth: '600px' }}>
        <div style={{
          backgroundColor: '#07261B',
          borderRadius: '12px',
          padding: '40px 30px',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-lg)'
        }}>
          <ShieldAlert size={64} color="var(--color-accent)" style={{ margin: '0 auto 16px' }} />
          <h2 style={{ fontSize: '1.8rem', marginBottom: '12px', color: '#fff' }}>
            Acceso Restringido al Administrador
          </h2>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px', lineHeight: '1.5' }}>
            Esta vista está protegida para la gestión interna de FerreWeb. Se requieren permisos con rol <strong>admin</strong>.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={onOpenAuthModal}
            >
              Iniciar Sesión como Administrador
            </button>
            <Link to="/" className="btn btn-secondary">
              Volver a la Tienda
            </Link>
          </div>
          <div style={{ marginTop: '20px', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
            Credenciales de Administrador: <code>admin@ferreweb.com</code> / <code>admin123</code>
          </div>
        </div>
      </div>
    );
  }

  // Estadísticas del Panel
  const totalStock = productos.reduce((acc, p) => acc + (Number(p.stock) || 0), 0);
  const totalOfertas = productos.filter((p) => p.enOferta).length;

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      {/* Barra superior de navegación del admin */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: '8px' }}>
            <ArrowLeft size={16} /> Volver a la Tienda Virtual
          </Link>
          <h1 style={{ fontSize: '2rem', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            🛠️ Panel de Administración FERREWEB
          </h1>
          <p style={{ color: 'var(--color-text-muted)', margin: '4px 0 0' }}>
            Gestión en tiempo real de catálogo, ajuste de stock y definición de precios en oferta.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleCrearNuevo}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
        >
          <Plus size={18} />
          Nuevo Producto
        </button>
      </div>

      {/* Tarjetas de Estadísticas */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '30px'
      }}>
        <div style={{ background: '#07261B', padding: '20px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-text-muted)', marginBottom: '8px' }}>
            <Package size={20} color="var(--color-accent)" />
            <span style={{ fontSize: '0.88rem' }}>Total Productos</span>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#fff' }}>{productos.length}</div>
        </div>

        <div style={{ background: '#07261B', padding: '20px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-text-muted)', marginBottom: '8px' }}>
            <Tag size={20} color="var(--color-secondary)" />
            <span style={{ fontSize: '0.88rem' }}>En Oferta</span>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--color-secondary)' }}>{totalOfertas}</div>
        </div>

        <div style={{ background: '#07261B', padding: '20px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-text-muted)', marginBottom: '8px' }}>
            <TrendingUp size={20} color="var(--color-accent)" />
            <span style={{ fontSize: '0.88rem' }}>Stock Total Almacén</span>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#fff' }}>{totalStock} uds</div>
        </div>
      </div>

      {/* Alertas */}
      {mensaje && (
        <div style={{
          backgroundColor: 'rgba(34, 197, 94, 0.2)',
          border: '1px solid var(--color-secondary)',
          color: '#86EFAC',
          padding: '12px 18px',
          borderRadius: '8px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <Check size={18} />
          <span>{mensaje}</span>
        </div>
      )}

      {error && (
        <div style={{
          backgroundColor: 'rgba(239, 68, 68, 0.2)',
          border: '1px solid var(--color-danger)',
          color: '#FCA5A5',
          padding: '12px 18px',
          borderRadius: '8px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Tabla de Productos */}
      <div style={{
        background: '#07261B',
        borderRadius: '10px',
        border: '1px solid var(--color-border)',
        overflowX: 'auto',
        boxShadow: 'var(--shadow-md)'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '750px' }}>
          <thead>
            <tr style={{ background: '#021B12', borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-muted)', fontSize: '0.82rem', textTransform: 'uppercase' }}>
              <th style={{ padding: '14px 16px' }}>Producto</th>
              <th style={{ padding: '14px 16px' }}>Categoría</th>
              <th style={{ padding: '14px 16px' }}>Precio Venta</th>
              <th style={{ padding: '14px 16px' }}>Precio Oferta / Reg</th>
              <th style={{ padding: '14px 16px' }}>Ajustar Stock</th>
              <th style={{ padding: '14px 16px', textAlign: 'center' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                  Cargando productos desde el servidor backend (puerto 5000)...
                </td>
              </tr>
            ) : productos.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                  No hay productos registrados en el inventario.
                </td>
              </tr>
            ) : (
              productos.map((p) => (
                <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img
                        src={p.imagen}
                        alt={p.nombre}
                        style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px' }}
                      />
                      <div>
                        <div style={{ fontWeight: '700', fontSize: '0.92rem' }}>{p.nombre}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>ID: #{p.id}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '0.88rem' }}>
                    <span style={{
                      background: 'rgba(255,255,255,0.06)',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '0.78rem'
                    }}>
                      {p.categoria}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', fontWeight: '700', color: 'var(--color-accent)' }}>
                    {formatearPrecioCOP(p.precio)}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    {p.enOferta ? (
                      <div>
                        <span style={{
                          background: 'rgba(34, 197, 94, 0.2)',
                          color: 'var(--color-secondary)',
                          fontSize: '0.75rem',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontWeight: '700'
                        }}>
                          ⚡ OFERTA -{p.descuento || 10}%
                        </span>
                        {p.precioAnterior && (
                          <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', textDecoration: 'line-through' }}>
                            {formatearPrecioCOP(p.precioAnterior)}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>Regular</span>
                    )}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#021B12', padding: '3px 8px', borderRadius: '6px', border: '1px solid var(--color-border)' }}>
                      <button
                        type="button"
                        onClick={() => handleAjustarStock(p, -1)}
                        style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', padding: '0 4px', fontSize: '1rem' }}
                        title="Reducir stock en 1"
                      >
                        -
                      </button>
                      <span style={{ minWidth: '32px', textAlign: 'center', fontWeight: '700', fontSize: '0.88rem' }}>
                        {p.stock}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleAjustarStock(p, 1)}
                        style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', padding: '0 4px', fontSize: '1rem' }}
                        title="Aumentar stock en 1"
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <button
                        type="button"
                        onClick={() => handleToggleOferta(p)}
                        title={p.enOferta ? 'Quitar Oferta' : 'Poner en Oferta'}
                        style={{
                          background: p.enOferta ? 'rgba(34, 197, 94, 0.15)' : 'rgba(255,255,255,0.06)',
                          border: `1px solid ${p.enOferta ? 'var(--color-secondary)' : 'var(--color-border)'}`,
                          color: p.enOferta ? 'var(--color-secondary)' : 'var(--color-text-muted)',
                          padding: '6px 10px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.78rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <Tag size={14} />
                        {p.enOferta ? 'En Oferta' : 'Promocionar'}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleEditar(p)}
                        title="Editar Producto"
                        style={{
                          background: 'rgba(250, 204, 21, 0.1)',
                          border: '1px solid var(--color-accent)',
                          color: 'var(--color-accent)',
                          padding: '6px 10px',
                          borderRadius: '6px',
                          cursor: 'pointer'
                        }}
                      >
                        <Edit3 size={15} />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleEliminar(p.id, p.nombre)}
                        title="Eliminar Producto"
                        style={{
                          background: 'rgba(239, 68, 68, 0.1)',
                          border: '1px solid var(--color-danger)',
                          color: 'var(--color-danger)',
                          padding: '6px 10px',
                          borderRadius: '6px',
                          cursor: 'pointer'
                        }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de Crear / Editar Producto */}
      {modalAbierto && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(5px)',
            zIndex: 5000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setModalAbierto(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '560px',
              maxHeight: '90vh',
              overflowY: 'auto',
              backgroundColor: '#07261B',
              borderRadius: '12px',
              border: '1px solid var(--color-border)',
              padding: '24px',
              boxShadow: 'var(--shadow-lg)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '1.3rem' }}>
                {productoEditando ? '✏️ Editar Producto' : '✨ Nuevo Producto u Oferta'}
              </h3>
              <button
                type="button"
                onClick={() => setModalAbierto(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleGuardarProducto}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '6px', color: 'var(--color-text-muted)' }}>
                  Nombre del Producto *
                </label>
                <input
                  type="text"
                  required
                  value={formNombre}
                  onChange={(e) => setFormNombre(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '6px',
                    backgroundColor: '#021B12',
                    border: '1px solid var(--color-border)',
                    color: '#fff'
                  }}
                  placeholder="ej: Taladro Percutor 20V"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '6px', color: 'var(--color-text-muted)' }}>
                    Categoría
                  </label>
                  <select
                    value={formCategoria}
                    onChange={(e) => setFormCategoria(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '6px',
                      backgroundColor: '#021B12',
                      border: '1px solid var(--color-border)',
                      color: '#fff'
                    }}
                  >
                    {categorias.filter(c => c.id !== 'todas').map((c) => (
                      <option key={c.id} value={c.id}>{c.nombre}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '6px', color: 'var(--color-text-muted)' }}>
                    Stock Disponible *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formStock}
                    onChange={(e) => setFormStock(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '6px',
                      backgroundColor: '#021B12',
                      border: '1px solid var(--color-border)',
                      color: '#fff'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '6px', color: 'var(--color-text-muted)' }}>
                    Precio de Venta (COP) *
                  </label>
                  <input
                    type="number"
                    min="100"
                    required
                    value={formPrecio}
                    onChange={(e) => setFormPrecio(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '6px',
                      backgroundColor: '#021B12',
                      border: '1px solid var(--color-border)',
                      color: '#fff'
                    }}
                    placeholder="450000"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '6px', color: 'var(--color-text-muted)' }}>
                    Precio Anterior (Tachado)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formPrecioAnterior}
                    onChange={(e) => setFormPrecioAnterior(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '6px',
                      backgroundColor: '#021B12',
                      border: '1px solid var(--color-border)',
                      color: '#fff'
                    }}
                    placeholder="Opcional"
                  />
                </div>
              </div>

              {/* Configuración de Oferta */}
              <div style={{
                background: 'rgba(250, 204, 21, 0.06)',
                padding: '12px 14px',
                borderRadius: '8px',
                border: '1px solid rgba(250, 204, 21, 0.2)',
                marginBottom: '14px'
              }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: '600' }}>
                  <input
                    type="checkbox"
                    checked={formEnOferta}
                    onChange={(e) => setFormEnOferta(e.target.checked)}
                    style={{ width: '18px', height: '18px' }}
                  />
                  <span>¿Activar precio en Oferta para este producto?</span>
                </label>

                {formEnOferta && (
                  <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>Porcentaje de descuento:</span>
                    <input
                      type="number"
                      min="1"
                      max="90"
                      value={formDescuento}
                      onChange={(e) => setFormDescuento(e.target.value)}
                      style={{
                        width: '80px',
                        padding: '6px 10px',
                        borderRadius: '6px',
                        backgroundColor: '#021B12',
                        border: '1px solid var(--color-border)',
                        color: '#fff'
                      }}
                    />
                    <span style={{ fontWeight: '700', color: 'var(--color-secondary)' }}>% OFF</span>
                  </div>
                )}
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '6px', color: 'var(--color-text-muted)' }}>
                  URL de la Imagen
                </label>
                <input
                  type="url"
                  value={formImagen}
                  onChange={(e) => setFormImagen(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '6px',
                    backgroundColor: '#021B12',
                    border: '1px solid var(--color-border)',
                    color: '#fff'
                  }}
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '6px', color: 'var(--color-text-muted)' }}>
                  Descripción Técnica
                </label>
                <textarea
                  rows="3"
                  value={formDescripcion}
                  onChange={(e) => setFormDescripcion(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '6px',
                    backgroundColor: '#021B12',
                    border: '1px solid var(--color-border)',
                    color: '#fff',
                    resize: 'vertical'
                  }}
                  placeholder="Especificaciones, características y normas técnicas..."
                ></textarea>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setModalAbierto(false)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <Save size={16} />
                  Guardar Producto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
