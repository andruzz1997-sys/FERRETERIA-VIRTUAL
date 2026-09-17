import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, ArrowUpDown, PackageX } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { productos as defaultProductos, categorias } from '../data/productos';
import { obtenerProductos } from '../services/api';

/**
 * Página de Catálogo de Productos de FERREWEB.
 * Permite explorar, filtrar por categorías, buscar en tiempo real
 * y ordenar el inventario completo consumido desde la API REST.
 */
export default function Catalogo({ onAddToCart }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoriaParam = searchParams.get('categoria') || '';

  // Lista de productos dinámica desde el backend
  const [listaProductos, setListaProductos] = useState(defaultProductos);

  // Estados locales para filtrado y búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categoriaParam);
  const [sortBy, setSortBy] = useState('relevance');

  // Cargar productos del backend
  useEffect(() => {
    obtenerProductos().then((data) => {
      if (data && data.length > 0) {
        setListaProductos(data);
      }
    });
  }, []);

  // Sincronizar parámetro de URL con la categoría seleccionada
  useEffect(() => {
    if (categoriaParam) {
      setSelectedCategory(categoriaParam);
    } else {
      setSelectedCategory('');
    }
  }, [categoriaParam]);

  // Manejar cambio de chip de categoría
  const handleCategoryChange = (catId) => {
    const newCategory = catId === 'todas' ? '' : catId;
    setSelectedCategory(newCategory);
    if (newCategory) {
      setSearchParams({ categoria: newCategory });
    } else {
      setSearchParams({});
    }
  };

  // Filtrado y ordenamiento de productos memoizado
  const productosFiltrados = useMemo(() => {
    let result = [...listaProductos];

    // 1. Filtrar por categoría
    if (selectedCategory) {
      result = result.filter(
        (p) => p.categoria.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // 2. Filtrar por término de búsqueda (nombre, descripción o etiquetas)
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.nombre.toLowerCase().includes(term) ||
          p.descripcion.toLowerCase().includes(term) ||
          p.categoria.toLowerCase().includes(term) ||
          (p.tags && p.tags.some((tag) => tag.toLowerCase().includes(term)))
      );
    }

    // 3. Ordenar resultados
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.precio - b.precio);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.precio - a.precio);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [searchTerm, selectedCategory, sortBy]);

  return (
    <div className="catalog-page">
      <div className="container">
        {/* Encabezado del Catálogo */}
        <div className="section-header" style={{ textAlign: 'left', marginBottom: '30px' }}>
          <span className="section-tag">Inventario en Vivo</span>
          <h1 className="section-title">Catálogo Oficial de Productos</h1>
          <p className="section-subtitle" style={{ margin: '0' }}>
            Explora nuestra gama de herramientas, materiales de construcción, tuberías, electricidad, pintura y seguridad industrial.
          </p>
        </div>

        {/* Barra de Herramientas: Búsqueda, Filtros y Ordenamiento */}
        <div className="catalog-toolbar">
          <div className="catalog-search-row">
            {/* Buscador en tiempo real */}
            <div className="search-input-wrapper">
              <Search size={18} />
              <input
                type="text"
                className="search-input"
                placeholder="Buscar por nombre, especificación o tag (ej: taladro, PVC, cemento)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Buscar producto"
              />
            </div>

            {/* Selector de ordenamiento */}
            <select
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Ordenar productos"
            >
              <option value="relevance">Destacados / Relevancia</option>
              <option value="price-asc">Precio: Menor a Mayor</option>
              <option value="price-desc">Precio: Mayor a Menor</option>
              <option value="rating">Mayor Calificación</option>
            </select>
          </div>

          {/* Chips de Categorías */}
          <div className="category-chips-list" role="tablist" aria-label="Filtro de categorías">
            {categorias.map((cat) => {
              const isActive =
                cat.id === 'todas'
                  ? selectedCategory === ''
                  : selectedCategory.toLowerCase() === cat.id.toLowerCase();

              return (
                <button
                  key={cat.id}
                  type="button"
                  className={`chip-filter ${isActive ? 'active' : ''}`}
                  onClick={() => handleCategoryChange(cat.id)}
                  role="tab"
                  aria-selected={isActive}
                >
                  {cat.nombre}
                </button>
              );
            })}
          </div>
        </div>

        {/* Contador de Resultados */}
        <div className="catalog-results-count">
          Mostrando <strong>{productosFiltrados.length}</strong> de <strong>{listaProductos.length}</strong> productos disponibles
          {selectedCategory && <span> en la categoría <em>"{selectedCategory}"</em></span>}
          {searchTerm && <span> para la búsqueda <em>"{searchTerm}"</em></span>}
        </div>

        {/* Grid de Productos o Estado Vacío */}
        {productosFiltrados.length > 0 ? (
          <div className="catalog-grid">
            {productosFiltrados.map((producto) => (
              <ProductCard
                key={producto.id}
                producto={producto}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        ) : (
          <div className="catalog-empty">
            <PackageX size={48} color="var(--color-accent)" style={{ marginBottom: '16px' }} />
            <h3>No se encontraron productos</h3>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '20px' }}>
              No hay coincidencias para tu búsqueda o filtro seleccionado.
            </p>
            <button
              className="btn btn-secondary"
              onClick={() => {
                setSearchTerm('');
                handleCategoryChange('todas');
              }}
            >
              Limpiar Filtros de Búsqueda
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
