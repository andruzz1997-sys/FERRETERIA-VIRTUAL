import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  Wrench, 
  Boxes, 
  Pipette, 
  Zap, 
  Paintbrush, 
  ShieldCheck, 
  Truck, 
  Clock, 
  CheckCircle2, 
  Tag
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { productos as defaultProductos, categorias } from '../data/productos';
import { obtenerProductos } from '../services/api';
import heroImage from '../assets/images/ferreweb-hero-tools.jpg';

/**
 * Página Principal (Home) de FERREWEB.
 * Presenta la ferretería, imagen principal, beneficios clave,
 * categorías interactivas y productos en oferta o destacados consumidos desde la API REST.
 */
export default function Home({ onAddToCart }) {
  const navigate = useNavigate();
  const [listaProductos, setListaProductos] = React.useState(defaultProductos);

  // Consumir productos desde el backend API
  React.useEffect(() => {
    obtenerProductos().then((data) => {
      if (data && data.length > 0) {
        setListaProductos(data);
      }
    });
  }, []);

  // Filtrar productos destacados o en oferta para la página principal
  const productosDestacados = listaProductos.slice(0, 4);
  const productosEnOferta = listaProductos.filter((p) => p.enOferta).slice(0, 4);

  // Mapeo de iconos para las categorías
  const getCategoryIcon = (id) => {
    switch (id) {
      case 'Herramientas': return <Wrench size={24} />;
      case 'Materiales': return <Boxes size={24} />;
      case 'Tuberías': return <Pipette size={24} />;
      case 'Electricidad': return <Zap size={24} />;
      case 'Pintura': return <Paintbrush size={24} />;
      case 'Seguridad': return <ShieldCheck size={24} />;
      default: return <Wrench size={24} />;
    }
  };

  return (
    <div className="home-page">
      {/* 1. SECCIÓN HERO / PRESENTACIÓN */}
      <section className="hero-section">
        <div className="container hero-grid">
          {/* Contenido Textual del Hero */}
          <div className="hero-copy">
            <div className="hero-eyebrow">
              <span className="ticker-dot"></span>
              Suministros para obra, hogar y taller industrial
            </div>
            
            <h1 className="hero-title">
              La ferretería que <span className="highlight-yellow">responde</span> cuando la obra <span className="highlight-green">no espera</span>.
            </h1>

            <p className="hero-description">
              Plataforma de abastecimiento integral con precios transparentes en pesos colombianos (COP), 
              catálogo técnico especializado y despacho garantizado a toda Colombia en 24 a 48 horas.
            </p>

            <div className="hero-cta-group">
              <Link to="/catalogo" className="btn btn-primary">
                Explorar Catálogo
                <ArrowRight size={18} />
              </Link>
              <Link to="/catalogo?categoria=Herramientas" className="btn btn-secondary">
                Ver Herramientas
              </Link>
            </div>

            {/* Métricas y Garantías de Confianza */}
            <div className="hero-stats-row">
              <div className="hero-stat-item">
                <strong>100%</strong>
                <span>Precios en COP garantizados</span>
              </div>
              <div className="hero-stat-item">
                <strong>$350.000</strong>
                <span>Envío gratis nacional desde</span>
              </div>
              <div className="hero-stat-item">
                <strong>100% Original</strong>
                <span>Garantía y calidad técnica</span>
              </div>
            </div>
          </div>

          {/* Tarjeta Visual con Imagen Principal */}
          <div className="hero-visual-card">
            <div className="hero-image-wrapper">
              <img
                src={heroImage}
                alt="Herramientas profesionales y suministros de ferretería FERREWEB"
                loading="eager"
              />
              <div className="hero-floating-badge">
                <span className="ticker-dot"></span>
                <span>Inventario Activo</span>
              </div>
            </div>

            <div className="hero-card-footer">
              <div className="hero-feature-pill">
                <h4>01 / DESPACHO RÁPIDO</h4>
                <p>Envíos directos a obra con transportadoras certificadas.</p>
              </div>
              <div className="hero-feature-pill">
                <h4>02 / ASESORÍA EXPERTA</h4>
                <p>Acompañamiento técnico en especificaciones y materiales.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SECCIÓN DE CATEGORÍAS */}
      <section className="categories-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Clasificación Técnica</span>
            <h2 className="section-title">Categorías Especializadas</h2>
            <p className="section-subtitle">
              Encuentra los insumos y equipos específicos para cada fase de tu proyecto de construcción o remodelación.
            </p>
          </div>

          <div className="categories-grid">
            {categorias
              .filter((c) => c.id !== 'todas')
              .map((cat) => (
                <button
                  key={cat.id}
                  className="category-card"
                  onClick={() => navigate(`/catalogo?categoria=${cat.id}`)}
                  type="button"
                >
                  <div className="category-icon-box">
                    {getCategoryIcon(cat.id)}
                  </div>
                  <span className="category-name">{cat.nombre}</span>
                </button>
              ))}
          </div>
        </div>
      </section>

      {/* 3. SECCIÓN DE OFERTAS DESTACADAS */}
      <section style={{ padding: '60px 0', background: 'rgba(7, 38, 27, 0.4)' }}>
        <div className="container">
          <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', textAlign: 'left', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <span className="section-tag">Oportunidades de Ahorro</span>
              <h2 className="section-title">Ofertas Destacadas de la Semana</h2>
              <p className="section-subtitle">Aprovecha descuentos exclusivos en maquinaria, herramientas e insumos de obra.</p>
            </div>
            <Link to="/catalogo" className="btn btn-secondary">
              Ver Todas las Ofertas
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="catalog-grid">
            {productosEnOferta.map((producto) => (
              <ProductCard
                key={producto.id}
                producto={producto}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 4. SECCIÓN DE PRODUCTOS POPULARES */}
      <section style={{ padding: '70px 0' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Los Más Vendidos</span>
            <h2 className="section-title">Productos Recomendados</h2>
            <p className="section-subtitle">Calidad profesional probada por maestros de obra, técnicos y contratistas en Colombia.</p>
          </div>

          <div className="catalog-grid">
            {productosDestacados.map((producto) => (
              <ProductCard
                key={producto.id}
                producto={producto}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <Link to="/catalogo" className="btn btn-primary" style={{ padding: '16px 36px', fontSize: '1.05rem' }}>
              Ir al Catálogo Completo (20 Productos)
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
