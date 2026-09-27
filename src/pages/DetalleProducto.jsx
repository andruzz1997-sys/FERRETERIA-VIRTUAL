import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Star, 
  ShoppingCart, 
  Check, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  FileText,
  AlertCircle,
  MessageSquare,
  Award,
  Send,
  CheckCircle2,
  Clock
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { productos as defaultProductos, formatearPrecioCOP } from '../data/productos';
import { obtenerProductos, obtenerResenas, agregarResena } from '../services/api';

/**
 * Página de Detalle de Producto de FERREWEB.
 * Incluye ficha técnica completa, características de ingeniería,
 * selector de cantidad y sección inferior con 3 pestañas:
 * 1. Especificaciones Técnicas (fuente monoespaciada JetBrains Mono)
 * 2. Garantía Oficial y Políticas de Envío
 * 3. Reseñas de Clientes y Calificación Dinámica (Social Proof)
 * Evidencia: SENA GA7-220501096-AA5-EV03
 */
export default function DetalleProducto({ onAddToCart }) {
  const { id } = useParams();
  const productoId = parseInt(id, 10);

  const [producto, setProducto] = useState(() => {
    return defaultProductos.find((p) => p.id === productoId) || null;
  });
  const [todosLosProductos, setTodosLosProductos] = useState(defaultProductos);
  const [cantidad, setCantidad] = useState(1);
  const [agregadoExitoso, setAgregadoExitoso] = useState(false);

  // Pestañas inferiores
  const [activeTab, setActiveTab] = useState('especificaciones'); // 'especificaciones' | 'garantia' | 'resenas'

  // Reseñas dinámicas (Social Proof)
  const [resenasData, setResenasData] = useState({ totalResenas: 0, promedioEstrellas: 5.0, resenas: [] });
  const [loadingResenas, setLoadingResenas] = useState(false);
  const [formNombre, setFormNombre] = useState('');
  const [formRating, setFormRating] = useState(5);
  const [formComentario, setFormComentario] = useState('');
  const [mensajeResena, setMensajeResena] = useState(null);
  const [enviandoResena, setEnviandoResena] = useState(false);

  // Cargar catálogo y producto
  useEffect(() => {
    obtenerProductos().then((data) => {
      if (data && data.length > 0) {
        setTodosLosProductos(data);
        const encontrado = data.find((p) => p.id === productoId);
        if (encontrado) setProducto(encontrado);
      }
    });
  }, [productoId]);

  // Cargar reseñas del producto
  const cargarResenas = () => {
    if (!productoId) return;
    setLoadingResenas(true);
    obtenerResenas(productoId).then((data) => {
      if (data) {
        setResenasData(data);
      }
    }).finally(() => {
      setLoadingResenas(false);
    });
  };

  useEffect(() => {
    cargarResenas();
    window.scrollTo(0, 0);
  }, [productoId]);

  // Si no existe el producto
  if (!producto) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <AlertCircle size={56} color="var(--color-danger)" style={{ margin: '0 auto 16px' }} />
        <h2>Producto No Encontrado</h2>
        <p style={{ color: 'var(--color-text-muted)', margin: '12px 0 24px' }}>
          El artículo que buscas no existe o ha sido retirado del inventario.
        </p>
        <Link to="/catalogo" className="btn btn-primary">
          <ArrowLeft size={18} />
          Volver al Catálogo
        </Link>
      </div>
    );
  }

  // Productos relacionados de la misma categoría
  const productosRelacionados = todosLosProductos
    .filter((p) => p.categoria === producto.categoria && p.id !== producto.id)
    .slice(0, 3);

  // Manejo de cantidad
  const handleIncrement = () => {
    if (cantidad < producto.stock) setCantidad((prev) => prev + 1);
  };

  const handleDecrement = () => {
    if (cantidad > 1) setCantidad((prev) => prev - 1);
  };

  // Añadir al carrito
  const handleAddToCart = () => {
    if (onAddToCart) {
      for (let i = 0; i < cantidad; i++) {
        onAddToCart(producto);
      }
      setAgregadoExitoso(true);
      setTimeout(() => setAgregadoExitoso(false), 2000);
    }
  };

  // Enviar nueva reseña
  const handleSubmitResena = async (e) => {
    e.preventDefault();
    if (!formComentario.trim()) return;

    setEnviandoResena(true);
    try {
      await agregarResena(producto.id, {
        nombre: formNombre.trim() || 'Comprador Industrial',
        calificacion: formRating,
        comentario: formComentario.trim()
      });
      setMensajeResena('¡Gracias por tu reseña! Ha sido publicada exitosamente.');
      setFormComentario('');
      setFormNombre('');
      cargarResenas();
      setTimeout(() => setMensajeResena(null), 4000);
    } catch (err) {
      console.error('Error al enviar reseña:', err);
    } finally {
      setEnviandoResena(false);
    }
  };

  return (
    <div className="detail-page">
      <div className="container">
        {/* Enlace para regresar */}
        <Link to="/catalogo" className="back-link">
          <ArrowLeft size={18} /> Volver al Catálogo
        </Link>

        {/* Cuadrícula Principal de Detalle */}
        <div className="detail-grid">
          {/* Columna Izquierda: Galería e Imagen */}
          <div className="detail-gallery">
            <img src={producto.imagen} alt={producto.nombre} />
            {producto.enOferta && (
              <span className="product-badge-offer">
                -{producto.descuento}% OFERTA
              </span>
            )}
          </div>

          {/* Columna Derecha: Información Técnica y Compra */}
          <div className="detail-info">
            <div className="detail-badge-row">
              <span className="product-category-badge" style={{ position: 'static' }}>
                {producto.categoria}
              </span>
              <div className="product-rating">
                <Star size={16} fill="currentColor" />
                <span>
                  {(resenasData.promedioEstrellas || producto.rating).toFixed(1)} / 5.0 ({resenasData.totalResenas || 1} opiniones)
                </span>
              </div>
            </div>

            <h1 className="detail-title">{producto.nombre}</h1>

            <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)', marginBottom: '12px' }}>
              SKU: FW-{String(producto.id).padStart(4, '0')} &middot; Disponibilidad: <strong>{producto.stock} uds en bodega</strong>
            </div>

            {/* Caja de Precios */}
            <div className="detail-pricing-box">
              <span className="detail-price" style={{ fontFamily: 'var(--font-mono)' }}>
                {formatearPrecioCOP(producto.precio)}
              </span>
              {producto.precioAnterior && (
                <span className="detail-price-old" style={{ fontFamily: 'var(--font-mono)' }}>
                  {formatearPrecioCOP(producto.precioAnterior)}
                </span>
              )}
            </div>

            <p className="detail-desc">{producto.descripcion}</p>

            {/* Selector de Cantidad y Stock */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '8px' }}>
                Cantidad a solicitar:
              </label>
              <div className="quantity-control">
                <div className="qty-btn-group">
                  <button
                    type="button"
                    className="qty-btn"
                    onClick={handleDecrement}
                    disabled={cantidad <= 1}
                    aria-label="Disminuir cantidad"
                  >
                    -
                  </button>
                  <span className="qty-val">{cantidad}</span>
                  <button
                    type="button"
                    className="qty-btn"
                    onClick={handleIncrement}
                    disabled={cantidad >= producto.stock}
                    aria-label="Aumentar cantidad"
                  >
                    +
                  </button>
                </div>

                <span style={{ fontSize: '0.9rem', color: 'var(--color-secondary)' }}>
                  Total: <strong style={{ fontFamily: 'var(--font-mono)' }}>{formatearPrecioCOP(producto.precio * cantidad)}</strong>
                </span>
              </div>
            </div>

            {/* Botón de Añadir al Carrito */}
            <div className="detail-actions-row">
              <button
                type="button"
                className="btn btn-primary"
                style={{ flex: 1 }}
                onClick={handleAddToCart}
              >
                {agregadoExitoso ? (
                  <>
                    <Check size={20} /> ¡Añadido al Carrito!
                  </>
                ) : (
                  <>
                    <ShoppingCart size={20} /> Añadir al Carrito ({cantidad})
                  </>
                )}
              </button>
            </div>

            {/* Beneficios clave */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginTop: '14px', paddingTop: '16px', borderTop: '1px solid var(--color-border)' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', textAlign: 'center' }}>
                <Truck size={18} color="var(--color-secondary)" style={{ margin: '0 auto 4px' }} />
                <span>Despacho 24-48h</span>
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', textAlign: 'center' }}>
                <ShieldCheck size={18} color="var(--color-secondary)" style={{ margin: '0 auto 4px' }} />
                <span>Garantía de Fábrica</span>
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', textAlign: 'center' }}>
                <RotateCcw size={18} color="var(--color-secondary)" style={{ margin: '0 auto 4px' }} />
                <span>Cambios Fáciles</span>
              </div>
            </div>
          </div>
        </div>

        {/* ====================================================================
            SECCIÓN INFERIOR TABULADA: ESPECIFICACIONES, GARANTÍA Y RESEÑAS
            ==================================================================== */}
        <section style={{ marginTop: '50px' }}>
          <div className="industrial-tabs" role="tablist">
            <button
              type="button"
              className={`industrial-tab ${activeTab === 'especificaciones' ? 'active' : ''}`}
              onClick={() => setActiveTab('especificaciones')}
            >
              <FileText size={18} /> Especificaciones Técnicas
            </button>
            <button
              type="button"
              className={`industrial-tab ${activeTab === 'garantia' ? 'active' : ''}`}
              onClick={() => setActiveTab('garantia')}
            >
              <Award size={18} /> Garantía Oficial & Envíos
            </button>
            <button
              type="button"
              className={`industrial-tab ${activeTab === 'resenas' ? 'active' : ''}`}
              onClick={() => setActiveTab('resenas')}
            >
              <MessageSquare size={18} /> Reseñas de Clientes ({resenasData.totalResenas || 1})
            </button>
          </div>

          {/* TAB 1: ESPECIFICACIONES TÉCNICAS (JetBrains Mono) */}
          {activeTab === 'especificaciones' && (
            <div style={{ background: '#07261B', padding: '24px', borderRadius: '10px', border: '1px solid var(--color-border)' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={20} color="var(--color-accent)" /> Ficha de Ingeniería y Conformidad
              </h3>

              <table className="tech-spec-table">
                <tbody>
                  <tr>
                    <th>Código SKU</th>
                    <td>FW-{String(producto.id).padStart(4, '0')}</td>
                  </tr>
                  <tr>
                    <th>Categoría Principal</th>
                    <td>{producto.categoria}</td>
                  </tr>
                  <tr>
                    <th>Régimen de Uso</th>
                    <td>Industrial Pesado / Profesional Continuo</td>
                  </tr>
                  <tr>
                    <th>Disponibilidad en Bodega</th>
                    <td>{producto.stock} unidades listas para despacho inmediato</td>
                  </tr>
                  <tr>
                    <th>Norma Técnica / Certificación</th>
                    <td>Cumplimiento RETIE / NTC ICONTEC / ANSI Standard</td>
                  </tr>
                  <tr>
                    <th>Garantía Directa</th>
                    <td>24 Meses contra defectos de manufactura</td>
                  </tr>
                </tbody>
              </table>

              <div style={{ marginTop: '20px' }}>
                <h4 style={{ fontSize: '0.95rem', color: 'var(--color-secondary)', marginBottom: '8px' }}>
                  Características Adicionales de Fábrica:
                </h4>
                <ul style={{ paddingLeft: '20px', fontSize: '0.88rem', color: 'var(--color-text-muted)', lineHeight: '1.8' }}>
                  {producto.caracteristicas ? (
                    producto.caracteristicas.map((c, i) => <li key={i}>{c}</li>)
                  ) : (
                    <li>Suministro probado en obras de alta exigencia estructural.</li>
                  )}
                </ul>
              </div>
            </div>
          )}

          {/* TAB 2: GARANTÍA Y ENVÍOS */}
          {activeTab === 'garantia' && (
            <div style={{ background: '#07261B', padding: '28px', borderRadius: '10px', border: '1px solid var(--color-border)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                <div style={{ padding: '20px', background: '#021B12', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                  <Award size={32} color="var(--color-accent)" style={{ marginBottom: '12px' }} />
                  <h4 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Sello de Garantía Industrial (2 Años)</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: '1.6' }}>
                    Todos nuestros insumos y herramientas cuentan con respaldo oficial de fábrica. Respaldamos repuestos originales, servicio técnico directo en Colombia y reposición inmediata ante cualquier falla técnica.
                  </p>
                </div>

                <div style={{ padding: '20px', background: '#021B12', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                  <Truck size={32} color="var(--color-secondary)" style={{ marginBottom: '12px' }} />
                  <h4 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Políticas de Despacho Nacional</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: '1.6' }}>
                    Entregas prioritarias en 24 a 48 horas en Bogotá, Medellín, Cali, Barranquilla, Bucaramanga y principales cabeceras municipales. Envío completamente <strong>GRATIS</strong> en compras superiores a $350.000 COP.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: RESEÑAS DE CLIENTES Y CALIFICACIÓN DINÁMICA */}
          {activeTab === 'resenas' && (
            <div style={{ background: '#07261B', padding: '28px', borderRadius: '10px', border: '1px solid var(--color-border)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '28px', marginBottom: '28px' }}>
                {/* Desglose de Puntuación */}
                <div style={{ padding: '20px', background: '#021B12', borderRadius: '8px', border: '1px solid var(--color-border)', textAlign: 'center' }}>
                  <div style={{ fontSize: '3rem', fontWeight: '800', color: 'var(--color-accent)', fontFamily: 'var(--font-mono)' }}>
                    {(resenasData.promedioEstrellas || 5.0).toFixed(1)}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', color: 'var(--color-accent)', margin: '8px 0' }}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={20}
                        fill={s <= Math.round(resenasData.promedioEstrellas || 5) ? 'currentColor' : 'none'}
                      />
                    ))}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                    Basado en {resenasData.totalResenas || 1} opiniones verificadas
                  </div>
                </div>

                {/* Formulario para Dejar Reseña */}
                <div style={{ padding: '20px', background: '#021B12', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                  <h4 style={{ fontSize: '1rem', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MessageSquare size={18} color="var(--color-secondary)" /> Califica este suministro
                  </h4>

                  {mensajeResena && (
                    <div style={{ background: 'rgba(34, 197, 94, 0.2)', border: '1px solid var(--color-secondary)', color: '#86EFAC', padding: '8px 12px', borderRadius: '6px', fontSize: '0.82rem', marginBottom: '12px' }}>
                      {mensajeResena}
                    </div>
                  )}

                  <form onSubmit={handleSubmitResena}>
                    <div style={{ marginBottom: '10px' }}>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>
                        Puntuación:
                      </label>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setFormRating(star)}
                            style={{ color: star <= formRating ? 'var(--color-accent)' : 'var(--color-text-muted)', padding: '2px' }}
                          >
                            <Star size={22} fill={star <= formRating ? 'currentColor' : 'none'} />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div style={{ marginBottom: '10px' }}>
                      <input
                        type="text"
                        placeholder="Tu nombre o empresa (opcional)"
                        value={formNombre}
                        onChange={(e) => setFormNombre(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 10px',
                          borderRadius: '6px',
                          backgroundColor: '#07261B',
                          border: '1px solid var(--color-border)',
                          color: '#fff',
                          fontSize: '0.82rem'
                        }}
                      />
                    </div>

                    <div style={{ marginBottom: '12px' }}>
                      <textarea
                        rows="2"
                        required
                        placeholder="Escribe tu opinión sobre el rendimiento y calidad del producto..."
                        value={formComentario}
                        onChange={(e) => setFormComentario(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 10px',
                          borderRadius: '6px',
                          backgroundColor: '#07261B',
                          border: '1px solid var(--color-border)',
                          color: '#fff',
                          fontSize: '0.82rem',
                          resize: 'vertical'
                        }}
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-secondary"
                      disabled={enviandoResena}
                      style={{ width: '100%', padding: '8px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                    >
                      <Send size={14} /> {enviandoResena ? 'Publicando...' : 'Publicar Reseña'}
                    </button>
                  </form>
                </div>
              </div>

              {/* Lista de Reseñas de Clientes */}
              <div>
                <h4 style={{ fontSize: '1.05rem', marginBottom: '16px' }}>Comentarios de la Comunidad Profesional</h4>
                {resenasData.resenas && resenasData.resenas.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {resenasData.resenas.map((r, idx) => (
                      <div
                        key={idx}
                        style={{
                          padding: '16px',
                          background: '#021B12',
                          borderRadius: '8px',
                          border: '1px solid rgba(255, 255, 255, 0.06)'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>{r.nombre || 'Comprador Verificado'}</span>
                          <div style={{ display: 'flex', gap: '2px', color: 'var(--color-accent)' }}>
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star key={s} size={14} fill={s <= r.calificacion ? 'currentColor' : 'none'} />
                            ))}
                          </div>
                        </div>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', margin: 0, lineHeight: '1.5' }}>
                          "{r.comentario}"
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: 'var(--color-text-muted)' }}>Aún no hay reseñas registradas para este producto.</p>
                )}
              </div>
            </div>
          )}
        </section>

        {/* Sección de Productos Relacionados */}
        {productosRelacionados.length > 0 && (
          <section style={{ marginTop: '50px' }}>
            <div className="section-header" style={{ textAlign: 'left', marginBottom: '24px' }}>
              <span className="section-tag">Relacionados</span>
              <h2 className="section-title" style={{ fontSize: '1.6rem' }}>
                Productos Similares en {producto.categoria}
              </h2>
            </div>
            <div className="catalog-grid">
              {productosRelacionados.map((rel) => (
                <ProductCard
                  key={rel.id}
                  producto={rel}
                  onAddToCart={onAddToCart}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
