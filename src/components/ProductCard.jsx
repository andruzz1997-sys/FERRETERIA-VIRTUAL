import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Eye, Check } from 'lucide-react';
import { formatearPrecioCOP } from '../data/productos';

/**
 * Componente ProductCard: Tarjeta reutilizable para visualización de productos.
 * Muestra imagen, categoría, nombre, descripción, precio en COP, stock y acciones.
 * 
 * @param {Object} props
 * @param {Object} props.producto - Datos del producto
 * @param {Function} props.onAddToCart - Función callback al añadir al carrito
 */
export default function ProductCard({ producto, onAddToCart }) {
  const [agregado, setAgregado] = useState(false);

  // Manejador para añadir al carrito con animación de confirmación
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(producto);
      setAgregado(true);
      setTimeout(() => setAgregado(false), 1500);
    }
  };

  return (
    <article className="product-card">
      {/* Contenedor de Imagen y Badges */}
      <div className="product-image-container">
        <img
          src={producto.imagen}
          alt={producto.nombre}
          loading="lazy"
        />

        {/* Badge de Oferta */}
        {producto.enOferta && (
          <span className="product-badge-offer">
            -{producto.descuento}% OFF
          </span>
        )}

        {/* Badge de Categoría */}
        <span className="product-category-badge">
          {producto.categoria}
        </span>
      </div>

      {/* Contenido Principal de la Tarjeta */}
      <div className="product-content">
        {/* Calificación / Rating */}
        <div className="product-rating">
          <Star size={15} fill="currentColor" />
          <span>{producto.rating.toFixed(1)} / 5.0</span>
        </div>

        {/* Título del Producto */}
        <h3 className="product-name" title={producto.nombre}>
          {producto.nombre}
        </h3>

        {/* Descripción corta */}
        <p className="product-description">
          {producto.descripcion}
        </p>

        {/* Sección de Precios y Stock */}
        <div className="product-pricing">
          <span className="product-price">
            {formatearPrecioCOP(producto.precio)}
          </span>
          {producto.precioAnterior && (
            <span className="product-price-old">
              {formatearPrecioCOP(producto.precioAnterior)}
            </span>
          )}
        </div>

        {/* Estado de Stock */}
        <div className="product-stock-status">
          <span className="ticker-dot"></span>
          <span>{producto.stock} unidades en stock</span>
        </div>

        {/* Botones de Acción */}
        <div className="product-actions">
          <Link
            to={`/producto/${producto.id}`}
            className="btn-detail"
            aria-label={`Ver detalles técnicos de ${producto.nombre}`}
          >
            Ver Detalle
          </Link>

          <button
            type="button"
            className="btn-add-cart"
            onClick={handleAddToCart}
            aria-label={`Añadir ${producto.nombre} al carrito`}
            title="Añadir al carrito"
          >
            {agregado ? (
              <Check size={18} color="#17251B" strokeWidth={3} />
            ) : (
              <ShoppingCart size={18} color="#17251B" />
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
