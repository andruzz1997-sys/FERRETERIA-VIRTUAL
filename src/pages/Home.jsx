import React, { useState, useEffect } from 'react';
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
  Percent,
  CheckCircle2, 
  Search,
  Building2,
  HardHat,
  FileText,
  PhoneCall,
  Loader2,
  AlertCircle,
  PackageCheck,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import CotizacionModal from '../components/CotizacionModal';
import { productos as defaultProductos, categorias } from '../data/productos';
import { obtenerProductos, rastrearPedido } from '../services/api';
import heroImage from '../assets/images/ferreweb-hero-tools.jpg';

/**
 * Página Principal (Home) de FERREWEB.
 * Rediseño visual industrial de alto nivel:
 * 1. Hero con 4 tarjetas de beneficios mejoradas (Truck, ShieldCheck, Clock, Percent)
 * 2. Franja de Marcas Aliadas (Brand Trust): DEWALT, BOSCH, STANLEY, MAKITA, SIKA, ARGOS, PAVCO, CORONA, 3M
 * 3. Categorías Especializadas en Glassmorphism con caja amarilla y "Explorar insumos →"
 * 4. Módulo de Rastreo Directo de Pedido en pantalla con consulta a la API
 * 5. Banner de Atención B2B para Constructoras y Maestros de Obra con modal de cotización
 * 6. Ofertas y Productos Destacados
 */
