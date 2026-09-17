import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ClientAuthModal from './components/ClientAuthModal';
import AdminAuthModal from './components/AdminAuthModal';
import Home from './pages/Home';
import Catalogo from './pages/Catalogo';
import DetalleProducto from './pages/DetalleProducto';
import Admin from './pages/Admin';
import { formatearPrecioCOP } from './data/productos';
import { crearPago } from './services/api';
import { X, Trash2, Plus, Minus, CheckCircle, ShoppingBag, ArrowRight, Loader2 } from 'lucide-react';

/**
 * Componente Principal App.
 * Maneja el estado global del carrito de compras, el modal lateral (Drawer),
 * la autenticación independiente (Clientes y Admin), pasarela de pago y rutas.
 */
export default function App() {
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

  // Guardar carrito en localStorage en cada cambio
  useEffect(() => {
    try {
      localStorage.setItem('ferreweb_cart', JSON.stringify(cart));
    } catch (e) {
      console.error("Error al guardar carrito en localStorage:", e);
    }
  }, [cart]);

  // Cerrar sesión
  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('ferreweb_user');
    localStorage.removeItem('ferreweb_token');
    showToast('Has cerrado sesión correctamente.');
  };

  // Mostrar mensaje toast temporal
  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Función para agregar un producto al carrito
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
    showToast(`"${producto.nombre}" agregado al carrito.`);
  };

  // Función para incrementar cantidad
  const incrementQuantity = (id, maxStock) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id
          ? { ...item, cantidad: Math.min(item.cantidad + 1, maxStock) }
          : item
      )
    );
  };

  // Función para decrementar cantidad
  const decrementQuantity = (id) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === id ? { ...item, cantidad: item.cantidad - 1 } : item
        )
        .filter((item) => item.cantidad > 0)
    );
  };

  // Función para eliminar un producto del carrito
  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
    showToast('Producto eliminado del carrito.');
  };

  // Vaciar carrito
  const clearCart = () => {
    setCart([]);
    showToast('Carrito vaciado.');
  };

  // Cálculos del Carrito
  const totalItems = cart.reduce((acc, item) => acc + item.cantidad, 0);
  const subtotal = cart.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  const envioGratisMinimo = 350000;
  const faltanteEnvioGratis = Math.max(0, envioGratisMinimo - subtotal);
  const porcentajeEnvio = Math.min(100, Math.round((subtotal / envioGratisMinimo) * 100));

  // Función para procesar el pago y redirigir a pasarela real (Wompi / Mercado Pago)
  const handleFinalizarCompra = async () => {
    if (cart.length === 0) return;
    setIsProcessingPayment(true);
    showToast('Conectando con la pasarela de pagos segura...');

    const costoEnvio = subtotal >= envioGratisMinimo ? 0 : 12000;
    const totalFinal = subtotal + costoEnvio;

    try {
      const resp = await crearPago({
        items: cart,
        total: totalFinal,
        customer: currentUser || { nombre: 'Cliente FerreWeb' }
      });

      if (resp && resp.url) {
        showToast('¡Orden generada! Redirigiendo a Wompi Checkout...');
        setTimeout(() => {
          window.location.href = resp.url;
        }, 800);
      } else {
        throw new Error('No se recibió la URL de la pasarela');
      }
    } catch (err) {
      console.error('Error al procesar pago:', err);
      showToast('Error al conectar con la pasarela: ' + err.message);
      setIsProcessingPayment(false);
    }
  };

  return (
    <div className="app-layout">
      {/* 1. BARRA DE NAVEGACIÓN */}
      <Navbar
        cartCount={totalItems}
        onOpenCart={() => setIsCartOpen(true)}
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

      {/* 4. MODAL DRAWER LATERAL DE CARRITO */}
      {isCartOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(4px)',
            zIndex: 3000,
            display: 'flex',
            justifyContent: 'flex-end'
          }}
          onClick={() => setIsCartOpen(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '460px',
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
                alignItems: 'center'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ShoppingBag size={22} color="var(--color-accent)" />
                <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Tu Carrito ({totalItems})</h3>
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
                  <span style={{ color: 'var(--color-secondary)', fontWeight: '700' }}>
                    🎉 ¡Felicidades! Tienes ENVÍO GRATIS a toda Colombia.
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

            {/* Lista de Productos en el Carrito */}
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
                      <div style={{ fontSize: '0.85rem', color: 'var(--color-accent)', fontWeight: '700' }}>
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

            {/* Resumen y Checkout del Carrito */}
            {cart.length > 0 && (
              <div
                style={{
                  padding: '20px',
                  borderTop: '1px solid var(--color-border)',
                  background: '#021B12'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                  <span>Subtotal:</span>
                  <span>{formatearPrecioCOP(subtotal)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                  <span>Envío:</span>
                  <span>{subtotal >= envioGratisMinimo ? 'GRATIS' : '$12.000'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '18px', fontSize: '1.2rem', fontWeight: '800' }}>
                  <span>Total Estimado:</span>
                  <span style={{ color: 'var(--color-accent)' }}>
                    {formatearPrecioCOP(subtotal + (subtotal >= envioGratisMinimo ? 0 : 12000))}
                  </span>
                </div>

                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ width: '100%', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                  disabled={isProcessingPayment}
                  onClick={handleFinalizarCompra}
                >
                  {isProcessingPayment ? (
                    <>
                      <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                      <span>Conectando Pasarela...</span>
                    </>
                  ) : (
                    <>
                      <span>Finalizar Compra</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  className="btn btn-ghost"
                  style={{ width: '100%', fontSize: '0.82rem', padding: '8px' }}
                  onClick={clearCart}
                >
                  Vaciar Carrito
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. MODALES DE AUTENTICACIÓN INDEPENDIENTES */}
      <ClientAuthModal
        isOpen={isClientModalOpen}
        onClose={() => setIsClientModalOpen(false)}
        onAuthSuccess={(user) => {
          setCurrentUser(user);
          showToast(`¡Bienvenido a FerreWeb, ${user.nombre}!`);
        }}
      />

      <AdminAuthModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onAuthSuccess={(user) => {
          setCurrentUser(user);
          showToast(`¡Sesión de Administrador activa!`);
        }}
      />

      {/* 6. NOTIFICACIONES TOAST */}
      {toastMessage && (
        <div className="toast-container" role="status" aria-live="polite">
          <div className="toast-item">
            <CheckCircle size={20} color="var(--color-secondary)" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
}
