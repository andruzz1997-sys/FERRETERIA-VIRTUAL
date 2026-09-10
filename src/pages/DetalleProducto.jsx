import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Star, 
  ShoppingCart, 
  Check, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  FileText,
  AlertCircle
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { productos, formatearPrecioCOP } from '../data/productos';

/**
 * Página de Detalle de Producto de FERREWEB.
 * Muestra la ficha técnica completa, características de ingeniería,
 * selector de cantidad, botones de compra y productos relacionados.
 */
export default function DetalleProducto({ onAddToCart }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cantidad, setCantidad] = useState(1);
  const [agregadoExitoso, setAgregadoExitoso] = useState(false);

  // Buscar el producto por su ID
  const producto = productos.find((p) => p.id === parseInt(id, 10));

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

  // Productos relacionados de la misma categoría (excluyendo el actual)
  const productosRelacionados = productos
    .filter((p) => p.categoria === producto.categoria && p.id !== producto.id)
    .slice(0, 3);

  // Manejo del selector de cantidad
  const handleIncrement = () => {
    if (cantidad < producto.stock) {
      setCantidad((prev) => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (cantidad > 1) {
      setCantidad((prev) => prev - 1);
    }
  };

  // Manejar adición al carrito
  const handleAddToCart = () => {
    if (onAddToCart) {
      for (let i = 0; i < cantidad; i++) {
        onAddToCart(producto);
      }
      setAgregadoExitoso(true);
      setTimeout(() => setAgregadoExitoso(false), 2000);
    }
  };

  return (
    <div className="detail-page">
      <div className="container">
        {/* Enlace para regresar */}
        <Link to="/catalogo" className="back-link">
          <ArrowLeft size={18} />
          Volver al Catálogo
        </Link>

        {/* Cuadrícula Principal de Detalle */}
        <div className="detail-grid">
          {/* Columna Izquierda: Galería e Imagen */}
          <div className="detail-gallery">
            <img
              src={producto.imagen}
              alt={producto.nombre}
            />
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
                <span>{producto.rating.toFixed(1)} / 5.0 Calificación Oficial</span>
              </div>
            </div>

            <h1 className="detail-title">{producto.nombre}</h1>

            {/* Caja de Precios */}
            <div className="detail-pricing-box">
              <span className="detail-price">
                {formatearPrecioCOP(producto.precio)}
              </span>
              {producto.precioAnterior && (
                <span className="detail-price-old">
                  {formatearPrecioCOP(producto.precioAnterior)}
                </span>
              )}
            </div>

            {/* Descripción */}
            <p className="detail-desc">{producto.descripcion}</p>

            {/* Especificaciones Técnicas */}
            <div className="specs-box">
              <h4>
                <FileText size={18} />
                Especificaciones & Ficha Técnica
              </h4>
              <ul className="specs-list">
                {producto.caracteristicas && producto.caracteristicas.map((spec, index) => (
                  <li key={index}>{spec}</li>
                ))}
              </ul>
            </div>

            {/* Selector de Cantidad y Stock */}
            <div>
              <label style={{ display: 'block', fontSize: '0.88rem', color: 'var(--color-text-muted)', marginBottom: '8px' }}>
                Cantidad a solicitar ({producto.stock} disponibles en bodega):
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
                  Total: <strong>{formatearPrecioCOP(producto.precio * cantidad)}</strong>
                </span>
              </div>
            </div>

            {/* Botones de Acción */}
            <div className="detail-actions-row">
              <button
                type="button"
                className="btn btn-primary"
                style={{ flex: 1 }}
                onClick={handleAddToCart}
              >
                {agregadoExitoso ? (
                  <>
                    <Check size={20} />
                    ¡Añadido al Carrito!
                  </>
                ) : (
                  <>
                    <ShoppingCart size={20} />
                    Añadir al Carrito ({cantidad})
                  </>
                )}
              </button>
            </div>

            {/* Beneficios adicionales */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginTop: '10px', paddingTop: '16px', borderTop: '1px solid var(--color-border)' }}>
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