export default function Home({ onAddToCart }) {
  const navigate = useNavigate();
  const [listaProductos, setListaProductos] = useState(defaultProductos);

  // Estados para el Módulo de Rastreo Directo en Home
  const [trackingRef, setTrackingRef] = useState('');
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackingResult, setTrackingResult] = useState(null);
  const [trackingError, setTrackingError] = useState(null);

  // Estado para el Modal B2B desde el Banner
  const [isCotizacionModalOpen, setIsCotizacionModalOpen] = useState(false);

  // Marcas Aliadas Industriales
  const marcasAliadas = [
    { nombre: 'DEWALT', tag: 'Potencia Industrial' },
    { nombre: 'BOSCH', tag: 'Precisión Alemana' },
    { nombre: 'STANLEY', tag: 'Herramienta Robusta' },
    { nombre: 'MAKITA', tag: 'Alto Rendimiento' },
    { nombre: 'SIKA', tag: 'Químicos y Sellos' },
    { nombre: 'ARGOS', tag: 'Cemento y Concreto' },
    { nombre: 'PAVCO', tag: 'Tuberías y Plomería' },
    { nombre: 'CORONA', tag: 'Pinturas y Revestimientos' },
    { nombre: '3M', tag: 'Seguridad Industrial' }
  ];

  // Consumir productos desde el backend API
  useEffect(() => {
    obtenerProductos().then((data) => {
      if (data && data.length > 0) {
        setListaProductos(data);
      }
    });
  }, []);

  // Filtrar productos destacados o en oferta
  const productosDestacados = listaProductos.slice(0, 4);
  const productosEnOferta = listaProductos.filter((p) => p.enOferta).slice(0, 4);

  // Mapeo de iconos para las categorías
  const getCategoryIcon = (id) => {
    switch (id) {
      case 'Herramientas': return <Wrench size={24} color="#17251B" strokeWidth={2.4} />;
      case 'Materiales': return <Boxes size={24} color="#17251B" strokeWidth={2.4} />;
      case 'Tuberías': return <Pipette size={24} color="#17251B" strokeWidth={2.4} />;
      case 'Electricidad': return <Zap size={24} color="#17251B" strokeWidth={2.4} />;
      case 'Pintura': return <Paintbrush size={24} color="#17251B" strokeWidth={2.4} />;
      case 'Seguridad': return <ShieldCheck size={24} color="#17251B" strokeWidth={2.4} />;
      default: return <Wrench size={24} color="#17251B" strokeWidth={2.4} />;
    }
  };

  // Consultar rastreo en vivo
  const handleConsultarRastreo = async (e) => {
    if (e) e.preventDefault();
    const ref = trackingRef.trim().toUpperCase();
    if (!ref) {
      setTrackingError('Ingresa el número de referencia o guía para consultar.');
      return;
    }

    setTrackingLoading(true);
    setTrackingError(null);
    setTrackingResult(null);

    try {
      const data = await rastrearPedido(ref);
      if (data && data.success !== false) {
        setTrackingResult(data);
      } else {
        setTrackingError(data.message || 'No se encontró información con esa referencia.');
      }
    } catch (err) {
      setTrackingError(err.message || 'Error al conectar con la central logística.');
    } finally {
      setTrackingLoading(false);
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
              Suministros certificados para obra, infraestructura y taller
            </div>
            
            <h1 className="hero-title">
              La ferretería que <span className="highlight-yellow">responde</span> cuando la obra <span className="highlight-green">no espera</span>.
            </h1>

            <p className="hero-description">
              Plataforma de abastecimiento integral con precios transparentes en pesos colombianos (COP), 
              catálogo técnico especializado, atención B2B por volumen y despacho garantizado a toda Colombia en 24 a 48 horas.
            </p>

            <div className="hero-cta-group">
              <Link to="/catalogo" className="btn btn-primary">
                Explorar Catálogo
                <ArrowRight size={18} />
              </Link>
              <button 
                type="button" 
                onClick={() => setIsCotizacionModalOpen(true)}
                className="btn btn-secondary"
              >
                <Building2 size={16} /> Cotizar por Volumen
              </button>
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
                <strong>24-48 hrs</strong>
                <span>Despacho directo a obra</span>
              </div>
            </div>
          </div>

          {/* Tarjeta Visual con Imagen Principal y Beneficios Mejorados */}
          <div className="hero-visual-card">
            <div className="hero-image-wrapper">
              <img
                src={heroImage}
                alt="Herramientas profesionales y suministros de ferretería FERREWEB"
                loading="eager"
              />
              <div className="hero-floating-badge">
                <span className="ticker-dot"></span>
                <span>Inventario Activo en Bodega</span>
              </div>
            </div>

            {/* 5. Tarjetas de Beneficios Mejoradas con Lucide React (Truck, ShieldCheck, Clock, Percent) */}
            <div className="hero-benefits-grid">
              <div className="hero-benefit-item">
                <div className="hero-benefit-icon yellow">
                  <Truck size={20} />
                </div>
                <div>
                  <h4>Despacho a Obra</h4>
                  <p>Camiones y furgones en 24 a 48 hrs a nivel nacional.</p>
                </div>
              </div>

              <div className="hero-benefit-item">
                <div className="hero-benefit-icon lime">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h4>Garantía 100% Oficial</h4>
                  <p>Insumos y maquinaria con respaldo de fábrica.</p>
                </div>
              </div>

              <div className="hero-benefit-item">
                <div className="hero-benefit-icon yellow">
                  <Clock size={20} />
                </div>
                <div>
                  <h4>Cotización en 2 Horas</h4>
                  <p>Respuesta técnica rápida para listas de compras.</p>
                </div>
              </div>

              <div className="hero-benefit-item">
                <div className="hero-benefit-icon lime">
                  <Percent size={20} />
                </div>
                <div>
                  <h4>Precios Mayoristas</h4>
                  <p>Descuentos escalonados para constructoras y maestros.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FRANJA DE MARCAS ALIADAS (BRAND TRUST) */}
      <section className="brand-trust-section">
        <div className="container">
          <div className="brand-trust-header">
            <div className="brand-trust-line"></div>
            <span className="brand-trust-title">
              MARCAS ALIADAS & SUMINISTROS INDUSTRIALES DE CONFIANZA
            </span>
            <div className="brand-trust-line"></div>
          </div>

          <div className="brand-trust-grid">
            {marcasAliadas.map((marca, idx) => (
              <div key={idx} className="brand-trust-card" title={`${marca.nombre} - ${marca.tag}`}>
                <span className="brand-name-text">{marca.nombre}</span>
                <span className="brand-tag-text">{marca.tag}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. SECCIÓN DE CATEGORÍAS REDISEÑADA (GLASSMORPHISM CON CAJA AMARILLA) */}
      <section className="categories-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Clasificación Técnica</span>
            <h2 className="section-title">Categorías Especializadas</h2>
            <p className="section-subtitle">
              Suministros certificados, maquinaria y materiales clasificados por especialidad técnica para tu proyecto.
            </p>
          </div>

          <div className="categories-enhanced-grid">
            {categorias
              .filter((c) => c.id !== 'todas')
              .map((cat) => (
                <div
                  key={cat.id}
                  className="category-card-enhanced"
                  onClick={() => navigate(`/catalogo?categoria=${cat.id}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') navigate(`/catalogo?categoria=${cat.id}`);
                  }}
                >
                  <div className="category-icon-box-yellow">
                    {getCategoryIcon(cat.id)}
                  </div>
                  <div className="category-info">
                    <h3 className="category-title-bold">{cat.nombre}</h3>
                    <span className="category-explore-link">
                      Explorar insumos <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* 4. MÓDULO DE RASTREO DE PEDIDO DIRECTO EN PANTALLA */}
      <section className="live-tracking-section">
        <div className="container">
          <div className="live-tracking-container">
            <div className="live-tracking-header">
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--color-secondary)', fontSize: '0.82rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
                <Truck size={17} />
                <span>Central Logística en Vivo</span>
              </div>
              <h2 style={{ fontSize: '1.9rem', fontWeight: '800', color: '#fff', marginBottom: '10px' }}>
                Rastrear Estado de Pedido y Guía de Obra
              </h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', maxWidth: '620px', margin: '0 auto' }}>
                Ingresa la referencia de tu orden para consultar en tiempo real el vehículo de transporte, la guía y el itinerario de entrega.
              </p>
            </div>

            {/* Input y Botón de Consulta */}
            <form onSubmit={handleConsultarRastreo} className="live-tracking-form">
              <div className="live-tracking-input-wrapper">
                <Search size={18} className="input-search-icon" />
                <input
                  type="text"
                  placeholder="Escribe tu referencia (ej: FERREWEB-884210)..."
                  value={trackingRef}
                  onChange={(e) => setTrackingRef(e.target.value.toUpperCase())}
                  className="live-tracking-input"
                />
              </div>
              <button 
                type="submit" 
                disabled={trackingLoading}
                className="btn btn-primary"
                style={{ minWidth: '150px' }}
              >
                {trackingLoading ? (
                  <>
                    <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                    <span>Consultando...</span>
                  </>
                ) : (
                  <>
                    <Search size={16} />
                    <span>Rastrear Guía</span>
                  </>
                )}
              </button>
            </form>

            {/* Accesos rápidos de prueba */}
            <div className="live-tracking-quick-test">
              <span>Probar referencias de muestra:</span>
              <button
                type="button"
                onClick={() => {
                  setTrackingRef('FERREWEB-884210');
                  setTrackingError(null);
                }}
                className="quick-ref-btn"
              >
                FERREWEB-884210
              </button>
              <button
                type="button"
                onClick={() => {
                  setTrackingRef('FERREWEB-991203');
                  setTrackingError(null);
                }}
                className="quick-ref-btn"
              >
                FERREWEB-991203
              </button>
            </div>

            {/* Error de Rastreo */}
            {trackingError && (
              <div className="tracking-error-box">
                <AlertCircle size={18} />
                <span>{trackingError}</span>
              </div>
            )}

            {/* Panel de Resultados del Rastreo */}
            {trackingResult && (
              <div className="tracking-result-card">
                <div className="tracking-result-top">
                  <div>
                    <span className="tracking-label">Orden / Referencia</span>
                    <h3 className="tracking-ref-title">{trackingResult.referencia}</h3>
                  </div>
                  <div className="tracking-status-badge">
                    <span className="ticker-dot"></span>
                    <span>
                      {trackingResult.estadoActual === 'entregado'
                        ? 'ENTREGADO EN DESTINO'
                        : trackingResult.estadoActual === 'en_camino'
                        ? 'EN CAMIÓN DE RUTA'
                        : 'EN PREPARACIÓN EN BODEGA CENTRAL'}
                    </span>
                  </div>
                </div>

                <div className="tracking-meta-grid">
                  <div className="tracking-meta-col">
                    <span className="meta-col-label">Transportadora Asignada</span>
                    <strong className="meta-col-value highlight-lime">{trackingResult.transportadora}</strong>
                  </div>
                  <div className="tracking-meta-col">
                    <span className="meta-col-label">Número de Guía</span>
                    <strong className="meta-col-value font-mono highlight-yellow">{trackingResult.guia}</strong>
                  </div>
                  <div className="tracking-meta-col">
                    <span className="meta-col-label">Tiempo Estimado</span>
                    <strong className="meta-col-value">{trackingResult.fechaEstimada || '24 a 48 horas hábiles'}</strong>
                  </div>
                  <div className="tracking-meta-col">
                    <span className="meta-col-label">Destino</span>
                    <strong className="meta-col-value">{trackingResult.destino || 'Colombia'}</strong>
                  </div>
                </div>

                {/* Eventos / Timeline */}
                <div className="tracking-events-list">
                  <h4 style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Bitácora de Despacho y Entrega
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {(trackingResult.eventos || [
                      { estado: 'Orden recibida en plataforma FerreWeb', completado: true },
                      { estado: 'Pago confirmado por pasarela oficial Wompi', completado: true },
                      { estado: 'Materiales embalados en bodega principal', completado: true }
                    ]).map((ev, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <CheckCircle2 size={16} color="var(--color-secondary)" />
                        <span style={{ fontSize: '0.86rem', color: '#fff', fontWeight: '600' }}>{ev.estado}</span>
                        {ev.fecha && (
                          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', marginLeft: 'auto', fontFamily: 'var(--font-mono)' }}>
                            {new Date(ev.fecha).toLocaleDateString('es-CO')}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 5. BANNER PARA CONTRATISTAS Y MAESTROS DE OBRA (B2B) */}
      <section className="b2b-contractor-section">
        <div className="container">
          <div className="b2b-contractor-card">
            <div className="b2b-contractor-content">
              <div className="b2b-badge">
                <HardHat size={16} />
                <span>Atención Corporativa & Constructoras</span>
              </div>

              <h2 className="b2b-title">
                Suministro por Volumen para Constructoras y Maestros de Obra
              </h2>

              <p className="b2b-description">
                ¿Manejas proyectos residenciales, comerciales o de infraestructura? Ofrecemos precios mayoristas escalonados, 
                asesoría técnica certificada en especificaciones de materiales y despacho prioritario en camión grúa directo a pie de obra.
              </p>

              <div className="b2b-benefits-row">
                <div className="b2b-benefit-point">
                  <CheckCircle2 size={18} color="var(--color-secondary)" />
                  <span>Descuentos mayoristas por volumen</span>
                </div>
                <div className="b2b-benefit-point">
                  <CheckCircle2 size={18} color="var(--color-secondary)" />
                  <span>Despacho en camión de carga pesada</span>
                </div>
                <div className="b2b-benefit-point">
                  <CheckCircle2 size={18} color="var(--color-secondary)" />
                  <span>Facturación electrónica DIAN inmediata</span>
                </div>
                <div className="b2b-benefit-point">
                  <CheckCircle2 size={18} color="var(--color-secondary)" />
                  <span>Ejecutivo de cuenta técnico asignado</span>
                </div>
              </div>

              <div className="b2b-action-row">
                <button
                  type="button"
                  onClick={() => setIsCotizacionModalOpen(true)}
                  className="btn btn-primary"
                  style={{ padding: '14px 28px', fontSize: '1rem' }}
                >
                  <FileText size={18} />
                  <span>Solicitar Cotización por Volumen</span>
                </button>

                <a
                  href="https://wa.me/573001234567?text=Hola%20FerreWeb,%20necesito%20atenci%C3%B3n%20para%20constructora%20y%20cotizaci%C3%B3n%20por%20volumen"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                  style={{ padding: '14px 24px', fontSize: '0.95rem' }}
                >
                  <PhoneCall size={16} />
                  <span>Hablar con Asesor de Obra</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. SECCIÓN DE OFERTAS DESTACADAS */}
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

      {/* 7. SECCIÓN DE PRODUCTOS RECOMENDADOS */}
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

      {/* Modal B2B activable desde el Banner */}
      <CotizacionModal
        isOpen={isCotizacionModalOpen}
        onClose={() => setIsCotizacionModalOpen(false)}
      />
    </div>
  );
}
