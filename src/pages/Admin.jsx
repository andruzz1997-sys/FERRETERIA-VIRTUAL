import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldAlert, 
  Plus, 
  Edit3, 
  Trash2, 
  Package, 
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
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  Download,
  Search,
  Printer,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Clock,
  History,
  Send,
  Navigation
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
  actualizarDespachoPedido,
  obtenerMovimientosKardex,
  obtenerProveedores,
  crearProveedor,
  eliminarProveedor,
  obtenerCotizacionesAdmin,
  actualizarEstadoCotizacion
} from '../services/api';
import { formatearPrecioCOP, categorias } from '../data/productos';

/**
 * Consola de Administración Profesional (/admin) - FERREWEB ERP
 * Estructurada en 6 pestañas industriales:
 * 1. Dashboard (KPIs ejecutivos y estado de servicios)
 * 2. Inventario (Catálogo, filtros, paginación, CSV y CRUD seguro)
 * 3. Alertas de Stock (Existencias <= 5, reabastecimiento en lote y Kardex de Bodega)
 * 4. Pedidos / Logística (OMS, asignación de guías, transportadoras y remisión imprimible)
 * 5. Proveedores (SCM y distribuidores aliados)
 * 6. Cotizaciones B2B (Constructores, WhatsApp y contacto directo)
 * Evidencia: SENA GA7-220501096-AA5-EV03
 */
