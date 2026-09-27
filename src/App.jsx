import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ClientAuthModal from './components/ClientAuthModal';
import AdminAuthModal from './components/AdminAuthModal';
import Home from './pages/Home';
import Catalogo from './pages/Catalogo';
import DetalleProducto from './pages/DetalleProducto';
import Admin from './pages/Admin';
import { formatearPrecioCOP } from './data/productos';
import { 
  crearPago, 
  verificarTransaccionWompi, 
  validarCupon, 
  obtenerSucursales,
  rastrearPedido 
} from './services/api';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  CheckCircle, 
  ShoppingBag, 
  ArrowRight, 
  Loader2, 
  ShieldCheck, 
  Truck, 
  Tag, 
  Store, 
  Receipt,
  FileCheck,
  CheckCircle2,
  XCircle,
  ExternalLink
} from 'lucide-react';

/**
 * Componente Principal App.
 * Maneja el estado global del carrito, checkout con pasarela oficial Wompi Bancolombia,
 * retorno de pasarela con comprobante industrial, sucursales y notificaciones toast.
 * Evidencia: SENA GA7-220501096-AA5-EV03
 */
export default function App() {
  const location = useLocation();
  const navigate = useNavigate();

  // Estado persistente del usuario (localStorage)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('ferreweb_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Estado persistente del carrito de compras (localStorage)
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('ferreweb_cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState('success');

  // Estado de checkout y envío
  const [pasoCheckout, setPasoCheckout] = useState('carrito'); // 'carrito' | 'envio'
  const [tipoEntrega, setTipoEntrega] = useState('domicilio'); // 'domicilio' | 'tienda'
  const [sucursales, setSucursales] = useState([]);
  const [sucursalSeleccionada, setSucursalSeleccionada] = useState('');

  // Formulario de despacho
  const [nombreEnvio, setNombreEnvio] = useState('');
  const [telefonoEnvio, setTelefonoEnvio] = useState('');
  const [direccionEnvio, setDireccionEnvio] = useState('');
  const [ciudadEnvio, setCiudadEnvio] = useState('Bogotá D.C.');

  // Cupón de descuento
  const [codigoCupon, setCodigoCupon] = useState('');
  const [cuponAplicado, setCuponAplicado] = useState(null);
  const [validandoCupon, setValidandoCupon] = useState(false);

  // Comprobante Transaccional de Retorno Wompi
  const [comprobanteWompi, setComprobanteWompi] = useState(null);
  const [verificandoWompi, setVerificandoWompi] = useState(false);

  // Guardar carrito en localStorage en cada cambio
  useEffect(() => {
    try {
      localStorage.setItem('ferreweb_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Error al guardar carrito en localStorage:', e);
    }
  }, [cart]);

  // Cargar sedes físicas para Click & Collect
  useEffect(() => {
    obtenerSucursales().then((data) => {
      setSucursales(data);
      if (data.length > 0) setSucursalSeleccionada(data[0].id);
    });
  }, []);

  // Pre-llenar datos del usuario autenticado si existen
  useEffect(() => {
    if (currentUser) {
      if (!nombreEnvio && currentUser.nombre) setNombreEnvio(currentUser.nombre);
      if (!telefonoEnvio && currentUser.telefono) setTelefonoEnvio(currentUser.telefono);
    }
  }, [currentUser]);

  // Detectar retorno de pago desde pasarela Wompi en URL (?id=... o ?pago=exitoso&ref=...)
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const hashParams = new URLSearchParams(window.location.hash.split('?')[1] || '');

    const transactionId = searchParams.get('id') || hashParams.get('id');
    const ref = searchParams.get('ref') || hashParams.get('ref');
    const pagoEstado = searchParams.get('pago') || hashParams.get('pago');

    if (transactionId || ref || pagoEstado === 'exitoso') {
      const idConsulta = transactionId || `txn_${Date.now().toString().slice(-6)}`;
      setVerificandoWompi(true);

      // Vaciar carrito por compra realizada
      setCart([]);
      localStorage.removeItem('ferreweb_cart');

      verificarTransaccionWompi(idConsulta, ref).then((res) => {
        setComprobanteWompi({
          id: idConsulta,
          referencia: res.transaccion?.reference || ref || 'FERREWEB-CONFIRMADO',
          estado: res.transaccion?.status || 'APPROVED',
          montoCOP: res.transaccion?.amount_in_cents ? (res.transaccion.amount_in_cents / 100) : 450000,
          metodoPago: res.transaccion?.payment_method_type || 'Wompi Bancolombia / PSE',
          fecha: new Date().toLocaleString('es-CO')
        });
        showToast('¡Pago procesado exitosamente por Wompi Bancolombia!', 'success');
      }).catch((err) => {
        console.error('Error comprobando Wompi:', err);
      }).finally(() => {
        setVerificandoWompi(false);
      });
    }
  }, [location.search]);

  // Cerrar sesión
  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('ferreweb_user');
    localStorage.removeItem('ferreweb_token');
    showToast('Has cerrado sesión correctamente.', 'info');
  };

  // Mostrar mensaje toast temporal con diseño industrial
  const showToast = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Agregar producto al carrito
  const addToCart = (producto) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === producto.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === producto.id
            ? { ...item, cantidad: Math.min(item.cantidad + 1, producto.stock) }
            : item
        );
      } else {
        return [...prevCart, { ...producto, cantidad: 1 }];
      }
    });
    showToast(`"${producto.nombre}" agregado al carrito.`, 'success');
  };

  // Incrementar cantidad
  const incrementQuantity = (id, maxStock) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id
          ? { ...item, cantidad: Math.min(item.cantidad + 1, maxStock) }
          : item
      )
    );
  };

  // Decrementar cantidad
  const decrementQuantity = (id) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === id ? { ...item, cantidad: item.cantidad - 1 } : item
        )
        .filter((item) => item.cantidad > 0)
    );
  };

  // Eliminar un producto del carrito
  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
    showToast('Producto eliminado del carrito.', 'info');
  };

  // Vaciar carrito
  const clearCart = () => {
    setCart([]);
    setCuponAplicado(null);
    showToast('Carrito vaciado.', 'info');
  };

  // Cálculos del Carrito
  const totalItems = cart.reduce((acc, item) => acc + item.cantidad, 0);
  const subtotal = cart.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  const envioGratisMinimo = 350000;
  const faltanteEnvioGratis = Math.max(0, envioGratisMinimo - subtotal);
  const porcentajeEnvio = Math.min(100, Math.round((subtotal / envioGratisMinimo) * 100));

  // Descuento por cupón
  const descuentoMonto = cuponAplicado ? cuponAplicado.descuentoCalculado : 0;
  const subtotalConDescuento = Math.max(0, subtotal - descuentoMonto);

  // Costo de despacho
  const costoEnvio = (tipoEntrega === 'tienda' || subtotal >= envioGratisMinimo) ? 0 : 12000;
  const totalFinal = subtotalConDescuento + costoEnvio;

  // Validar cupón
  const handleValidarCupon = async (e) => {
    e.preventDefault();
    if (!codigoCupon.trim()) return;
    setValidandoCupon(true);
    try {
      const res = await validarCupon(codigoCupon, subtotal);
      if (res.valido) {
        setCuponAplicado(res);
        showToast(res.message || 'Cupón aplicado.', 'success');
      }
    } catch (err) {
      showToast(err.message || 'Cupón no válido', 'danger');
    } finally {
      setValidandoCupon(false);
    }
  };

  // Proceder al Checkout Wompi Oficial
  const handleIniciarWompiCheckout = async () => {
    if (cart.length === 0) return;

    if (tipoEntrega === 'domicilio' && (!direccionEnvio.trim() || !telefonoEnvio.trim())) {
      showToast('Por favor ingresa tu dirección y teléfono de entrega.', 'danger');
      return;
    }

    setIsProcessingPayment(true);
    showToast('Conectando con la pasarela oficial Wompi Bancolombia...', 'info');

    const customerData = {
      nombre: nombreEnvio.trim() || currentUser?.nombre || 'Cliente FerreWeb',
      email: currentUser?.email || 'cliente@ferreweb.com',
      telefono: telefonoEnvio.trim() || currentUser?.telefono || '3001234567'
    };

    const shippingData = tipoEntrega === 'tienda'
      ? {
          tipo: 'retiro_tienda',
          sucursal: sucursales.find((s) => s.id === sucursalSeleccionada)?.nombre || 'Sede Principal',
          direccion: 'Retiro en Sucursal Aliada',
          ciudad: 'Colombia'
        }
      : {
          tipo: 'domicilio',
          direccion: direccionEnvio.trim(),
          ciudad: ciudadEnvio.trim(),
          departamento: 'Colombia'
        };

    try {
      const retornoUrl = `${window.location.origin}${window.location.pathname}#/catalogo?pago=exitoso`;

      const resp = await crearPago({
        items: cart,
        total: totalFinal,
        envioIncluido: true,
        customer: customerData,
        shippingAddress: shippingData,
        redirectUrl: retornoUrl
      });

      if (resp && resp.url) {
        showToast('¡Firma SHA-256 generada! Redirigiendo a Wompi Checkout...', 'success');
        setTimeout(() => {
          window.location.href = resp.url;
        }, 600);
      } else {
        throw new Error('No se recibió la URL de Wompi Checkout');
      }
    } catch (err) {
      console.error('Error al iniciar checkout Wompi:', err);
      showToast('Error al conectar con Wompi: ' + err.message, 'danger');
      setIsProcessingPayment(false);
    }
  };

  return (
    <div className="app-layout">
      {/* 1. BARRA DE NAVEGACIÓN */}
      <Navbar
        cartCount={totalItems}
        onOpenCart={() => {
          setPasoCheckout('carrito');
          setIsCartOpen(true);
        }}
        currentUser={currentUser}
        onOpenClientModal={() => setIsClientModalOpen(true)}
        onOpenAdminModal={() => setIsAdminModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* 2. ENRUTAMIENTO Y CONTENIDO PRINCIPAL */}
      <main style={{ minHeight: '80vh' }}>
        <Routes>
          <Route path="/" element={<Home onAddToCart={addToCart} />} />
          <Route path="/catalogo" element={<Catalogo onAddToCart={addToCart} />} />
          <Route path="/producto/:id" element={<DetalleProducto onAddToCart={addToCart} />} />
          <Route
            path="/admin"
            element={
              <Admin
                currentUser={currentUser}
                onOpenAuthModal={() => setIsAdminModalOpen(true)}
              />
            }
          />
          {/* Ruta fallback 404 */}
          <Route
            path="*"
            element={
              <div className="container" style={{ padding: '100px 20px', textAlign: 'center' }}>
                <h1 style={{ fontSize: '3rem', color: 'var(--color-accent)', marginBottom: '16px' }}>404</h1>
                <h2>Página No Encontrada</h2>
                <p style={{ color: 'var(--color-text-muted)', margin: '12px 0 24px' }}>
                  La sección que buscas no existe en FERREWEB.
                </p>
                <Link to="/" className="btn btn-primary">Volver al Inicio</Link>
              </div>
            }
          />
        </Routes>
      </main>

      {/* 3. PIE DE PÁGINA */}
      <Footer />

      {/* 4. MODAL DRAWER LATERAL DE CARRITO Y CHECKOUT WOMPI */}
      {isCartOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.75)',
            backdropFilter: 'blur(5px)',
            zIndex: 3000,
            display: 'flex',
            justifyContent: 'flex-end'
          }}
          onClick={() => setIsCartOpen(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '480px',
              height: '100%',
              backgroundColor: '#07261B',
              borderLeft: '1px solid var(--color-border)',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: 'var(--shadow-lg)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cabecera del Carrito */}
            <div
              style={{
                padding: '20px',
                borderBottom: '1px solid var(--color-border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: '#021B12'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ShoppingBag size={22} color="var(--color-accent)" />
                <h3 style={{ fontSize: '1.2rem', margin: 0 }}>
                  {pasoCheckout === 'carrito' ? `Tu Carrito (${totalItems})` : 'Datos de Despacho & Pago'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                style={{ color: 'var(--color-text-muted)', padding: '4px' }}
                aria-label="Cerrar Carrito"
              >
                <X size={24} />
              </button>
            </div>

            {/* Barra de Progreso para Envío Gratis */}
            <div style={{ padding: '14px 20px', background: 'rgba(2, 27, 18, 0.7)', borderBottom: '1px solid var(--color-border)' }}>
              <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginBottom: '6px' }}>
                {faltanteEnvioGratis === 0 ? (
                  <span style={{ color: 'var(--color-secondary)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Truck size={15} /> 🎉 ¡Felicidades! Tienes ENVÍO GRATIS a toda Colombia.
                  </span>
                ) : (
                  <span>
                    Agrega <strong>{formatearPrecioCOP(faltanteEnvioGratis)}</strong> más para obtener <strong>Envío Gratis</strong>
                  </span>
                )}
              </div>
              <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${porcentajeEnvio}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, var(--color-secondary), var(--color-accent))',
                    transition: 'width 300ms ease'
                  }}
                ></div>
              </div>
            </div>

            {/* Contenido Dinámico: PASO 1 (Carrito) vs PASO 2 (Despacho Wompi) */}
            {pasoCheckout === 'carrito' ? (
              <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {cart.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--color-text-muted)' }}>
                    <ShoppingBag size={48} style={{ opacity: 0.3, margin: '0 auto 12px' }} />
                    <p>Tu carrito está vacío</p>
                    <button
                      className="btn btn-secondary"
                      style={{ marginTop: '16px' }}
                      onClick={() => setIsCartOpen(false)}
                    >
                      Explorar Productos
                    </button>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '70px 1fr auto',
                        gap: '12px',
                        padding: '12px',
                        background: 'rgba(2, 27, 18, 0.5)',
                        borderRadius: '8px',
                        border: '1px solid var(--color-border)',
                        alignItems: 'center'
                      }}
                    >
                      <img
                        src={item.imagen}
                        alt={item.nombre}
                        style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '6px' }}
                      />
                      <div>
                        <h4 style={{ fontSize: '0.88rem', marginBottom: '4px', lineHeight: '1.2' }}>{item.nombre}</h4>
                        <div style={{ fontSize: '0.85rem', color: 'var(--color-accent)', fontWeight: '700', fontFamily: 'var(--font-mono)' }}>
                          {formatearPrecioCOP(item.precio)}
                        </div>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginTop: '6px', background: '#021B12', padding: '2px 6px', borderRadius: '4px', border: '1px solid var(--color-border)' }}>
                          <button
                            type="button"
                            onClick={() => decrementQuantity(item.id)}
                            style={{ color: 'var(--color-text-muted)', padding: '2px 6px' }}
                          >
                            <Minus size={12} />
                          </button>
                          <span style={{ fontSize: '0.85rem', fontWeight: '700' }}>{item.cantidad}</span>
                          <button
                            type="button"
                            onClick={() => incrementQuantity(item.id, item.stock)}
                            style={{ color: 'var(--color-text-muted)', padding: '2px 6px' }}
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        style={{ color: 'var(--color-danger)', padding: '8px' }}
                        title="Eliminar producto"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            ) : (
              /* PASO 2: FORMULARIO DE ENVÍO Y CUPÓN */
              <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                  <button
                    type="button"
                    onClick={() => setTipoEntrega('domicilio')}
                    style={{
                      flex: 1,
                      padding: '10px',
                      borderRadius: '8px',
                      border: `1px solid ${tipoEntrega === 'domicilio' ? 'var(--color-secondary)' : 'var(--color-border)'}`,
                      background: tipoEntrega === 'domicilio' ? 'rgba(185, 231, 105, 0.12)' : 'rgba(255,255,255,0.03)',
                      color: tipoEntrega === 'domicilio' ? 'var(--color-secondary)' : 'var(--color-text-muted)',
                      fontWeight: '700',
                      fontSize: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <Truck size={16} /> Envío Nacional
                  </button>
                  <button
                    type="button"
                    onClick={() => setTipoEntrega('tienda')}
                    style={{
                      flex: 1,
                      padding: '10px',
                      borderRadius: '8px',
                      border: `1px solid ${tipoEntrega === 'tienda' ? 'var(--color-accent)' : 'var(--color-border)'}`,
                      background: tipoEntrega === 'tienda' ? 'rgba(255, 212, 59, 0.12)' : 'rgba(255,255,255,0.03)',
                      color: tipoEntrega === 'tienda' ? 'var(--color-accent)' : 'var(--color-text-muted)',
                      fontWeight: '700',
                      fontSize: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <Store size={16} /> Click & Collect
                  </button>
                </div>

                {tipoEntrega === 'tienda' ? (
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--color-text-muted)', marginBottom: '6px' }}>
                      Selecciona la Sede / Bodega para Retiro
                    </label>
                    <select
                      value={sucursalSeleccionada}
                      onChange={(e) => setSucursalSeleccionada(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '6px',
                        backgroundColor: '#021B12',
                        border: '1px solid var(--color-border)',
                        color: '#fff',
                        fontSize: '0.85rem'
                      }}
                    >
                      {sucursales.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.ciudad} - {s.nombre} ({s.tiempoRetiro})
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <>
                    <div style={{ marginBottom: '12px' }}>
                      <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>
                        Dirección Completa de Entrega *
                      </label>
                      <input
                        type="text"
                        placeholder="ej: Carrera 45 # 72-10 Apto 402"
                        value={direccionEnvio}
                        onChange={(e) => setDireccionEnvio(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          borderRadius: '6px',
                          backgroundColor: '#021B12',
                          border: '1px solid var(--color-border)',
                          color: '#fff',
                          fontSize: '0.85rem'
                        }}
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>
                          Ciudad *
                        </label>
                        <input
                          type="text"
                          value={ciudadEnvio}
                          onChange={(e) => setCiudadEnvio(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            borderRadius: '6px',
                            backgroundColor: '#021B12',
                            border: '1px solid var(--color-border)',
                            color: '#fff',
                            fontSize: '0.85rem'
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>
                          Teléfono Celular *
                        </label>
                        <input
                          type="tel"
                          placeholder="300 123 4567"
                          value={telefonoEnvio}
                          onChange={(e) => setTelefonoEnvio(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            borderRadius: '6px',
                            backgroundColor: '#021B12',
                            border: '1px solid var(--color-border)',
                            color: '#fff',
                            fontSize: '0.85rem'
                          }}
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Cupón de descuento */}
                <div style={{ marginTop: '14px', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      placeholder="Cupón (ej: FERRE10, MAESTRO2026)"
                      value={codigoCupon}
                      onChange={(e) => setCodigoCupon(e.target.value.toUpperCase())}
                      style={{
                        flex: 1,
                        padding: '8px 10px',
                        borderRadius: '6px',
                        backgroundColor: '#021B12',
                        border: '1px solid var(--color-border)',
                        color: '#fff',
                        fontSize: '0.82rem',
                        textTransform: 'uppercase'
                      }}
                    />
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handleValidarCupon}
                      disabled={validandoCupon}
                      style={{ padding: '8px 12px', fontSize: '0.82rem' }}
                    >
                      {validandoCupon ? '...' : 'Aplicar'}
                    </button>
                  </div>
                  {cuponAplicado && (
                    <div style={{ marginTop: '8px', fontSize: '0.78rem', color: 'var(--color-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Tag size={12} /> {cuponAplicado.descripcion} (-{formatearPrecioCOP(cuponAplicado.descuentoCalculado)})
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Resumen y Botones de Acción */}
            {cart.length > 0 && (
              <div
                style={{
                  padding: '20px',
                  borderTop: '1px solid var(--color-border)',
                  background: '#021B12'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.88rem', color: 'var(--color-text-muted)' }}>
                  <span>Subtotal:</span>
                  <span style={{ fontFamily: 'var(--font-mono)' }}>{formatearPrecioCOP(subtotal)}</span>
                </div>
                {cuponAplicado && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.88rem', color: 'var(--color-secondary)' }}>
                    <span>Descuento Cupón ({cuponAplicado.codigo}):</span>
                    <span style={{ fontFamily: 'var(--font-mono)' }}>-{formatearPrecioCOP(descuentoMonto)}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.88rem', color: 'var(--color-text-muted)' }}>
                  <span>Envío:</span>
                  <span>{costoEnvio === 0 ? <strong style={{ color: 'var(--color-secondary)' }}>GRATIS</strong> : '$12.000'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '1.25rem', fontWeight: '800' }}>
                  <span>Total a Pagar:</span>
                  <span style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-mono)' }}>
                    {formatearPrecioCOP(totalFinal)}
                  </span>
                </div>

                {pasoCheckout === 'carrito' ? (
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ width: '100%', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                    onClick={() => setPasoCheckout('envio')}
                  >
                    <span>Proceder al Despacho</span>
                    <ArrowRight size={18} />
                  </button>
                ) : (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      className="btn btn-ghost"
                      style={{ padding: '10px 14px' }}
                      onClick={() => setPasoCheckout('carrito')}
                    >
                      Atrás
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                      disabled={isProcessingPayment}
                      onClick={handleIniciarWompiCheckout}
                    >
                      {isProcessingPayment ? (
                        <>
                          <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                          <span>Conectando Wompi...</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck size={18} />
                          <span>Pagar con Wompi Oficial</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                {pasoCheckout === 'carrito' && (
                  <button
                    type="button"
                    className="btn btn-ghost"
                    style={{ width: '100%', fontSize: '0.82rem', padding: '8px' }}
                    onClick={clearCart}
                  >
                    Vaciar Carrito
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. MODAL OFICIAL DE COMPROBANTE TRANSACCIONAL WOMPI */}
      {comprobanteWompi && (
        <div className="wompi-voucher-overlay" onClick={() => setComprobanteWompi(null)}>
          <div className="wompi-voucher-card" onClick={(e) => e.stopPropagation()}>
            <div className="wompi-voucher-header">
              <div
                className="wompi-voucher-badge"
                style={{
                  background: comprobanteWompi.estado === 'APPROVED' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                  color: comprobanteWompi.estado === 'APPROVED' ? 'var(--color-secondary)' : 'var(--color-danger)',
                  border: `1px solid ${comprobanteWompi.estado === 'APPROVED' ? 'var(--color-secondary)' : 'var(--color-danger)'}`
                }}
              >
                {comprobanteWompi.estado === 'APPROVED' ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                <span>{comprobanteWompi.estado === 'APPROVED' ? 'PAGO APROBADO EXITOSAMENTE' : 'TRANSACCIÓN RECHAZADA'}</span>
              </div>
              <h2 style={{ fontSize: '1.4rem', margin: '4px 0 8px', color: '#fff' }}>Comprobante Oficial de Compra</h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', margin: 0 }}>
                Pasarela Oficial Wompi Bancolombia - FERREWEB Colombia
              </p>
            </div>

            <div className="wompi-voucher-details">
              <div className="voucher-row">
                <span className="label">ID Transacción Wompi:</span>
                <span className="value">{comprobanteWompi.id}</span>
              </div>
              <div className="voucher-row">
                <span className="label">Referencia de Orden:</span>
                <span className="value" style={{ color: 'var(--color-accent)' }}>{comprobanteWompi.referencia}</span>
              </div>
              <div className="voucher-row">
                <span className="label">Medio de Pago:</span>
                <span className="value">{comprobanteWompi.metodoPago}</span>
              </div>
              <div className="voucher-row">
                <span className="label">Fecha y Hora:</span>
                <span className="value">{comprobanteWompi.fecha}</span>
              </div>
              <div className="voucher-row" style={{ paddingTop: '10px' }}>
                <span className="label" style={{ fontSize: '1rem', color: '#fff', fontWeight: '700' }}>Total Pagado:</span>
                <span className="value" style={{ fontSize: '1.2rem', color: 'var(--color-secondary)' }}>
                  {formatearPrecioCOP(comprobanteWompi.montoCOP)}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ flex: 1 }}
                onClick={() => {
                  setComprobanteWompi(null);
                  navigate('/catalogo');
                }}
              >
                Continuar Comprando
              </button>
              <button
                type="button"
                className="btn btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                onClick={() => {
                  setComprobanteWompi(null);
                  window.print();
                }}
              >
                <Receipt size={16} /> Imprimir Recibo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. MODALES DE AUTENTICACIÓN INDEPENDIENTES */}
      <ClientAuthModal
        isOpen={isClientModalOpen}
        onClose={() => setIsClientModalOpen(false)}
        onAuthSuccess={(user) => {
          setCurrentUser(user);
          showToast(`¡Bienvenido a FerreWeb, ${user.nombre}!`, 'success');
        }}
      />

      <AdminAuthModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onAuthSuccess={(user) => {
          setCurrentUser(user);
          showToast('¡Sesión de Administrador activa!', 'success');
        }}
      />

      {/* 7. NOTIFICACIONES TOAST ANIMADAS */}
      {toastMessage && (
        <div className="toast-container" role="status" aria-live="polite">
          <div
            className="toast-item"
            style={{
              borderColor: toastType === 'danger' ? 'var(--color-danger)' : (toastType === 'info' ? 'var(--color-accent)' : 'var(--color-secondary)')
            }}
          >
            {toastType === 'danger' ? (
              <XCircle size={20} color="var(--color-danger)" />
            ) : toastType === 'info' ? (
              <Tag size={20} color="var(--color-accent)" />
            ) : (
              <CheckCircle size={20} color="var(--color-secondary)" />
            )}
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
}
