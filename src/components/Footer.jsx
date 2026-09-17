import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, Phone, Mail, MapPin, Shield, Truck, CreditCard } from 'lucide-react';

/**
 * Componente Footer: Pie de página institucional para FERREWEB.
 * Contiene información de la empresa, enlaces de navegación rápida,
 * métodos de pago seguros y notas de cumplimiento académico SENA.
 */
export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          {/* Columna 1: Identidad Corporativa */}
          <div className="footer-brand">
            <h3>
              FERRE<span>WEB</span>
            </h3>
            <p>
              Plataforma líder en e-commerce y abastecimiento de herramientas,
              materiales de construcción y suministros industriales en Colombia.
            </p>
            <div style={{ display: 'flex', gap: '10px', marginTop: '16px', color: 'var(--color-secondary)' }}>
              <Shield size={20} title="Garantía Certificada" />
              <Truck size={20} title="Despachos Nacionales" />
              <CreditCard size={20} title="Pagos Seguros" />
            </div>
          </div>

          {/* Columna 2: Navegación Rápida */}
          <div className="footer-col">
            <h4>Navegación</h4>
            <ul className="footer-links">
              <li><Link to="/">Inicio</Link></li>
              <li><Link to="/catalogo">Catálogo Completo</Link></li>
              <li><Link to="/catalogo?categoria=Herramientas">Herramientas</Link></li>
              <li><Link to="/catalogo?categoria=Materiales">Materiales de Obra</Link></li>
              <li><Link to="/catalogo?categoria=Electricidad">Electricidad & Redes</Link></li>
            </ul>
          </div>

          {/* Columna 3: Categorías Principales */}
          <div className="footer-col">
            <h4>Categorías</h4>
            <ul className="footer-links">
              <li><Link to="/catalogo?categoria=Tuberías">Tuberías y Plomería</Link></li>
              <li><Link to="/catalogo?categoria=Pintura">Pinturas y Acabados</Link></li>
              <li><Link to="/catalogo?categoria=Seguridad">Seguridad Industrial</Link></li>
              <li><Link to="/catalogo">Ofertas Especiales</Link></li>
            </ul>
          </div>

          {/* Columna 4: Atención & Contacto */}
          <div className="footer-col">
            <h4>Atención al Cliente</h4>
            <ul className="footer-links">
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone size={16} color="var(--color-accent)" />
                <span>+57 (601) 745-9000</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={16} color="var(--color-accent)" />
                <span>contacto@ferreweb.com.co</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={16} color="var(--color-accent)" />
                <span>Bogotá D.C., Colombia</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Barra Inferior de Derechos */}
        <div className="footer-bottom">
          <p>© 2026 FERREWEB. Todos los derechos reservados.</p>
          <p>Ferretería Industrial y del Hogar • Envíos y Suministros a toda Colombia</p>
        </div>
      </div>
    </footer>
  );
}
