import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
  Shield,
  Search,
  Truck,
  Building2,
  PhoneCall,
  ArrowRight,
  MessageSquare
} from 'lucide-react';
import RastreoModal from './RastreoModal';
import CotizacionModal from './CotizacionModal';

/**
 * Componente Navbar: Barra de navegación principal de FERREWEB.
 * Incluye:
 * - Buscador central integrado con borde neón y placeholder industrial
 * - Enlaces directos: Inicio, Catálogo, Rastrear Pedido, Cotizaciones B2B
 * - Botón de contacto rápido directo por WhatsApp para compras de obra
 * - Autenticación de clientes y administradores con roles
 * - Carrito de compras con badge dinámico
 * - Menú responsive completo para dispositivos móviles
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
  const [searchQuery, setSearchQuery] = useState('');
  const [isRastreoModalOpen, setIsRastreoModalOpen] = useState(false);
  const [isCotizacionModalOpen, setIsCotizacionModalOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // Comprobar si una ruta está activa
  const isActive = (path) => location.pathname === path;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalogo?q=${encodeURIComponent(searchQuery.trim())}`);
      closeMobileMenu();
    }
  };

  const esAdmin = currentUser && currentUser.rol === 'admin';

  return (
    <>
      {/* Ticker Neón Superior con información y promociones */}
      <div className="top-ticker" aria-label="Anuncios destacados">
        <div className="ticker-track">
          <div className="ticker-item">
            <span className="ticker-dot"></span>
            <strong>⚡ DESPACHO PRIORITARIO:</strong> Envíos a toda Colombia en 24-48 horas directamente a obra
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
            <strong>🏗️ ATENCIÓN A CONSTRUCTORAS:</strong> Precios especiales por mayor y cotizaciones B2B
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
          {/* 1. Logotipo de FERREWEB */}
          <Link to="/" className="brand-logo" onClick={closeMobileMenu} aria-label="FERREWEB - Ir al inicio">
            <div className="brand-icon">
              <Wrench size={22} strokeWidth={2.5} />
            </div>
            <div className="brand-text">
              FERRE<span>WEB</span>
            </div>
          </Link>

          {/* 2. Buscador Central Integrado */}
          <form className="navbar-search-form hide-mobile" onSubmit={handleSearchSubmit}>
            <Search size={17} className="navbar-search-icon" />
            <input
              type="text"
              className="navbar-search-input"
              placeholder="Buscar taladros, cemento, tuberías, pintura..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Buscar en catálogo"
            />
            {searchQuery.trim() && (
              <button type="submit" className="navbar-search-submit" title="Buscar">
                <ArrowRight size={14} />
              </button>
            )}
          </form>

          {/* 3. Enlaces de Navegación de Escritorio */}
          <nav aria-label="Navegación principal" className="hide-tablet">
            <ul className="nav-links-desktop">
              <li>
                <Link
                  to="/catalogo"
                  className={`nav-link ${isActive('/catalogo') ? 'active' : ''}`}
                >
                  Catálogo
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setIsRastreoModalOpen(true)}
                  className="nav-link-btn"
                  title="Consultar estado de envío"
                >
                  <Truck size={15} color="var(--color-secondary)" />
                  <span>Rastrear Pedido</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setIsCotizacionModalOpen(true)}
                  className="nav-link-btn"
                  title="Cotización por volumen para constructoras"
                >
                  <Building2 size={15} color="var(--color-accent)" />
                  <span>Cotizaciones B2B</span>
                </button>
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

          {/* 4. Acciones del Header: Contacto WhatsApp, Usuario, Carrito y Móvil */}
          <div className="nav-actions">
            {/* Botón de Contacto Rápido para Compras de Obra */}
            <a
              href="https://wa.me/573001234567?text=Hola%20FerreWeb,%20necesito%20cotizar%20y%20comprar%20materiales%20para%20obra"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-quick-contact hide-mobile"
              title="Contacto directo por WhatsApp para suministros de obra"
            >
              <PhoneCall size={14} />
              <span>Compras Obra</span>
            </a>

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
                  <span style={{ fontWeight: '600', maxWidth: '95px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
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
                {/* Botón Acceso Clientes */}
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
                  className="hide-mobile"
                >
                  <User size={15} />
                  <span>Clientes</span>
                </button>

                {/* Botón Acceso Administrador */}
                <button
                  type="button"
                  onClick={onOpenAdminModal}
                  style={{
                    background: 'rgba(250, 204, 21, 0.1)',
                    border: '1px solid var(--color-accent)',
                    color: 'var(--color-accent)',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '0.82rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                  title="Acceso Exclusivo Administrador"
                  className="hide-mobile"
                >
                  <Shield size={14} />
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
              <span className="hide-mobile">Carrito</span>
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
            {/* Buscador móvil */}
            <form onSubmit={handleSearchSubmit} style={{ position: 'relative', marginBottom: '8px' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-accent)' }} />
              <input
                type="text"
                placeholder="Buscar taladros, cemento, tuberías..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 38px',
                  backgroundColor: '#07261B',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '0.85rem'
                }}
              />
            </form>

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
            <button
              type="button"
              className="nav-link-btn"
              onClick={() => {
                closeMobileMenu();
                setIsRastreoModalOpen(true);
              }}
              style={{ fontSize: '0.95rem', padding: '6px 0', textAlign: 'left', width: '100%' }}
            >
              <Truck size={18} color="var(--color-secondary)" style={{ display: 'inline', marginRight: '8px' }} />
              Rastrear Pedido / Despacho
            </button>
            <button
              type="button"
              className="nav-link-btn"
              onClick={() => {
                closeMobileMenu();
                setIsCotizacionModalOpen(true);
              }}
              style={{ fontSize: '0.95rem', padding: '6px 0', textAlign: 'left', width: '100%' }}
            >
              <Building2 size={18} color="var(--color-accent)" style={{ display: 'inline', marginRight: '8px' }} />
              Cotizaciones B2B para Obra
            </button>

            {/* Enlace WhatsApp directo para compras de obra en móvil */}
            <a
              href="https://wa.me/573001234567?text=Hola%20FerreWeb,%20necesito%20cotizar%20materiales%20para%20obra"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(185, 231, 105, 0.12)',
                border: '1px solid var(--color-secondary)',
                color: 'var(--color-secondary)',
                padding: '10px 14px',
                borderRadius: '8px',
                fontWeight: '700',
                fontSize: '0.9rem',
                marginTop: '4px'
              }}
            >
              <PhoneCall size={18} />
              <span>Compras de Obra (WhatsApp Directo)</span>
            </a>

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

      {/* Modales de Rastreo y Cotizaciones B2B */}
      <RastreoModal
        isOpen={isRastreoModalOpen}
        onClose={() => setIsRastreoModalOpen(false)}
      />

      <CotizacionModal
        isOpen={isCotizacionModalOpen}
        onClose={() => setIsCotizacionModalOpen(false)}
      />
    </>
  );
}