export default function Admin({ currentUser, onOpenAuthModal }) {
  // Pestaña activa persistente en localStorage
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('ferreweb_admin_tab') || 'dashboard';
  });

  const cambiarPestana = (tab) => {
    setActiveTab(tab);
    localStorage.setItem('ferreweb_admin_tab', tab);
  };

  // Estados de datos
  const [productos, setProductos] = useState([]);
  const [metricas, setMetricas] = useState(null);
  const [alertasStock, setAlertasStock] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [cotizaciones, setCotizaciones] = useState([]);
  const [kardex, setKardex] = useState([]);

  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState(null);
  const [error, setError] = useState(null);

  // Filtros y paginación para Inventario
  const [searchInventario, setSearchInventario] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('todas');
  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 10;

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

  // Modal Confirmación de Eliminación de Producto
  const [productoAEliminar, setProductoAEliminar] = useState(null);

  // Modal de Reabastecimiento Personalizado
  const [productoReabastecer, setProductoReabastecer] = useState(null);
  const [cantidadReabastecer, setCantidadReabastecer] = useState(20);
  const [motivoReabastecer, setMotivoReabastecer] = useState('Factura de compra de proveedor');

  // Modal de Despacho Logístico
  const [pedidoDespacho, setPedidoDespacho] = useState(null);
  const [transportadoraSel, setTransportadoraSel] = useState('Coordinadora');
  const [numeroGuiaInput, setNumeroGuiaInput] = useState('');
  const [notasDespachoInput, setNotasDespachoInput] = useState('');

  // Modal de Remisión Imprimible de Bodega
  const [pedidoRemision, setPedidoRemision] = useState(null);

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
    setTimeout(() => setMensaje(null), 3800);
  };

  // Cargar todos los subsistemas del backend
  const cargarDatos = async () => {
    setLoading(true);
    setError(null);
    try {
      const [prodsData, metricasData, alertasData, pedidosData, provsData, cotsData, kardexData] = await Promise.all([
        obtenerProductos(),
        obtenerMetricasDashboard(),
        obtenerAlertasStock(5),
        obtenerTodosPedidosAdmin(),
        obtenerProveedores(),
        obtenerCotizacionesAdmin(),
        obtenerMovimientosKardex()
      ]);

      setProductos(prodsData);
      setMetricas(metricasData);
      setAlertasStock(alertasData);
      setPedidos(pedidosData);
      setProveedores(provsData);
      setCotizaciones(cotsData);
      setKardex(kardexData.movimientos || []);
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

  const handleEliminarProductoConfirmado = async () => {
    if (!productoAEliminar) return;
    try {
      await eliminarProductoAdmin(productoAEliminar.id);
      mostrarMensaje(`Producto "${productoAEliminar.nombre}" eliminado del catálogo.`);
      setProductoAEliminar(null);
      await cargarDatos();
    } catch (err) {
      setError('Error al eliminar: ' + err.message);
    }
  };

  // --- FILTRADO Y PAGINACIÓN DE INVENTARIO ---
  const productosFiltrados = useMemo(() => {
    return productos.filter((p) => {
      const cumpleCategoria = filtroCategoria === 'todas' || p.categoria === filtroCategoria;
      const term = searchInventario.toLowerCase().trim();
      const sku = `fw-${String(p.id).padStart(4, '0')}`.toLowerCase();
      const cumpleBusqueda = !term || p.nombre.toLowerCase().includes(term) || sku.includes(term);
      return cumpleCategoria && cumpleBusqueda;
    });
  }, [productos, filtroCategoria, searchInventario]);

  const totalPaginas = Math.max(1, Math.ceil(productosFiltrados.length / itemsPorPagina));
  const productosPaginados = useMemo(() => {
    const inicio = (paginaActual - 1) * itemsPorPagina;
    return productosFiltrados.slice(inicio, inicio + itemsPorPagina);
  }, [productosFiltrados, paginaActual]);

  useEffect(() => {
    setPaginaActual(1);
  }, [searchInventario, filtroCategoria]);

  // --- EXPORTACIÓN CSV DE INVENTARIO ---
  const exportarInventarioCSV = () => {
    try {
      const headers = ['SKU', 'Nombre', 'Categoria', 'Precio_COP', 'Stock_Actual', 'Estado'];
      const rows = productosFiltrados.map((p) => [
        `FW-${String(p.id).padStart(4, '0')}`,
        `"${p.nombre.replace(/"/g, '""')}"`,
        `"${p.categoria}"`,
        p.precio,
        p.stock,
        p.stock === 0 ? 'AGOTADO' : p.stock <= 5 ? 'CRITICO' : 'NORMAL'
      ]);

      const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const fecha = new Date().toISOString().slice(0, 10);
      link.setAttribute('href', url);
      link.setAttribute('download', `inventario_ferreweb_${fecha}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      mostrarMensaje(`Exportados ${productosFiltrados.length} productos a CSV.`);
    } catch (err) {
      setError('Error al exportar inventario: ' + err.message);
    }
  };

  // --- EXPORTACIÓN CSV DE PEDIDOS ---
  const exportarPedidosCSV = () => {
    try {
      const headers = [
        'Referencia',
        'Fecha',
        'Cliente_Nombre',
        'Cliente_Email',
        'Cliente_Telefono',
        'Direccion_Envio',
        'Ciudad',
        'Total_COP',
        'Metodo_Pago',
        'Estado_Logistico',
        'Transportadora',
        'Numero_Guia'
      ];

      const rows = pedidos.map((o) => [
        o.referencia,
        o.fecha ? new Date(o.fecha).toLocaleString('es-CO') : 'N/A',
        `"${(o.cliente?.nombre || 'Consumidor').replace(/"/g, '""')}"`,
        `"${o.cliente?.email || 'N/A'}"`,
        `"${o.cliente?.telefono || 'N/A'}"`,
        `"${(o.direccionEnvio?.direccion || 'N/A').replace(/"/g, '""')}"`,
        `"${o.direccionEnvio?.ciudad || 'Colombia'}"`,
        o.total,
        `"${o.metodoPago || 'Wompi'}"`,
        o.estado,
        `"${o.transportadora || 'Sin Asignar'}"`,
        `"${o.numeroGuia || 'N/A'}"`
      ]);

      const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const fecha = new Date().toISOString().slice(0, 10);
      link.setAttribute('href', url);
      link.setAttribute('download', `pedidos_ferreweb_${fecha}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      mostrarMensaje(`Exportados ${pedidos.length} pedidos a CSV.`);
    } catch (err) {
      setError('Error al exportar pedidos: ' + err.message);
    }
  };

  // --- REABASTECIMIENTO DE STOCK ---
  const handleReabastecer = async (id, cantidad, nombre, motivo = 'Reabastecimiento rápido de almacén') => {
    try {
      await reabastecerProducto(id, cantidad, motivo);
      mostrarMensaje(`+${cantidad} unidades agregadas al stock de "${nombre}".`);
      await cargarDatos();
    } catch (err) {
      setError('Error al reabastecer: ' + err.message);
    }
  };

  const handleGuardarReabastecimientoCustom = async (e) => {
    e.preventDefault();
    if (!productoReabastecer) return;
    try {
      await reabastecerProducto(productoReabastecer.id, Number(cantidadReabastecer), motivoReabastecer);
      mostrarMensaje(`+${cantidadReabastecer} unidades añadidas a "${productoReabastecer.nombre}" (Kardex actualizado).`);
      setProductoReabastecer(null);
      await cargarDatos();
    } catch (err) {
      setError('Error en reabastecimiento: ' + err.message);
    }
  };

  // --- CAMBIO DE ESTADO Y DESPACHO DE PEDIDOS ---
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

  const handleAbrirModalDespacho = (pedido) => {
    setPedidoDespacho(pedido);
    setTransportadoraSel(pedido.transportadora || 'Coordinadora');
    setNumeroGuiaInput(pedido.numeroGuia || `CR-${Math.floor(10000000 + Math.random() * 90000000)}`);
    setNotasDespachoInput(pedido.notasDespacho || 'Embalaje industrial con precinto de seguridad FerreWeb.');
  };

  const handleConfirmarDespacho = async (e) => {
    e.preventDefault();
    if (!pedidoDespacho) return;
    try {
      await actualizarDespachoPedido(pedidoDespacho.referencia, {
        nuevoEstado: 'despachado',
        transportadora: transportadoraSel,
        numeroGuia: numeroGuiaInput.trim(),
        notasDespacho: notasDespachoInput.trim()
      });
      mostrarMensaje(`Pedido ${pedidoDespacho.referencia} despachado vía ${transportadoraSel} (Guía: ${numeroGuiaInput}).`);
      setPedidoDespacho(null);
      await cargarDatos();
    } catch (err) {
      setError('Error al registrar despacho: ' + err.message);
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
            Esta sección requiere credenciales con rol <strong>admin</strong> para auditar servicios web, inventario, logística y órdenes de compra.
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

      {/* Barra de Pestañas Industriales con Persistencia */}
      <div className="industrial-tabs" role="tablist">
        <button
          type="button"
          className={`industrial-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => cambiarPestana('dashboard')}
        >
          <LayoutDashboard size={18} /> Dashboard (KPIs)
        </button>
        <button
          type="button"
          className={`industrial-tab ${activeTab === 'inventario' ? 'active' : ''}`}
          onClick={() => cambiarPestana('inventario')}
        >
          <Boxes size={18} /> Inventario ({productos.length})
        </button>
        <button
          type="button"
          className={`industrial-tab ${activeTab === 'alertas' ? 'active' : ''}`}
          onClick={() => cambiarPestana('alertas')}
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
          onClick={() => cambiarPestana('pedidos')}
        >
          <Truck size={18} /> Pedidos & Logística ({pedidos.length})
        </button>
        <button
          type="button"
          className={`industrial-tab ${activeTab === 'proveedores' ? 'active' : ''}`}
          onClick={() => cambiarPestana('proveedores')}
        >
          <Building2 size={18} /> Proveedores SCM ({proveedores.length})
        </button>
        <button
          type="button"
          className={`industrial-tab ${activeTab === 'cotizaciones' ? 'active' : ''}`}
          onClick={() => cambiarPestana('cotizaciones')}
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
          PESTAÑA 2: INVENTARIO (CATÁLOGO CRUD + FILTROS + PAGINACIÓN + CSV)
          ==================================================================== */}
      {activeTab === 'inventario' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Barra de Filtros y Exportación */}
          <div style={{
            background: '#07261B',
            padding: '16px 20px',
            borderRadius: '10px',
            border: '1px solid var(--color-border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '14px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', flex: '1 1 300px' }}>
              <div style={{ position: 'relative', width: '100%', maxWidth: '320px' }}>
                <Search size={16} color="var(--color-text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Buscar por nombre o SKU (FW-0001)..."
                  value={searchInventario}
                  onChange={(e) => setSearchInventario(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px 8px 36px',
                    borderRadius: '6px',
                    background: '#021B12',
                    border: '1px solid var(--color-border)',
                    color: '#fff',
                    fontSize: '0.85rem'
                  }}
                />
              </div>

              <select
                value={filtroCategoria}
                onChange={(e) => setFiltroCategoria(e.target.value)}
                style={{
                  padding: '8px 12px',
                  borderRadius: '6px',
                  background: '#021B12',
                  border: '1px solid var(--color-border)',
                  color: '#fff',
                  fontSize: '0.85rem'
                }}
              >
                <option value="todas">Todas las categorías</option>
                {categorias.filter(c => c.id !== 'todas').map((c) => (
                  <option key={c.id} value={c.id}>{c.nombre}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={exportarInventarioCSV}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 14px', fontSize: '0.85rem' }}
                title="Descargar inventario en archivo CSV estructurado"
              >
                <Download size={16} /> Exportar CSV
              </button>
            </div>
          </div>

          {/* Tabla de Productos */}
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
                  <th style={{ padding: '14px 16px' }}>Producto / SKU</th>
                  <th style={{ padding: '14px 16px' }}>Categoría</th>
                  <th style={{ padding: '14px 16px' }}>Precio Venta (COP)</th>
                  <th style={{ padding: '14px 16px' }}>Stock</th>
                  <th style={{ padding: '14px 16px' }}>Estado</th>
                  <th style={{ padding: '14px 16px', textAlign: 'center' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productosPaginados.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ padding: '36px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                      No se encontraron productos con los filtros aplicados.
                    </td>
                  </tr>
                ) : (
                  productosPaginados.map((p) => (
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
                            onClick={() => setProductoAEliminar(p)}
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
                  ))
                )}
              </tbody>
            </table>

            {/* Paginación */}
            {productosFiltrados.length > itemsPorPagina && (
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '14px 20px',
                background: '#021B12',
                borderTop: '1px solid var(--color-border)',
                fontSize: '0.85rem',
                color: 'var(--color-text-muted)'
              }}>
                <div>
                  Mostrando <strong>{(paginaActual - 1) * itemsPorPagina + 1} - {Math.min(paginaActual * itemsPorPagina, productosFiltrados.length)}</strong> de <strong>{productosFiltrados.length}</strong> productos
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    type="button"
                    disabled={paginaActual === 1}
                    onClick={() => setPaginaActual(p => Math.max(1, p - 1))}
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid var(--color-border)',
                      color: paginaActual === 1 ? 'rgba(255,255,255,0.3)' : '#fff',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      cursor: paginaActual === 1 ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <ChevronLeft size={16} /> Anterior
                  </button>
                  <span style={{ padding: '0 6px', fontWeight: '700', color: 'var(--color-secondary)' }}>
                    {paginaActual} / {totalPaginas}
                  </span>
                  <button
                    type="button"
                    disabled={paginaActual === totalPaginas}
                    onClick={() => setPaginaActual(p => Math.min(totalPaginas, p + 1))}
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid var(--color-border)',
                      color: paginaActual === totalPaginas ? 'rgba(255,255,255,0.3)' : '#fff',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      cursor: paginaActual === totalPaginas ? 'not-allowed' : 'pointer'
                    }}
                  >
                    Siguiente <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ====================================================================
          PESTAÑA 3: ALERTAS DE STOCK (<= 5) + KARDEX HISTORIAL
          ==================================================================== */}
      {activeTab === 'alertas' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Monitor de Stock Crítico */}
          <div style={{ background: '#07261B', borderRadius: '10px', border: '1px solid var(--color-border)', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h3 style={{ fontSize: '1.3rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-accent)' }}>
                  <AlertTriangle size={22} color="var(--color-accent)" />
                  Monitor de Existencias Críticas (Stock &le; 5)
                </h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', margin: '4px 0 0' }}>
                  Reabastece directamente la bodega en lotes predefinidos o personalizados y registra el movimiento en el Kardex.
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

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
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

                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        <button
                          type="button"
                          className="btn btn-secondary"
                          style={{ padding: '6px 10px', fontSize: '0.82rem' }}
                          onClick={() => handleReabastecer(prod.id, 10, prod.nombre, 'Reabastecimiento express +10')}
                        >
                          +10 Uds
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary"
                          style={{ padding: '6px 10px', fontSize: '0.82rem' }}
                          onClick={() => handleReabastecer(prod.id, 25, prod.nombre, 'Reabastecimiento express +25')}
                        >
                          +25 Uds
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary"
                          style={{ padding: '6px 10px', fontSize: '0.82rem' }}
                          onClick={() => handleReabastecer(prod.id, 50, prod.nombre, 'Reabastecimiento express +50')}
                        >
                          +50 Uds
                        </button>
                        <button
                          type="button"
                          className="btn btn-primary"
                          style={{ padding: '6px 10px', fontSize: '0.82rem' }}
                          onClick={() => {
                            setProductoReabastecer(prod);
                            setCantidadReabastecer(20);
                            setMotivoReabastecer('Factura de compra de proveedor aliando');
                          }}
                        >
                          Personalizado...
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Historial de Movimientos Kardex */}
          <div style={{ background: '#07261B', borderRadius: '10px', border: '1px solid var(--color-border)', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <History size={20} color="var(--color-secondary)" />
              <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Historial de Movimientos de Kardex (Bodega)</h3>
            </div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: '16px' }}>
              Auditoría cronológica de ingresos y egresos de mercancía con registro de justificación y trazabilidad.
            </p>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
                <thead>
                  <tr style={{ background: '#021B12', borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-muted)', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                    <th style={{ padding: '12px 14px' }}>Fecha y Hora</th>
                    <th style={{ padding: '12px 14px' }}>Tipo</th>
                    <th style={{ padding: '12px 14px' }}>Producto</th>
                    <th style={{ padding: '12px 14px' }}>Cantidad</th>
                    <th style={{ padding: '12px 14px' }}>Motivo / Justificación</th>
                  </tr>
                </thead>
                <tbody>
                  {kardex.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ padding: '24px', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                        No hay movimientos de inventario registrados en esta sesión.
                      </td>
                    </tr>
                  ) : (
                    kardex.slice(-15).reverse().map((mov) => (
                      <tr key={mov.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <td style={{ padding: '12px 14px', fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>
                          {new Date(mov.fecha).toLocaleString('es-CO')}
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <span style={{
                            background: mov.tipo === 'ENTRADA' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                            color: mov.tipo === 'ENTRADA' ? 'var(--color-secondary)' : 'var(--color-danger)',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            fontWeight: '700'
                          }}>
                            {mov.tipo}
                          </span>
                        </td>
                        <td style={{ padding: '12px 14px', fontWeight: '600', fontSize: '0.88rem' }}>
                          {mov.productoNombre} <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>(ID #{mov.productoId})</span>
                        </td>
                        <td style={{ padding: '12px 14px', fontWeight: '700', fontFamily: 'var(--font-mono)', color: mov.tipo === 'ENTRADA' ? 'var(--color-secondary)' : 'var(--color-danger)' }}>
                          {mov.tipo === 'ENTRADA' ? `+${mov.cantidad}` : `-${mov.cantidad}`} uds
                        </td>
                        <td style={{ padding: '12px 14px', fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                          {mov.motivo}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          PESTAÑA 4: PEDIDOS / LOGÍSTICA (OMS + DESPACHOS + REMISIÓN)
          ==================================================================== */}
      {activeTab === 'pedidos' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Barra Superior con Exportar CSV */}
          <div style={{
            background: '#07261B',
            padding: '16px 20px',
            borderRadius: '10px',
            border: '1px solid var(--color-border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', margin: 0 }}>Gestión de Pedidos & Despachos de Bodega</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.82rem', margin: '2px 0 0' }}>
                Monitoreo de órdenes de compra, vinculación con transportadoras reales e impresión de remisiones.
              </p>
            </div>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={exportarPedidosCSV}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}
            >
              <Download size={16} /> Exportar Reporte de Ventas (CSV)
            </button>
          </div>

          {/* Tabla de Órdenes */}
          <div style={{
            background: '#07261B',
            borderRadius: '10px',
            border: '1px solid var(--color-border)',
            overflowX: 'auto',
            boxShadow: 'var(--shadow-md)'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '950px' }}>
              <thead>
                <tr style={{ background: '#021B12', borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '14px 16px' }}>Referencia</th>
                  <th style={{ padding: '14px 16px' }}>Cliente / Destino</th>
                  <th style={{ padding: '14px 16px' }}>Total COP</th>
                  <th style={{ padding: '14px 16px' }}>Estado Logístico</th>
                  <th style={{ padding: '14px 16px' }}>Transportadora & Guía</th>
                  <th style={{ padding: '14px 16px', textAlign: 'center' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {pedidos.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ padding: '36px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                      No hay pedidos registrados en el sistema actualmente.
                    </td>
                  </tr>
                ) : (
                  pedidos.map((o) => (
                    <tr key={o.referencia} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--color-accent)', fontWeight: '700' }}>
                        {o.referencia}
                        <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', fontWeight: 'normal', fontFamily: 'var(--font-sans)', marginTop: '2px' }}>
                          {o.fecha ? new Date(o.fecha).toLocaleDateString('es-CO') : 'Reciente'}
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: '0.88rem' }}>
                        <div style={{ fontWeight: '600' }}>{o.cliente?.nombre || 'Cliente'}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>{o.cliente?.email || 'N/A'}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)' }}>
                          {o.direccionEnvio?.ciudad || 'Colombia'} &middot; {o.direccionEnvio?.direccion || ''}
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px', fontWeight: '700', fontFamily: 'var(--font-mono)', color: 'var(--color-secondary)' }}>
                        {formatearPrecioCOP(o.total)}
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
                            color: o.estado === 'entregado' ? 'var(--color-secondary)' : (o.estado === 'despachado' ? 'var(--color-accent)' : '#fff'),
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
                      <td style={{ padding: '14px 16px' }}>
                        {o.transportadora ? (
                          <div>
                            <span style={{
                              background: 'rgba(185, 231, 105, 0.1)',
                              color: 'var(--color-secondary)',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontSize: '0.75rem',
                              fontWeight: '700'
                            }}>
                              {o.transportadora}
                            </span>
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', marginTop: '4px', color: '#fff' }}>
                              Guía: <strong>{o.numeroGuia || 'N/A'}</strong>
                            </div>
                          </div>
                        ) : (
                          <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                            Sin despacho asignado
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                          <button
                            type="button"
                            onClick={() => handleAbrirModalDespacho(o)}
                            title="Gestionar Despacho y Transportadora"
                            style={{
                              background: 'rgba(255, 212, 59, 0.12)',
                              border: '1px solid var(--color-accent)',
                              color: 'var(--color-accent)',
                              padding: '6px 10px',
                              borderRadius: '6px',
                              fontSize: '0.8rem',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <Truck size={14} /> Despachar
                          </button>
                          <button
                            type="button"
                            onClick={() => setPedidoRemision(o)}
                            title="Ver e Imprimir Remisión de Bodega"
                            style={{
                              background: 'rgba(185, 231, 105, 0.12)',
                              border: '1px solid var(--color-secondary)',
                              color: 'var(--color-secondary)',
                              padding: '6px 10px',
                              borderRadius: '6px',
                              fontSize: '0.8rem',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <Printer size={14} /> Remisión
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
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
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '850px' }}>
            <thead>
              <tr style={{ background: '#021B12', borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '14px 16px' }}>Código</th>
                <th style={{ padding: '14px 16px' }}>Empresa / NIT</th>
                <th style={{ padding: '14px 16px' }}>Contacto</th>
                <th style={{ padding: '14px 16px' }}>Materiales Solicitados</th>
                <th style={{ padding: '14px 16px' }}>Estado</th>
                <th style={{ padding: '14px 16px', textAlign: 'center' }}>Acciones B2B</th>
              </tr>
            </thead>
            <tbody>
              {cotizaciones.map((cot) => {
                const telClean = cot.telefono ? cot.telefono.replace(/\D/g, '') : '';
                const wsMsg = `Hola ${cot.cliente}, te saludamos de FERRETERÍA FERREWEB SAS. Recibimos tu solicitud de cotización ${cot.codigo} para la empresa ${cot.empresa}. Queremos presentarte nuestra propuesta para los materiales solicitados: ${cot.items?.slice(0, 80)}... ¿Podemos coordinar una llamada?`;
                const wsUrl = `https://wa.me/57${telClean}?text=${encodeURIComponent(wsMsg)}`;
                const mailSubject = `Cotización FerreWeb ${cot.codigo} - ${cot.empresa}`;
                const mailBody = `Estimado(a) ${cot.cliente},\n\nLe contactamos desde FerreWeb respecto a su solicitud de cotización ${cot.codigo} para ${cot.empresa}.\n\nMateriales cotizados:\n${cot.items}\n\nQuedamos a su disposición.`;
                const mailUrl = `mailto:${cot.email}?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`;

                return (
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
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', alignItems: 'center' }}>
                        <a
                          href={wsUrl}
                          target="_blank"
                          rel="noreferrer"
                          title="Contactar vía WhatsApp"
                          style={{
                            background: 'rgba(34, 197, 94, 0.15)',
                            border: '1px solid var(--color-secondary)',
                            color: 'var(--color-secondary)',
                            padding: '6px 8px',
                            borderRadius: '6px',
                            display: 'inline-flex',
                            alignItems: 'center'
                          }}
                        >
                          <MessageCircle size={15} />
                        </a>
                        <a
                          href={mailUrl}
                          title="Enviar Correo Electrónico"
                          style={{
                            background: 'rgba(255, 212, 59, 0.12)',
                            border: '1px solid var(--color-accent)',
                            color: 'var(--color-accent)',
                            padding: '6px 8px',
                            borderRadius: '6px',
                            display: 'inline-flex',
                            alignItems: 'center'
                          }}
                        >
                          <Mail size={15} />
                        </a>
                        {cot.estado !== 'contactado' && (
                          <button
                            type="button"
                            className="btn btn-secondary"
                            style={{ padding: '5px 8px', fontSize: '0.75rem' }}
                            onClick={() => handleMarcarCotizacionContactado(cot.id, cot.codigo)}
                            title="Marcar solicitud como atendida"
                          >
                            Atendido
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
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
                  placeholder="ej: Taladro Percutor 20V Industrial"
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
                    Precio Anterior (Opcional)
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
                    placeholder="520000"
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
          MODAL DE CONFIRMACIÓN DESTRUTIVA DE ELIMINACIÓN DE PRODUCTO
          ==================================================================== */}
      {productoAEliminar && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(5px)',
            zIndex: 5100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setProductoAEliminar(null)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '480px',
              backgroundColor: '#07261B',
              borderRadius: '12px',
              border: '1px solid var(--color-danger)',
              padding: '24px',
              boxShadow: '0 20px 40px rgba(255, 77, 77, 0.2)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--color-danger)', marginBottom: '14px' }}>
              <AlertTriangle size={28} />
              <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Eliminar Producto del Catálogo</h3>
            </div>

            <p style={{ color: '#E5E7EB', fontSize: '0.92rem', lineHeight: '1.5', marginBottom: '16px' }}>
              ¿Estás seguro de que deseas eliminar permanentemente el producto <strong>"{productoAEliminar.nombre}"</strong>?
            </p>

            <div style={{ background: '#021B12', padding: '12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '20px', fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
              <div>SKU: <strong style={{ color: '#fff', fontFamily: 'var(--font-mono)' }}>FW-{String(productoAEliminar.id).padStart(4, '0')}</strong></div>
              <div>Existencias actuales en bodega: <strong style={{ color: 'var(--color-accent)' }}>{productoAEliminar.stock} unidades</strong></div>
              <div style={{ color: 'var(--color-danger)', marginTop: '4px' }}>⚠️ Esta acción retirará el ítem del catálogo público de inmediato.</div>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setProductoAEliminar(null)}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleEliminarProductoConfirmado}
                style={{
                  background: 'var(--color-danger)',
                  color: '#fff',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontWeight: '700',
                  fontSize: '0.88rem'
                }}
              >
                Eliminar Definitivamente
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL DE REABASTECIMIENTO PERSONALIZADO (KARDEX)
          ==================================================================== */}
      {productoReabastecer && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(5px)',
            zIndex: 5100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setProductoReabastecer(null)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '460px',
              backgroundColor: '#07261B',
              borderRadius: '12px',
              border: '1px solid var(--color-border)',
              padding: '24px',
              boxShadow: 'var(--shadow-lg)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Boxes size={20} color="var(--color-secondary)" />
                Reabastecimiento de Almacén
              </h3>
              <button
                type="button"
                onClick={() => setProductoReabastecer(null)}
                style={{ background: 'transparent', border: 'none', color: 'var(--color-text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ marginBottom: '16px', padding: '10px 14px', background: '#021B12', borderRadius: '6px', border: '1px solid var(--color-border)' }}>
              <div style={{ fontWeight: '700', color: '#fff' }}>{productoReabastecer.nombre}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Stock actual: {productoReabastecer.stockActual || productoReabastecer.stock} uds</div>
            </div>

            <form onSubmit={handleGuardarReabastecimientoCustom}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', marginBottom: '6px', color: 'var(--color-text-muted)' }}>
                  Cantidad a Ingresar (Unidades) *
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={cantidadReabastecer}
                  onChange={(e) => setCantidadReabastecer(e.target.value)}
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

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', marginBottom: '6px', color: 'var(--color-text-muted)' }}>
                  Motivo / Soporte Contable *
                </label>
                <input
                  type="text"
                  required
                  value={motivoReabastecer}
                  onChange={(e) => setMotivoReabastecer(e.target.value)}
                  placeholder="ej. Factura #9084 de Distribuidora Bosch"
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

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setProductoReabastecer(null)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <Plus size={16} /> Confirmar Ingreso
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL DE DESPACHO LOGÍSTICO (TRANSPORTADORA + GUÍA)
          ==================================================================== */}
      {pedidoDespacho && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(5px)',
            zIndex: 5100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setPedidoDespacho(null)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '520px',
              backgroundColor: '#07261B',
              borderRadius: '12px',
              border: '1px solid var(--color-border)',
              padding: '24px',
              boxShadow: 'var(--shadow-lg)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Truck size={20} color="var(--color-accent)" />
                Despacho Logístico de Mercancía
              </h3>
              <button
                type="button"
                onClick={() => setPedidoDespacho(null)}
                style={{ background: 'transparent', border: 'none', color: 'var(--color-text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ background: '#021B12', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--color-border)', marginBottom: '18px', fontSize: '0.85rem' }}>
              <div>Orden: <strong style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-mono)' }}>{pedidoDespacho.referencia}</strong></div>
              <div>Destinatario: <strong>{pedidoDespacho.cliente?.nombre}</strong> &middot; {pedidoDespacho.direccionEnvio?.ciudad}</div>
              <div>Dirección: {pedidoDespacho.direccionEnvio?.direccion}</div>
            </div>

            <form onSubmit={handleConfirmarDespacho}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', marginBottom: '6px', color: 'var(--color-text-muted)' }}>
                  Transportadora Oficial *
                </label>
                <select
                  value={transportadoraSel}
                  onChange={(e) => setTransportadoraSel(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    backgroundColor: '#021B12',
                    border: '1px solid var(--color-border)',
                    color: '#fff',
                    fontWeight: '600'
                  }}
                >
                  <option value="Coordinadora">Coordinadora Mercantil</option>
                  <option value="Servientrega">Servientrega Logística</option>
                  <option value="Envía">Envía Colvanes</option>
                  <option value="Interrapidísimo">Interrapidísimo</option>
                  <option value="Transporte Propio FerreWeb">Transporte Propio FerreWeb (Flota Urbana)</option>
                </select>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', marginBottom: '6px', color: 'var(--color-text-muted)' }}>
                  Número de Guía de Rastreo *
                </label>
                <input
                  type="text"
                  required
                  value={numeroGuiaInput}
                  onChange={(e) => setNumeroGuiaInput(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    backgroundColor: '#021B12',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-accent)',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: '700'
                  }}
                  placeholder="ej. CR-90412850"
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', marginBottom: '6px', color: 'var(--color-text-muted)' }}>
                  Notas de Despacho / Precinto de Seguridad
                </label>
                <textarea
                  rows="2"
                  value={notasDespachoInput}
                  onChange={(e) => setNotasDespachoInput(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
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
                  onClick={() => setPedidoDespacho(null)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <Truck size={16} /> Confirmar Despacho
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL DE REMISIÓN IMPRIMIBLE DE BODEGA
          ==================================================================== */}
      {pedidoRemision && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(5px)',
            zIndex: 5200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            overflowY: 'auto'
          }}
          onClick={() => setPedidoRemision(null)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '860px',
              backgroundColor: '#07261B',
              borderRadius: '12px',
              border: '1px solid var(--color-border)',
              padding: '24px',
              boxShadow: 'var(--shadow-lg)',
              maxHeight: '94vh',
              overflowY: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Barra de Controles Modal */}
            <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid var(--color-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Printer size={20} color="var(--color-secondary)" />
                <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Remisión de Bodega &middot; Orden {pedidoRemision.referencia}</h3>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => window.print()}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}
                >
                  <Printer size={16} /> Imprimir Remisión
                </button>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setPedidoRemision(null)}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Hoja de Remisión Estilizada para Pantalla e Impresión */}
            <div className="remision-container remision-print-container">
              <div className="remision-header">
                <div>
                  <div className="remision-company-name">FERRETERÍA INDUSTRIAL FERREWEB SAS</div>
                  <div className="remision-company-info">
                    NIT: 901.884.210-9 &middot; Régimen Común &middot; Grandes Superficies Ferreteras<br />
                    Dirección: Parque Industrial San Carlos Bodega 14 &middot; Bogotá D.C., Colombia<br />
                    PBX: (601) 745-8900 &middot; Línea de Bodega: +57 310 999 8877 &middot; soporte@ferreweb.com
                  </div>
                </div>
                <div className="remision-doc-title">
                  <div className="remision-badge">REMISIÓN DE DESPACHO</div>
                  <div className="remision-ref">REF: {pedidoRemision.referencia}</div>
                  <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '4px' }}>
                    Fecha: {pedidoRemision.fecha ? new Date(pedidoRemision.fecha).toLocaleDateString('es-CO') : new Date().toLocaleDateString('es-CO')}
                  </div>
                </div>
              </div>

              <div className="remision-meta-grid">
                <div className="remision-meta-block">
                  <h4>Datos del Cliente & Entrega</h4>
                  <p><strong>Destinatario:</strong> {pedidoRemision.cliente?.nombre || 'Cliente'}</p>
                  <p><strong>Identificación:</strong> {pedidoRemision.cliente?.cedula || 'Consumidor Final'}</p>
                  <p><strong>Dirección:</strong> {pedidoRemision.direccionEnvio?.direccion || 'Entrega en Bodega'}</p>
                  <p><strong>Ciudad / Depto:</strong> {pedidoRemision.direccionEnvio?.ciudad || 'Bogotá D.C.'}</p>
                  <p><strong>Teléfono:</strong> {pedidoRemision.cliente?.telefono || 'N/A'}</p>
                </div>
                <div className="remision-meta-block">
                  <h4>Datos Logísticos & Despacho</h4>
                  <p><strong>Operador Logístico:</strong> {pedidoRemision.transportadora || 'Transporte Propio FerreWeb'}</p>
                  <p><strong>Número de Guía:</strong> <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '700' }}>{pedidoRemision.numeroGuia || 'CR-PENDIENTE'}</span></p>
                  <p><strong>Estado Operativo:</strong> {pedidoRemision.estado?.toUpperCase()}</p>
                  <p><strong>Medio de Pago:</strong> {pedidoRemision.metodoPago || 'Wompi Integrado (Aprobado)'}</p>
                  <p><strong>Notas:</strong> {pedidoRemision.notasDespacho || 'Embalaje sellado con cinta de seguridad.'}</p>
                </div>
              </div>

              <table className="remision-table">
                <thead>
                  <tr>
                    <th>SKU</th>
                    <th>Descripción del Producto</th>
                    <th style={{ textAlign: 'center' }}>Cantidad</th>
                    <th style={{ textAlign: 'right' }}>Valor Unitario</th>
                    <th style={{ textAlign: 'right' }}>Total (COP)</th>
                  </tr>
                </thead>
                <tbody>
                  {pedidoRemision.items && pedidoRemision.items.length > 0 ? (
                    pedidoRemision.items.map((item, idx) => (
                      <tr key={idx}>
                        <td style={{ fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
                          FW-{String(item.id || idx + 1).padStart(4, '0')}
                        </td>
                        <td>
                          <strong>{item.nombre}</strong>
                        </td>
                        <td style={{ textAlign: 'center', fontWeight: '700' }}>
                          {item.cantidad}
                        </td>
                        <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
                          {formatearPrecioCOP(item.precio)}
                        </td>
                        <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: '700' }}>
                          {formatearPrecioCOP(item.precio * item.cantidad)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '16px' }}>
                        Detalle de ítems consolidado en la orden principal.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              <div className="remision-total-row">
                <div>Subtotal Mercancía: <strong>{formatearPrecioCOP(pedidoRemision.total)}</strong></div>
                <div>Costo de Envío: <strong>$0 (Bonificado)</strong></div>
                <div style={{ fontSize: '15px', color: '#1F5A37' }}>
                  Total Liquidado: <strong>{formatearPrecioCOP(pedidoRemision.total)}</strong>
                </div>
              </div>

              <div style={{ fontSize: '11px', color: '#4B5563', lineHeight: '1.4', background: '#F9FAFB', padding: '10px 14px', borderRadius: '4px', border: '1px solid #E5E7EB' }}>
                <strong>CONDICIONES DE ENTREGA:</strong> El receptor declara haber revisado las cantidades, empaques y sellos de seguridad a entera satisfacción. Cualquier inconsistencia debe ser consignada en esta remisión antes de la firma. FerreWeb garantiza la originalidad y cumplimiento de normas técnicas ICONTEC en todos los productos suministrados.
              </div>

              <div className="remision-signatures">
                <div className="remision-signature-box">
                  <strong>DESPACHADO POR:</strong><br />
                  Bodega Principal FerreWeb SAS<br />
                  Firma Responsable Despacho: ___________________________<br />
                  C.C. No. ________________________ Fecha: ____/____/________
                </div>
                <div className="remision-signature-box">
                  <strong>RECIBIDO A CONFORMIDAD:</strong><br />
                  Cliente / Conductor Transportadora<br />
                  Nombre Legible: _______________________________________<br />
                  C.C. / Sello: ___________________ Fecha: ____/____/________
                </div>
              </div>
            </div>
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
                  placeholder="ej. Distribuidora Bosch Colombia SAS"
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
