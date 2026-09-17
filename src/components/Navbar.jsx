import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  ShoppingCart, 
  Menu, 
  X, 
  Wrench, 
  Package, 
  Home, 
  ShieldCheck, 
  User, 
  LogOut, 
  Settings,
  Shield
} from 'lucide-react';

/**
 * Componente Navbar: Barra de navegación principal de FERREWEB.
 * Permite la navegación entre secciones (Inicio, Catálogo, Admin),
 * muestra el estado del carrito, autenticación de usuario y roles.
 */
export default function Navbar({ 
  cartCount = 0, 
  onOpenCart, 
  currentUser, 
  onOpenClientModal, 
  onOpenAdminModal, 
  onLogout 
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Comprobar si una ruta está activa
  const isActive = (path) => location.pathname === path;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const esAdmin = currentUser && currentUser.rol === 'admin';

  return (
    <>
      {/* Ticker Neón Superior con información y promociones */}
      <div className="top-ticker" aria-label="Anuncios destacados">
        <div className="ticker-track">
          <div className="ticker-item">
            <span className="ticker-dot"></span>
            <strong>⚡ DESPACHO PRIORITARIO:</strong> Envíos a toda Colombia en 24-48 horas
          </div>
          <div className="ticker-item">
            <span className="ticker-dot"></span>
            <strong>🚚 ENVÍO GRATIS:</strong> En compras superiores a $350.000 COP
          </div>
          <div className="ticker-item">
            <span className="ticker-dot"></span>
            <strong>🛠️ GARANTÍA OFICIAL FERREWEB:</strong> Suministros certificados de calidad industrial
          </div>
          <div className="ticker-item">
            <span className="ticker-dot"></span>
            <strong>🔒 PAGOS SEGUROS:</strong> Wompi, Bancolombia, Tarjetas y Nequi
          </div>
          {/* Duplicado para ciclo continuo */}
          <div className="ticker-item">
            <span className="ticker-dot"></span>
            <strong>⚡ DESPACHO PRIORITARIO:</strong> Envíos a toda Colombia en 24-48 horas
          </div>
          <div className="ticker-item">
            <span className="ticker-dot"></span>
            <strong>🚚 ENVÍO GRATIS:</strong> En compras superiores a $350.000 COP
          </div>
        </div>
      </div>

      {/* Header y Navegación Principal */}
      <header className="navbar-header">
        <div className="container navbar-inner">
          {/* Logotipo de FERREWEB */}
          <Link to="/" className="brand-logo" onClick={closeMobileMenu} aria-label="FERREWEB - Ir al inicio">
            <div className="brand-icon">
              <Wrench size={22} strokeWidth={2.5} />
            </div>
            <div className="brand-text">
              FERRE<span>WEB</span>
            </div>
          </Link>

          {/* Enlaces de Navegación de Escritorio */}
          <nav aria-label="Navegación principal">
            <ul className="nav-links-desktop">
              <li>
                <Link
                  to="/"
                  className={`nav-link ${isActive('/') ? 'active' : ''}`}
                >
                  Inicio
                </Link>
              </li>
              <li>
                <Link
                  to="/catalogo"
                  className={`nav-link ${isActive('/catalogo') ? 'active' : ''}`}
                >
                  Catálogo
                </Link>
              </li>
              {esAdmin && (
                <li>
                  <Link
                    to="/admin"
                    className={`nav-link ${isActive('/admin') ? 'active' : ''}`}
                    style={{ color: 'var(--color-accent)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <Shield size={16} />
                    Panel Admin
                  </Link>
                </li>
              )}
            </ul>
          </nav>

          {/* Acciones del Header: Usuario, Carrito y Menú Móvil */}
          <div className="nav-actions" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Gestión de Usuario */}
            {currentUser ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: 'rgba(255,255,255,0.06)',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    border: '1px solid var(--color-border)',
                    fontSize: '0.82rem'
                  }}
                >
                  {esAdmin ? <Shield size={15} color="var(--color-accent)" /> : <User size={15} color="var(--color-secondary)" />}
                  <span style={{ fontWeight: '600', maxWidth: '110px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {currentUser.nombre.split(' ')[0]}
                  </span>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      background: esAdmin ? 'rgba(250, 204, 21, 0.2)' : 'rgba(34, 197, 94, 0.2)',
                      color: esAdmin ? 'var(--color-accent)' : 'var(--color-secondary)',
                      padding: '2px 6px',
                      borderRadius: '10px',
                      fontWeight: '800'
                    }}
                  >
                    {currentUser.rol.toUpperCase()}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={onLogout}
                  title="Cerrar Sesión"
                  style={{
                    background: 'transparent',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text-muted)',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.78rem'
                  }}
                >
                  <LogOut size={14} />
                  <span className="hide-mobile">Salir</span>
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {/* Botón Acceso Clientes (Login y Registro) */}
                <button
                  type="button"
                  onClick={onOpenClientModal}
                  style={{
                    background: 'rgba(34, 197, 94, 0.12)',
                    border: '1px solid var(--color-secondary)',
                    color: 'var(--color-secondary)',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '0.82rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                  title="Ingreso y Registro de Clientes"
                >
                  <User size={15} />
                  <span>Clientes</span>
                </button>

                {/* Botón Acceso Exclusivo Administrador */}
                <button
                  type="button"
                  onClick={onOpenAdminModal}
                  style={{
                    background: 'rgba(250, 204, 21, 0.1)',
                    border: '1px solid var(--color-accent)',
                    color: 'var(--color-accent)',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '0.82rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                  title="Acceso Exclusivo Administrador"
                >
                  <Shield size={15} />
                  <span>Admin</span>
                </button>
              </div>
            )}

            {/* Carrito */}
            <button
              className="btn-cart"
              onClick={onOpenCart}
              type="button"
              aria-label="Abrir carrito de compras"
            >
              <ShoppingCart size={19} />
              <span>Carrito</span>
              <span className="cart-badge" aria-live="polite">
                {cartCount}
              </span>
            </button>

            {/* Menú Hamburguesa en Móvil */}
            <button
              className="mobile-menu-toggle"
              onClick={toggleMobileMenu}
              type="button"
              aria-label={isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>

        {/* Menú Desplegable en Móvil */}
        {isMobileMenuOpen && (
          <div className="mobile-nav-panel">
            <Link
              to="/"
              className={`nav-link ${isActive('/') ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              <Home size={18} style={{ display: 'inline', marginRight: '8px' }} />
              Inicio
            </Link>
            <Link
              to="/catalogo"
              className={`nav-link ${isActive('/catalogo') ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              <Package size={18} style={{ display: 'inline', marginRight: '8px' }} />
              Catálogo de Productos
            </Link>
            {esAdmin && (
              <Link
                to="/admin"
                className={`nav-link ${isActive('/admin') ? 'active' : ''}`}
                onClick={closeMobileMenu}
                style={{ color: 'var(--color-accent)', fontWeight: '700' }}
              >
                <Shield size={18} style={{ display: 'inline', marginRight: '8px' }} />
                Panel de Administración
              </Link>
            )}

            {!currentUser ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '14px' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={() => {
                    closeMobileMenu();
                    onOpenClientModal();
                  }}
                >
                  <User size={18} /> Portal Clientes (Iniciar / Registro)
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={() => {
                    closeMobileMenu();
                    onOpenAdminModal();
                  }}
                >
                  <Shield size={18} /> Acceso Administrador
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="btn btn-ghost"
                style={{ width: '100%', marginTop: '12px', color: 'var(--color-danger)' }}
                onClick={() => {
                  closeMobileMenu();
                  onLogout();
                }}
              >
                <LogOut size={18} /> Cerrar Sesión ({currentUser.nombre})
              </button>
            )}
          </div>
        )}
      </header>
    </>
  );
}
