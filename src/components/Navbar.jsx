import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, Wrench, Package, Home, ShieldCheck } from 'lucide-react';

/**
 * Componente Navbar: Barra de navegación principal de FERREWEB.
 * Permite la navegación entre secciones (Inicio, Catálogo),
 * muestra el estado del carrito y menú responsivo para dispositivos móviles.
 */
export default function Navbar({ cartCount = 0, onOpenCart }) {
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
            <strong>🛠️ GARANTÍA OFICIAL SENA:</strong> Suministros certificados de uso industrial
          </div>
          <div className="ticker-item">
            <span className="ticker-dot"></span>
            <strong>🔒 PAGOS SEGUROS:</strong> PSE, Tarjetas de Crédito, Nequi y Contra Entrega
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
            </ul>
          </nav>

          {/* Acciones del Header: Carrito y Menú Móvil */}
          <div className="nav-actions">
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
          </div>
        )}
      </header>
    </>
  );
}
