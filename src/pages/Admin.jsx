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
  ArrowLeft,
  LayoutDashboard,
  Boxes,
  AlertTriangle,
  Truck,
  Building2,
  FileText,
  RefreshCw,
  DollarSign,
  Clock,
  Phone,
  Mail,
  MapPin,
  CheckCircle2
} from 'lucide-react';
import { 
  obtenerProductos, 
  crearProductoAdmin, 
  actualizarProductoAdmin, 
  eliminarProductoAdmin,
  obtenerMetricasDashboard,
  obtenerAlertasStock,
  reabastecerProducto,
  obtenerTodosPedidosAdmin,
  actualizarEstadoPedido,
  obtenerProveedores,
  crearProveedor,
  eliminarProveedor,
  obtenerCotizacionesAdmin,
  actualizarEstadoCotizacion
} from '../services/api';
import { formatearPrecioCOP, categorias } from '../data/productos';

/**
 * Consola de Administración Profesional (/admin)
 * Estructurada en 6 pestañas industriales:
 * 1. Dashboard (KPIs ejecutivos)
 * 2. Inventario (Catálogo y CRUD)
 * 3. Alertas de Stock (Existencias <= 5 y reabastecimiento en lote)
 * 4. Pedidos / Logística (OMS y cambio interactivo de estado)
 * 5. Proveedores (SCM y distribuidores aliados)
 * 6. Cotizaciones B2B (Constructores e instaladores)
 * Evidencia: SENA GA7-220501096-AA5-EV03
 */
