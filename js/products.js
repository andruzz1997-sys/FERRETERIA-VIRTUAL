// ========================================
// FERREWEB - MANEJO DE PRODUCTOS
// ========================================

// Renderizar productos con filtrado avanzado
function filterProducts() {
    let filtered = [...allProducts];
    
    // Filtro por categoría
    const categoryFilter = document.getElementById('category-filter').value;
    if (categoryFilter) {
        filtered = filtered.filter(p => p.category === categoryFilter);
    }
    
    // Filtro por rango de precio
    const priceFilter = document.getElementById('price-filter').value;
    if (priceFilter) {
        const [min, max] = parsePrice(priceFilter);
        filtered = filtered.filter(p => p.price >= min && (max === null || p.price <= max));
    }
    
    renderProducts(filtered);
}

// Parseador de rango de precio
function parsePrice(range) {
    const match = range.match(/(\d+)(?:-(\d+))?/);
    if (!match) return [0, null];
    
    const min = parseInt(match[1]) * 1000;
    const max = match[2] ? parseInt(match[2]) * 1000 : null;
    
    return [min, max];
}

// Función para obtener producto por ID
function getProductById(id) {
    return allProducts.find(p => p.id === id);
}

// Función para obtener productos por categoría
function getProductsByCategory(category) {
    return allProducts.filter(p => p.category === category);
}

// Función para búsqueda de productos
function searchProducts(query) {
    if (!query || query.length === 0) return [];
    
    const lowerQuery = query.toLowerCase();
    
    return allProducts.filter(product => 
        product.name.toLowerCase().includes(lowerQuery) ||
        product.description.toLowerCase().includes(lowerQuery) ||
        product.category.toLowerCase().includes(lowerQuery)
    );
}

// Función para obtener productos destacados (top rated)
function getFeaturedProducts(limit = 5) {
    return [...allProducts]
        .sort((a, b) => b.rating - a.rating)
        .slice(0, limit);
}

// Función para obtener productos en oferta
function getDiscountedProducts() {
    return allProducts.filter(p => p.discount && p.discount > 0);
}

// Función para validar disponibilidad de producto
function isProductAvailable(productId) {
    const product = getProductById(productId);
    return product && product.stock > 0;
}

// Función para obtener stock de un producto
function getProductStock(productId) {
    const product = getProductById(productId);
    return product ? product.stock : 0;
}

// Función para actualizar stock (simulado)
function decrementProductStock(productId, quantity = 1) {
    const product = getProductById(productId);
    if (product && product.stock >= quantity) {
        product.stock -= quantity;
        return true;
    }
    return false;
}

// Renderizar productos en cuadrícula con lazy loading
function renderProductsWithLazyLoad(products) {
    const container = document.getElementById('productsContainer');
    
    if (!products || products.length === 0) {
        container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: gray;">No hay productos disponibles</p>';
        return;
    }
    
    // Mostrar primeros 12 productos
    const initialProducts = products.slice(0, 12);
    const remainingProducts = products.slice(12);
    
    container.innerHTML = initialProducts.map((product, index) => `
        <div class="product-card animate-slide-up" style="animation-delay: ${index * 0.05}s;">
            <div class="product-image">
                <span>${product.emoji}</span>
            </div>
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-rating">⭐ ${product.rating}</div>
                <div class="product-footer">
                    <div>
                        <div class="product-price">$${product.price.toLocaleString()}</div>
                        <div class="product-stock ${product.stock < 20 ? 'low' : ''}">
                            ${product.stock > 0 ? `Stock: ${product.stock}` : 'Agotado'}
                        </div>
                    </div>
                    <button class="btn-add-cart" onclick="addToCart(${product.id})" ${product.stock === 0 ? 'disabled' : ''}>
                        🛒 Agregar
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    // Agregar botón de "Cargar más" si hay productos adicionales
    if (remainingProducts.length > 0) {
        const loadMoreBtn = document.createElement('button');
        loadMoreBtn.textContent = 'Cargar más productos';
        loadMoreBtn.className = 'btn-primary';
        loadMoreBtn.style.gridColumn = '1 / -1';
        loadMoreBtn.style.margin = '2rem auto';
        loadMoreBtn.onclick = () => {
            renderProductsWithLazyLoad(products);
        };
        
        const buttonContainer = document.createElement('div');
        buttonContainer.style.gridColumn = '1 / -1';
        buttonContainer.style.textAlign = 'center';
        buttonContainer.appendChild(loadMoreBtn);
        container.appendChild(buttonContainer);
    }
}

// Función para obtener estadísticas de productos
function getProductStats() {
    return {
        totalProducts: allProducts.length,
        categories: [...new Set(allProducts.map(p => p.category))],
        averagePrice: Math.floor(allProducts.reduce((sum, p) => sum + p.price, 0) / allProducts.length),
        highestPrice: Math.max(...allProducts.map(p => p.price)),
        lowestPrice: Math.min(...allProducts.map(p => p.price)),
        totalStock: allProducts.reduce((sum, p) => sum + p.stock, 0),
        topRated: [...allProducts].sort((a, b) => b.rating - a.rating)[0],
        lowStockProducts: allProducts.filter(p => p.stock < 20)
    };
}

// Método para sincronizar estado de productos después de compra
function syncProductsAfterPurchase(cartItems) {
    cartItems.forEach(item => {
        decrementProductStock(item.id, item.quantity);
    });
    
    // En una aplicación real, aquí se enviaría al servidor
    console.log('📦 Productos sincronizados después de compra');
}

// Exportar datos de productos (para análisis)
function exportProductsData() {
    const stats = getProductStats();
    console.table(stats);
    
    // Crear CSV
    let csv = 'ID,Nombre,Categoría,Precio,Stock,Rating\n';
    allProducts.forEach(p => {
        csv += `${p.id},"${p.name}","${p.category}",${p.price},${p.stock},${p.rating}\n`;
    });
    
    return csv;
}
