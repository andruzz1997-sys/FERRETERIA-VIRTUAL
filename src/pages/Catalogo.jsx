import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  PackageX, 
  LayoutGrid, 
  List, 
  ShoppingCart, 
  Plus, 
  Minus,
  Check,
  Star
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { productos as defaultProductos, categorias, formatearPrecioCOP } from '../data/productos';
import { obtenerProductos } from '../services/api';

/**
 * Página de Catálogo de Productos de FERREWEB.
 * Permite explorar, filtrar por categorías, buscar en tiempo real, ordenar
 * y alternar entre:
 * - Modo Malla de Tarjetas (consumo visual masivo)
 * - Modo Lista Compacta / Tabla Industrial (ideal para compras mayoristas)
 * Evidencia: SENA GA7-220501096-AA5-EV03
 */
export default function Catalogo({ onAddToCart }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoriaParam = searchParams.get('categoria') || '';
  const qParam = searchParams.get('q') || '';

  // Lista de productos dinámica desde el backend
  const [listaProductos, setListaProductos] = useState(defaultProductos);

  // Estados locales para filtrado y búsqueda
  const [searchTerm, setSearchTerm] = useState(qParam);
  const [selectedCategory, setSelectedCategory] = useState(categoriaParam);
  const [sortBy, setSortBy] = useState('relevance');

  // Modo de vista: 'grid' (Malla de tarjetas) | 'table' (Tabla Industrial)
  const [viewMode, setViewMode] = useState('grid');

  // Cantidades temporales para compra rápida en modo tabla
  const [cantidadesTabla, setCantidadesTabla] = useState({});
  const [agregadosRecientes, setAgregadosRecientes] = useState({});

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

  // Sincronizar parámetro de búsqueda q desde la URL (Navbar o enlaces externos)
  useEffect(() => {
    if (qParam) {
      setSearchTerm(qParam);
    }
  }, [qParam]);

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
  }, [listaProductos, searchTerm, selectedCategory, sortBy]);

  // Manejadores para la tabla rápida mayorista
  const handleCambiarCantidadTabla = (id, delta, maxStock) => {
    setCantidadesTabla((prev) => {
      const actual = prev[id] || 1;
      const nueva = Math.min(Math.max(1, actual + delta), maxStock);
      return { ...prev, [id]: nueva };
    });
  };

  const handleAgregarDesdeTabla = (producto) => {
    const cant = cantidadesTabla[producto.id] || 1;
    if (onAddToCart) {
      for (let i = 0; i < cant; i++) {
        onAddToCart(producto);
      }
      setAgregadosRecientes((prev) => ({ ...prev, [producto.id]: true }));
      setTimeout(() => {
        setAgregadosRecientes((prev) => ({ ...prev, [producto.id]: false }));
      }, 1500);
    }
  };

  return (
    <div className="catalog-page">
      <div className="container">
        {/* Encabezado del Catálogo */}
        <div className="section-header" style={{ textAlign: 'left', marginBottom: '24px' }}>
          <span className="section-tag">Inventario en Vivo</span>
          <h1 className="section-title">Catálogo Oficial de Productos</h1>
          <p className="section-subtitle" style={{ margin: '0' }}>
            Explora nuestra gama de herramientas, materiales de construcción, tuberías, electricidad, pintura y seguridad industrial con precios transparentes en pesos colombianos (COP).
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
                placeholder="Buscar por nombre, SKU o tag (ej: taladro, PVC, cemento)..."
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

        {/* Barra de Resultados y Conmutador de Vista */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div className="catalog-results-count" style={{ margin: 0 }}>
            Mostrando <strong>{productosFiltrados.length}</strong> de <strong>{listaProductos.length}</strong> productos disponibles
            {selectedCategory && <span> en la categoría <em>"{selectedCategory}"</em></span>}
            {searchTerm && <span> para <em>"{searchTerm}"</em></span>}
          </div>

          {/* Selector de Vista: Malla vs Tabla Industrial */}
          <div className="view-mode-selector">
            <button
              type="button"
              className={`view-mode-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Vista en Malla de Tarjetas"
            >
              <LayoutGrid size={16} /> Malla
            </button>
            <button
              type="button"
              className={`view-mode-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
              title="Vista Lista Compacta / Tabla Industrial (Mayoristas)"
            >
              <List size={16} /> Tabla Industrial
            </button>
          </div>
        </div>

        {/* Renderizado Condicional: VISTA MALLA vs VISTA TABLA INDUSTRIAL */}
        {productosFiltrados.length === 0 ? (
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
        ) : viewMode === 'grid' ? (
          /* 1. MODO MALLA DE TARJETAS */
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
          /* 2. MODO LISTA COMPACTA / TABLA INDUSTRIAL (Compras por Mayor) */
          <div style={{ overflowX: 'auto' }}>
            <table className="industrial-catalog-table">
              <thead>
                <tr>
                  <th style={{ width: '90px' }}>SKU</th>
                  <th>Artículo / Suministro</th>
                  <th>Categoría</th>
                  <th>Existencias</th>
                  <th>Precio Unitario (COP)</th>
                  <th style={{ textAlign: 'center' }}>Compra Rápida</th>
                </tr>
              </thead>
              <tbody>
                {productosFiltrados.map((producto) => {
                  const cantActual = cantidadesTabla[producto.id] || 1;
                  const yaAgregado = agregadosRecientes[producto.id];

                  return (
                    <tr key={producto.id}>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                        FW-{String(producto.id).padStart(4, '0')}
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img
                            src={producto.imagen}
                            alt={producto.nombre}
                            style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px' }}
                          />
                          <div>
                            <Link
                              to={`/producto/${producto.id}`}
                              style={{ fontWeight: '700', fontSize: '0.92rem', color: '#fff', textDecoration: 'none' }}
                            >
                              {producto.nombre}
                            </Link>
                            <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                              <Star size={13} fill="var(--color-accent)" color="var(--color-accent)" />
                              <span>{producto.rating.toFixed(1)}</span>
                              {producto.enOferta && (
                                <span style={{ color: 'var(--color-secondary)', marginLeft: '6px', fontWeight: '700' }}>
                                  ⚡ -{producto.descuento}% OFF
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={{ fontSize: '0.82rem' }}>
                        <span style={{ background: 'rgba(255,255,255,0.06)', padding: '3px 8px', borderRadius: '4px' }}>
                          {producto.categoria}
                        </span>
                      </td>
                      <td>
                        {producto.stock <= 5 ? (
                          <span style={{ color: 'var(--color-warning)', fontSize: '0.82rem', fontWeight: '700' }}>
                            {producto.stock} uds (Crítico)
                          </span>
                        ) : (
                          <span style={{ color: 'var(--color-secondary)', fontSize: '0.82rem', fontWeight: '700' }}>
                            {producto.stock} uds en bodega
                          </span>
                        )}
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--color-accent)', fontSize: '0.95rem' }}>
                        {formatearPrecioCOP(producto.precio)}
                        {producto.precioAnterior && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textDecoration: 'line-through' }}>
                            {formatearPrecioCOP(producto.precioAnterior)}
                          </div>
                        )}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                          {/* Selector rápido de cantidad */}
                          <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            background: '#021B12',
                            border: '1px solid var(--color-border)',
                            borderRadius: '6px',
                            padding: '2px 6px'
                          }}>
                            <button
                              type="button"
                              onClick={() => handleCambiarCantidadTabla(producto.id, -1, producto.stock)}
                              style={{ color: 'var(--color-text-muted)', padding: '2px 4px' }}
                            >
                              <Minus size={12} />
                            </button>
                            <span style={{ minWidth: '24px', textAlign: 'center', fontSize: '0.82rem', fontWeight: '700' }}>
                              {cantActual}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCambiarCantidadTabla(producto.id, 1, producto.stock)}
                              style={{ color: 'var(--color-text-muted)', padding: '2px 4px' }}
                            >
                              <Plus size={12} />
                            </button>
                          </div>

                          {/* Botón rápido de agregar */}
                          <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => handleAgregarDesdeTabla(producto)}
                            style={{
                              padding: '6px 12px',
                              fontSize: '0.8rem',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            {yaAgregado ? <Check size={14} /> : <ShoppingCart size={14} />}
                            {yaAgregado ? '¡Listo!' : 'Agregar'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