export default function Admin({ currentUser, onOpenAuthModal }) {
  // Pestaña activa
  const [activeTab, setActiveTab] = useState('dashboard');

  // Estados de datos
  const [productos, setProductos] = useState([]);
  const [metricas, setMetricas] = useState(null);
  const [alertasStock, setAlertasStock] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [cotizaciones, setCotizaciones] = useState([]);

  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState(null);
  const [error, setError] = useState(null);

  // Modal de Producto (Crear / Editar)
  const [modalProductoAbierto, setModalProductoAbierto] = useState(false);
  const [productoEditando, setProductoEditando] = useState(null);
  const [formNombre, setFormNombre] = useState('');
  const [formCategoria, setFormCategoria] = useState('Herramientas');
  const [formPrecio, setFormPrecio] = useState('');
  const [formPrecioAnterior, setFormPrecioAnterior] = useState('');
  const [formEnOferta, setFormEnOferta] = useState(false);
  const [formDescuento, setFormDescuento] = useState(10);
  const [formStock, setFormStock] = useState(15);
  const [formImagen, setFormImagen] = useState('');
  const [formDescripcion, setFormDescripcion] = useState('');

  // Modal de Proveedor
  const [modalProveedorAbierto, setModalProveedorAbierto] = useState(false);
  const [provNombre, setProvNombre] = useState('');
  const [provCategoria, setProvCategoria] = useState('Herramientas Profesionales');
  const [provContacto, setProvContacto] = useState('');
  const [provEmail, setProvEmail] = useState('');
  const [provTelefono, setProvTelefono] = useState('');
  const [provCiudad, setProvCiudad] = useState('Bogotá D.C.');

  const mostrarMensaje = (txt) => {
    setMensaje(txt);
    setTimeout(() => setMensaje(null), 3500);
  };

  // Cargar todos los subsistemas del backend
  const cargarDatos = async () => {
    setLoading(true);
    setError(null);
    try {
      const [prodsData, metricasData, alertasData, pedidosData, provsData, cotsData] = await Promise.all([
        obtenerProductos(),
        obtenerMetricasDashboard(),
        obtenerAlertasStock(5),
        obtenerTodosPedidosAdmin(),
        obtenerProveedores(),
        obtenerCotizacionesAdmin()
      ]);

      setProductos(prodsData);
      setMetricas(metricasData);
      setAlertasStock(alertasData);
      setPedidos(pedidosData);
      setProveedores(provsData);
      setCotizaciones(cotsData);
    } catch (err) {
      setError('Error al conectar con los servicios administrativos: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // --- CRUD PRODUCTOS ---
  const handleCrearNuevoProducto = () => {
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
    setModalProductoAbierto(true);
  };

  const handleEditarProducto = (p) => {
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
    setModalProductoAbierto(true);
  };

  const handleGuardarProducto = async (e) => {
    e.preventDefault();
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
        await actualizarProductoAdmin(productoEditando.id, payload);
        mostrarMensaje(`Producto "${formNombre}" actualizado exitosamente.`);
      } else {
        await crearProductoAdmin(payload);
        mostrarMensaje(`Producto "${formNombre}" registrado en el catálogo.`);
      }
      setModalProductoAbierto(false);
      await cargarDatos();
    } catch (err) {
      setError(err.message || 'Error al guardar el producto');
    }
  };

  const handleEliminarProducto = async (id, nombre) => {
    if (!window.confirm(`¿Estás seguro de eliminar el producto "${nombre}" del catálogo?`)) return;
    try {
      await eliminarProductoAdmin(id);
      mostrarMensaje(`Producto "${nombre}" eliminado.`);
      await cargarDatos();
    } catch (err) {
      setError('Error al eliminar: ' + err.message);
    }
  };

  // --- REABASTECIMIENTO DE STOCK ---
  const handleReabastecer = async (id, cantidad, nombre) => {
    try {
      await reabastecerProducto(id, cantidad);
      mostrarMensaje(`+${cantidad} unidades agregadas al stock de "${nombre}".`);
      await cargarDatos();
    } catch (err) {
      setError('Error al reabastecer: ' + err.message);
    }
  };

  // --- CAMBIO DE ESTADO DE PEDIDOS ---
  const handleCambiarEstadoPedido = async (referencia, nuevoEstado) => {
    try {
      await actualizarEstadoPedido(referencia, nuevoEstado);
      mostrarMensaje(`Pedido ${referencia} actualizado a: ${nuevoEstado}`);
      setPedidos((prev) =>
        prev.map((o) => (o.referencia === referencia ? { ...o, estado: nuevoEstado } : o))
      );
    } catch (err) {
      setError('Error actualizando pedido: ' + err.message);
    }
  };

  // --- PROVEEDORES SCM ---
  const handleGuardarProveedor = async (e) => {
    e.preventDefault();
    try {
      await crearProveedor({
        nombre: provNombre,
        categoria: provCategoria,
        contacto: provContacto,
        email: provEmail,
        telefono: provTelefono,
        ciudad: provCiudad
      });
      mostrarMensaje(`Proveedor "${provNombre}" registrado en la cadena de suministro.`);
      setModalProveedorAbierto(false);
      setProvNombre('');
      setProvContacto('');
      setProvEmail('');
      setProvTelefono('');
      await cargarDatos();
    } catch (err) {
      setError('Error al registrar proveedor: ' + err.message);
    }
  };

  const handleEliminarProveedor = async (id, nombre) => {
    if (!window.confirm(`¿Retirar al proveedor "${nombre}" de la red de distribución?`)) return;
    try {
      await eliminarProveedor(id);
      mostrarMensaje(`Proveedor "${nombre}" retirado.`);
      await cargarDatos();
    } catch (err) {
      setError('Error al retirar proveedor: ' + err.message);
    }
  };

  // --- COTIZACIONES B2B ---
  const handleMarcarCotizacionContactado = async (id, codigo) => {
    try {
      await actualizarEstadoCotizacion(id, 'contactado');
      mostrarMensaje(`Cotización ${codigo} marcada como contactada.`);
      setCotizaciones((prev) =>
        prev.map((c) => (c.id === id ? { ...c, estado: 'contactado' } : c))
      );
    } catch (err) {
      setError('Error al actualizar cotización: ' + err.message);
    }
  };

  // Validación de seguridad para rol Administrador
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
            Consola Protegida de Administración
          </h2>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px', lineHeight: '1.5' }}>
            Esta sección requiere credenciales con rol <strong>admin</strong> para auditar servicios web, inventario y pasarelas de pago.
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
          <div style={{ marginTop: '20px', fontSize: '0.82rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
            Credenciales de Administrador: <code>admin@ferreweb.com</code> / <code>admin123</code>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      {/* Encabezado Superior */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: '6px' }}>
            <ArrowLeft size={16} /> Volver a la Tienda Virtual
          </Link>
          <h1 style={{ fontSize: '1.9rem', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            🛠️ Consola de Administración FERREWEB
          </h1>
          <p style={{ color: 'var(--color-text-muted)', margin: '4px 0 0', fontSize: '0.9rem' }}>
            Arquitectura de Servicios Web RESTful &middot; Evidencia SENA GA7-220501096-AA5-EV03
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={cargarDatos}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            title="Refrescar datos del servidor"
          >
            <RefreshCw size={16} /> Refrescar
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleCrearNuevoProducto}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <Plus size={18} /> Nuevo Producto
          </button>
        </div>
      </div>

      {/* Alertas y Notificaciones */}
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

      {/* Barra de Pestañas Industriales */}
      <div className="industrial-tabs" role="tablist">
        <button
          type="button"
          className={`industrial-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <LayoutDashboard size={18} /> Dashboard (KPIs)
        </button>
        <button
          type="button"
          className={`industrial-tab ${activeTab === 'inventario' ? 'active' : ''}`}
          onClick={() => setActiveTab('inventario')}
        >
          <Boxes size={18} /> Inventario ({productos.length})
        </button>
        <button
          type="button"
          className={`industrial-tab ${activeTab === 'alertas' ? 'active' : ''}`}
          onClick={() => setActiveTab('alertas')}
        >
          <AlertTriangle size={18} color={alertasStock.length > 0 ? 'var(--color-danger)' : 'inherit'} />
          Alertas de Stock
          {alertasStock.length > 0 && (
            <span style={{ background: 'var(--color-danger)', color: '#fff', fontSize: '0.72rem', padding: '1px 6px', borderRadius: '10px' }}>
              {alertasStock.length}
            </span>
          )}
        </button>
        <button
          type="button"
          className={`industrial-tab ${activeTab === 'pedidos' ? 'active' : ''}`}
          onClick={() => setActiveTab('pedidos')}
        >
          <Truck size={18} /> Pedidos & Logística ({pedidos.length})
        </button>
        <button
          type="button"
          className={`industrial-tab ${activeTab === 'proveedores' ? 'active' : ''}`}
          onClick={() => setActiveTab('proveedores')}
        >
          <Building2 size={18} /> Proveedores SCM ({proveedores.length})
        </button>
        <button
          type="button"
          className={`industrial-tab ${activeTab === 'cotizaciones' ? 'active' : ''}`}
          onClick={() => setActiveTab('cotizaciones')}
        >
          <FileText size={18} /> Cotizaciones B2B ({cotizaciones.length})
        </button>
      </div>

      {/* ====================================================================
          PESTAÑA 1: DASHBOARD (KPIS)
          ==================================================================== */}
      {activeTab === 'dashboard' && (
        <div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
            marginBottom: '28px'
          }}>
            <div style={{ background: '#07261B', padding: '20px', borderRadius: '10px', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-md)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-text-muted)', marginBottom: '8px' }}>
                <DollarSign size={20} color="var(--color-secondary)" />
                <span style={{ fontSize: '0.85rem' }}>Ventas Acumuladas</span>
              </div>
              <div style={{ fontSize: '1.7rem', fontWeight: '800', color: 'var(--color-secondary)', fontFamily: 'var(--font-mono)' }}>
                {formatearPrecioCOP(metricas?.ventasTotalesCOP || 0)}
              </div>
            </div>

            <div style={{ background: '#07261B', padding: '20px', borderRadius: '10px', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-md)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-text-muted)', marginBottom: '8px' }}>
                <Truck size={20} color="var(--color-accent)" />
                <span style={{ fontSize: '0.85rem' }}>Pedidos Activos (OMS)</span>
              </div>
              <div style={{ fontSize: '1.7rem', fontWeight: '800', color: '#fff' }}>
                {metricas?.pedidosActivos || 0} órdenes
              </div>
            </div>

            <div style={{ background: '#07261B', padding: '20px', borderRadius: '10px', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-md)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-text-muted)', marginBottom: '8px' }}>
                <TrendingUp size={20} color="var(--color-accent)" />
                <span style={{ fontSize: '0.85rem' }}>Unidades en Almacén</span>
              </div>
              <div style={{ fontSize: '1.7rem', fontWeight: '800', color: '#fff' }}>
                {metricas?.totalUnidadesInventario || 0} uds
              </div>
            </div>

            <div style={{ background: '#07261B', padding: '20px', borderRadius: '10px', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-md)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-text-muted)', marginBottom: '8px' }}>
                <Package size={20} color="var(--color-secondary)" />
                <span style={{ fontSize: '0.85rem' }}>Valorización Inventario</span>
              </div>
              <div style={{ fontSize: '1.7rem', fontWeight: '800', color: '#fff', fontFamily: 'var(--font-mono)' }}>
                {formatearPrecioCOP(metricas?.valorizacionInventarioCOP || 0)}
              </div>
            </div>
          </div>

          {/* Resumen de Estado del Sistema */}
          <div style={{ background: '#07261B', padding: '24px', borderRadius: '10px', border: '1px solid var(--color-border)' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Estado Operativo de Servicios Web REST</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div style={{ padding: '14px', background: '#021B12', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Pasarela de Pagos</span>
                <div style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--color-secondary)', marginTop: '4px' }}>
                  Wompi Sandbox (Integridad SHA-256)
                </div>
              </div>
              <div style={{ padding: '14px', background: '#021B12', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Ítems en Stock Crítico</span>
                <div style={{ fontSize: '1.05rem', fontWeight: '700', color: metricas?.itemsCriticos > 0 ? 'var(--color-danger)' : 'var(--color-secondary)', marginTop: '4px' }}>
                  {metricas?.itemsCriticos || 0} productos
                </div>
              </div>
              <div style={{ padding: '14px', background: '#021B12', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Cotizaciones Pendientes</span>
                <div style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--color-accent)', marginTop: '4px' }}>
                  {metricas?.cotizacionesPendientes || 0} solicitudes
                </div>
              </div>
              <div style={{ padding: '14px', background: '#021B12', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Proveedores Activos</span>
                <div style={{ fontSize: '1.05rem', fontWeight: '700', color: '#fff', marginTop: '4px' }}>
                  {metricas?.totalProveedores || 0} marcas aliadas
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          PESTAÑA 2: INVENTARIO (CATÁLOGO CRUD)
          ==================================================================== */}
      {activeTab === 'inventario' && (
        <div style={{
          background: '#07261B',
          borderRadius: '10px',
          border: '1px solid var(--color-border)',
          overflowX: 'auto',
          boxShadow: 'var(--shadow-md)'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '750px' }}>
            <thead>
              <tr style={{ background: '#021B12', borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '14px 16px' }}>Producto</th>
                <th style={{ padding: '14px 16px' }}>Categoría</th>
                <th style={{ padding: '14px 16px' }}>Precio Venta (COP)</th>
                <th style={{ padding: '14px 16px' }}>Stock</th>
                <th style={{ padding: '14px 16px' }}>Estado</th>
                <th style={{ padding: '14px 16px', textAlign: 'center' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((p) => (
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
                        <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>SKU: FW-{String(p.id).padStart(4, '0')}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '0.85rem' }}>
                    <span style={{ background: 'rgba(255,255,255,0.06)', padding: '3px 8px', borderRadius: '4px' }}>
                      {p.categoria}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', fontWeight: '700', color: 'var(--color-accent)', fontFamily: 'var(--font-mono)' }}>
                    {formatearPrecioCOP(p.precio)}
                  </td>
                  <td style={{ padding: '14px 16px', fontWeight: '700' }}>
                    {p.stock} uds
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    {p.stock === 0 ? (
                      <span style={{ background: 'rgba(239, 68, 68, 0.2)', color: 'var(--color-danger)', fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px', fontWeight: '700' }}>
                        AGOTADO
                      </span>
                    ) : p.stock <= 5 ? (
                      <span style={{ background: 'rgba(245, 158, 11, 0.2)', color: 'var(--color-warning)', fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px', fontWeight: '700' }}>
                        CRÍTICO ({p.stock})
                      </span>
                    ) : (
                      <span style={{ background: 'rgba(34, 197, 94, 0.15)', color: 'var(--color-secondary)', fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px', fontWeight: '700' }}>
                        NORMAL
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <button
                        type="button"
                        onClick={() => handleEditarProducto(p)}
                        title="Editar Producto"
                        style={{
                          background: 'rgba(250, 204, 21, 0.1)',
                          border: '1px solid var(--color-accent)',
                          color: 'var(--color-accent)',
                          padding: '6px 10px',
                          borderRadius: '6px'
                        }}
                      >
                        <Edit3 size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleEliminarProducto(p.id, p.nombre)}
                        title="Eliminar Producto"
                        style={{
                          background: 'rgba(239, 68, 68, 0.1)',
                          border: '1px solid var(--color-danger)',
                          color: 'var(--color-danger)',
                          padding: '6px 10px',
                          borderRadius: '6px'
                        }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ====================================================================
          PESTAÑA 3: ALERTAS DE STOCK (<= 5)
          ==================================================================== */}
      {activeTab === 'alertas' && (
        <div style={{ background: '#07261B', borderRadius: '10px', border: '1px solid var(--color-border)', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '1.3rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-accent)' }}>
                <AlertTriangle size={22} color="var(--color-accent)" />
                Monitor de Existencias Críticas (Stock &le; 5)
              </h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', margin: '4px 0 0' }}>
                Reabastece directamente la bodega en lotes de 10, 20 o 50 unidades consumiendo <code>PATCH /api/admin/productos/:id/reabastecer</code>.
              </p>
            </div>
          </div>

          {alertasStock.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-secondary)' }}>
              <CheckCircle2 size={40} style={{ margin: '0 auto 10px' }} />
              <h4>Inventario Saludable</h4>
              <p style={{ color: 'var(--color-text-muted)' }}>No hay productos en nivel crítico de inventario en este momento.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {alertasStock.map((prod) => (
                <div
                  key={prod.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px',
                    background: '#021B12',
                    borderRadius: '8px',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    flexWrap: 'wrap',
                    gap: '12px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <img
                      src={prod.imagen}
                      alt={prod.nombre}
                      style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '6px' }}
                    />
                    <div>
                      <h4 style={{ margin: '0 0 4px', fontSize: '0.95rem' }}>{prod.nombre}</h4>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                        Categoría: <strong>{prod.categoria}</strong> &middot; Precio: <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-accent)' }}>{formatearPrecioCOP(prod.precio)}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>Existencias:</div>
                      <span style={{
                        fontSize: '1.1rem',
                        fontWeight: '800',
                        color: prod.stockActual === 0 ? 'var(--color-danger)' : 'var(--color-warning)'
                      }}>
                        {prod.stockActual} unidades
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        style={{ padding: '6px 12px', fontSize: '0.82rem' }}
                        onClick={() => handleReabastecer(prod.id, 10, prod.nombre)}
                      >
                        +10 Uds
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        style={{ padding: '6px 12px', fontSize: '0.82rem' }}
                        onClick={() => handleReabastecer(prod.id, 20, prod.nombre)}
                      >
                        +20 Uds
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary"
                        style={{ padding: '6px 12px', fontSize: '0.82rem' }}
                        onClick={() => handleReabastecer(prod.id, 50, prod.nombre)}
                      >
                        +50 Uds
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ====================================================================
          PESTAÑA 4: PEDIDOS / LOGÍSTICA (OMS)
          ==================================================================== */}
      {activeTab === 'pedidos' && (
        <div style={{
          background: '#07261B',
          borderRadius: '10px',
          border: '1px solid var(--color-border)',
          overflowX: 'auto',
          boxShadow: 'var(--shadow-md)'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '780px' }}>
            <thead>
              <tr style={{ background: '#021B12', borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '14px 16px' }}>Referencia</th>
                <th style={{ padding: '14px 16px' }}>Cliente</th>
                <th style={{ padding: '14px 16px' }}>Total COP</th>
                <th style={{ padding: '14px 16px' }}>Medio de Pago</th>
                <th style={{ padding: '14px 16px' }}>Estado Logístico</th>
                <th style={{ padding: '14px 16px' }}>Destino</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: '30px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                    No hay pedidos registrados en el sistema.
                  </td>
                </tr>
              ) : (
                pedidos.map((o) => (
                  <tr key={o.referencia} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--color-accent)' }}>
                      {o.referencia}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '0.88rem' }}>
                      <div style={{ fontWeight: '600' }}>{o.cliente?.nombre || 'Cliente'}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>{o.cliente?.email || 'N/A'}</div>
                    </td>
                    <td style={{ padding: '14px 16px', fontWeight: '700', fontFamily: 'var(--font-mono)', color: 'var(--color-secondary)' }}>
                      {formatearPrecioCOP(o.total)}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '0.82rem' }}>
                      {o.metodoPago || 'Wompi'}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <select
                        value={o.estado}
                        onChange={(e) => handleCambiarEstadoPedido(o.referencia, e.target.value)}
                        style={{
                          padding: '6px 10px',
                          borderRadius: '6px',
                          backgroundColor: '#021B12',
                          border: '1px solid var(--color-border)',
                          color: o.estado === 'entregado' ? 'var(--color-secondary)' : (o.estado === 'en_preparacion' ? 'var(--color-accent)' : '#fff'),
                          fontSize: '0.82rem',
                          fontWeight: '600'
                        }}
                      >
                        <option value="pendiente_pago">Pendiente Pago</option>
                        <option value="en_preparacion">En Preparación</option>
                        <option value="despachado">Despachado</option>
                        <option value="entregado">Entregado</option>
                        <option value="cancelado">Cancelado</option>
                      </select>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                      {o.direccionEnvio?.ciudad || 'Colombia'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ====================================================================
          PESTAÑA 5: PROVEEDORES (SCM)
          ==================================================================== */}
      {activeTab === 'proveedores' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Directorio de Marcas y Distribuidores Aliados</h3>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setModalProveedorAbierto(true)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <Plus size={16} /> Registrar Proveedor
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {proveedores.map((prov) => (
              <div
                key={prov.id}
                style={{
                  background: '#07261B',
                  borderRadius: '10px',
                  border: '1px solid var(--color-border)',
                  padding: '20px',
                  position: 'relative'
                }}
              >
                <button
                  type="button"
                  onClick={() => handleEliminarProveedor(prov.id, prov.nombre)}
                  style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    color: 'var(--color-danger)',
                    padding: '4px'
                  }}
                  title="Retirar distribuidor"
                >
                  <Trash2 size={16} />
                </button>

                <span style={{ fontSize: '0.75rem', background: 'rgba(185, 231, 105, 0.1)', color: 'var(--color-secondary)', padding: '3px 8px', borderRadius: '4px', fontWeight: '700' }}>
                  {prov.categoria}
                </span>

                <h4 style={{ fontSize: '1.1rem', margin: '10px 0 6px' }}>{prov.nombre}</h4>

                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'flex', flexDirection: 'column', gap: '6px', margin: '12px 0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Building2 size={14} color="var(--color-accent)" /> Contacto: {prov.contacto || 'Comercial'}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Mail size={14} color="var(--color-accent)" /> {prov.email}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Phone size={14} color="var(--color-accent)" /> {prov.telefono}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={14} color="var(--color-accent)" /> {prov.ciudad || 'Colombia'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ====================================================================
          PESTAÑA 6: COTIZACIONES B2B
          ==================================================================== */}
      {activeTab === 'cotizaciones' && (
        <div style={{
          background: '#07261B',
          borderRadius: '10px',
          border: '1px solid var(--color-border)',
          overflowX: 'auto',
          boxShadow: 'var(--shadow-md)'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '780px' }}>
            <thead>
              <tr style={{ background: '#021B12', borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '14px 16px' }}>Código</th>
                <th style={{ padding: '14px 16px' }}>Empresa / NIT</th>
                <th style={{ padding: '14px 16px' }}>Contacto</th>
                <th style={{ padding: '14px 16px' }}>Materiales Solicitados</th>
                <th style={{ padding: '14px 16px' }}>Estado</th>
                <th style={{ padding: '14px 16px', textAlign: 'center' }}>Acción</th>
              </tr>
            </thead>
            <tbody>
              {cotizaciones.map((cot) => (
                <tr key={cot.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)', color: 'var(--color-accent)', fontWeight: '700' }}>
                    {cot.codigo}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontWeight: '700' }}>{cot.empresa}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>NIT: {cot.nit}</div>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '0.85rem' }}>
                    <div>{cot.cliente}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>{cot.telefono} &middot; {cot.email}</div>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '0.85rem', maxWidth: '280px' }}>
                    {cot.items}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      background: cot.estado === 'contactado' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(250, 204, 21, 0.15)',
                      color: cot.estado === 'contactado' ? 'var(--color-secondary)' : 'var(--color-accent)',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '0.78rem',
                      fontWeight: '700'
                    }}>
                      {cot.estado ? cot.estado.toUpperCase() : 'PENDIENTE'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                    {cot.estado !== 'contactado' && (
                      <button
                        type="button"
                        className="btn btn-secondary"
                        style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                        onClick={() => handleMarcarCotizacionContactado(cot.id, cot.codigo)}
                      >
                        Marcar Contactado
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ====================================================================
          MODAL DE CREAR / EDITAR PRODUCTO
          ==================================================================== */}
      {modalProductoAbierto && (
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
          onClick={() => setModalProductoAbierto(false)}
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
                onClick={() => setModalProductoAbierto(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--color-text-muted)' }}
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
                    Stock Inicial *
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
                    Precio Anterior
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

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '6px', color: 'var(--color-text-muted)' }}>
                  URL de Imagen
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
                  placeholder="https://..."
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
                    color: '#fff'
                  }}
                ></textarea>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setModalProductoAbierto(false)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <Save size={16} /> Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL DE CREAR PROVEEDOR
          ==================================================================== */}
      {modalProveedorAbierto && (
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
          onClick={() => setModalProveedorAbierto(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '500px',
              backgroundColor: '#07261B',
              borderRadius: '12px',
              border: '1px solid var(--color-border)',
              padding: '24px',
              boxShadow: 'var(--shadow-lg)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem' }}>🏭 Nuevo Proveedor Aliado</h3>
              <button
                type="button"
                onClick={() => setModalProveedorAbierto(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--color-text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleGuardarProveedor}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', marginBottom: '4px', color: 'var(--color-text-muted)' }}>
                  Razón Social / Empresa *
                </label>
                <input
                  type="text"
                  required
                  value={provNombre}
                  onChange={(e) => setProvNombre(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    backgroundColor: '#021B12',
                    border: '1px solid var(--color-border)',
                    color: '#fff'
                  }}
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', marginBottom: '4px', color: 'var(--color-text-muted)' }}>
                  Categoría de Suministro
                </label>
                <input
                  type="text"
                  value={provCategoria}
                  onChange={(e) => setProvCategoria(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    backgroundColor: '#021B12',
                    border: '1px solid var(--color-border)',
                    color: '#fff'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', marginBottom: '4px', color: 'var(--color-text-muted)' }}>
                    Contacto Comercial
                  </label>
                  <input
                    type="text"
                    value={provContacto}
                    onChange={(e) => setProvContacto(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      backgroundColor: '#021B12',
                      border: '1px solid var(--color-border)',
                      color: '#fff'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', marginBottom: '4px', color: 'var(--color-text-muted)' }}>
                    Ciudad
                  </label>
                  <input
                    type="text"
                    value={provCiudad}
                    onChange={(e) => setProvCiudad(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      backgroundColor: '#021B12',
                      border: '1px solid var(--color-border)',
                      color: '#fff'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '18px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', marginBottom: '4px', color: 'var(--color-text-muted)' }}>
                    Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    required
                    value={provEmail}
                    onChange={(e) => setProvEmail(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      backgroundColor: '#021B12',
                      border: '1px solid var(--color-border)',
                      color: '#fff'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', marginBottom: '4px', color: 'var(--color-text-muted)' }}>
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    required
                    value={provTelefono}
                    onChange={(e) => setProvTelefono(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      backgroundColor: '#021B12',
                      border: '1px solid var(--color-border)',
                      color: '#fff'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setModalProveedorAbierto(false)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-secondary"
                >
                  Registrar Proveedor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
