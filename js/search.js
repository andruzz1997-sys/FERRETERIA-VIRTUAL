// ========================================
// FERREWEB - BÚSQUEDA INTELIGENTE
// ========================================

let searchHistory = JSON.parse(localStorage.getItem('ferreweb-search-history')) || [];
const MAX_SEARCH_HISTORY = 10;

// Inicializar búsqueda
document.addEventListener('DOMContentLoaded', function() {
    initializeSearchFunctionality();
});

// Función para inicializar la búsqueda
function initializeSearchFunctionality() {
    const searchInput = document.getElementById('searchInput');
    const advancedSearch = document.getElementById('advancedSearch');
    const searchBtn = document.getElementById('searchBtn');
    const categoryFilter = document.getElementById('category-filter');
    const priceFilter = document.getElementById('price-filter');
    
    // Búsqueda principal
    if (searchInput) {
        searchInput.addEventListener('keyup', debounce(handleSearch, 300));
        searchInput.addEventListener('focus', showSearchSuggestions);
    }
    
    if (searchBtn) {
        searchBtn.addEventListener('click', handleSearch);
    }
    
    // Búsqueda avanzada
    if (advancedSearch) {
        advancedSearch.addEventListener('keyup', debounce(handleAdvancedSearch, 300));
    }
    
    // Filtros
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterProducts);
    }
    
    if (priceFilter) {
        priceFilter.addEventListener('change', filterProducts);
    }
}

// Función de debounce para optimizar búsquedas
function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
}

// Manejar búsqueda principal
function handleSearch() {
    const searchInput = document.getElementById('searchInput');
    const query = searchInput.value.trim();
    
    if (!query) {
        renderProducts(allProducts);
        return;
    }
    
    // Agregar a historial
    addToSearchHistory(query);
    
    // Buscar productos
    const results = performSearch(query);
    
    if (results.length === 0) {
        showNotification('❌ No se encontraron productos', 'error');
        renderProducts([]);
    } else {
        showNotification(`✅ ${results.length} producto(s) encontrado(s)`);
        renderProducts(results);
    }
    
    // Scroll a resultados
    setTimeout(() => {
        document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
    }, 300);
}

// Manejar búsqueda avanzada
function handleAdvancedSearch() {
    const advancedSearch = document.getElementById('advancedSearch');
    const categoryFilter = document.getElementById('category-filter');
    const priceFilter = document.getElementById('price-filter');
    
    const query = advancedSearch.value.trim();
    const category = categoryFilter.value;
    const price = priceFilter.value;
    
    let results = allProducts;
    
    // Filtrar por búsqueda
    if (query) {
        results = results.filter(p =>
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            p.description.toLowerCase().includes(query.toLowerCase()) ||
            p.category.toLowerCase().includes(query.toLowerCase())
        );
    }
    
    // Filtrar por categoría
    if (category) {
        results = results.filter(p => p.category === category);
    }
    
    // Filtrar por precio
    if (price) {
        const [min, max] = parsePrice(price);
        results = results.filter(p => p.price >= min && (max === null || p.price <= max));
    }
    
    // Mostrar resultados
    const searchResults = document.getElementById('searchResults');
    
    if (results.length > 0) {
        searchResults.innerHTML = results.map(product => `
            <div class="search-result-item" onclick="selectSearchResult(${product.id})">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <strong>${product.name}</strong>
                        <p style="color: gray; font-size: 0.85rem;">${product.category}</p>
                    </div>
                    <span style="color: green; font-weight: bold;">$${product.price.toLocaleString()}</span>
                </div>
            </div>
        `).join('');
        searchResults.classList.remove('hidden');
    } else {
        searchResults.innerHTML = '<div class="search-result-item" style="color: gray;">No hay resultados</div>';
        searchResults.classList.remove('hidden');
    }
}

// Seleccionar producto de búsqueda
function selectSearchResult(productId) {
    const product = getProductById(productId);
    if (product) {
        addToCart(productId);
        document.getElementById('advancedSearch').value = '';
        document.getElementById('searchResults').classList.add('hidden');
    }
}

// Realizar búsqueda inteligente
function performSearch(query) {
    const lowerQuery = query.toLowerCase();
    
    // Búsqueda por coincidencia exacta
    const exactMatches = allProducts.filter(p =>
        p.name.toLowerCase() === lowerQuery ||
        p.category.toLowerCase() === lowerQuery
    );
    
    // Búsqueda por coincidencia parcial
    const partialMatches = allProducts.filter(p =>
        !exactMatches.includes(p) && (
            p.name.toLowerCase().includes(lowerQuery) ||
            p.description.toLowerCase().includes(lowerQuery) ||
            p.category.toLowerCase().includes(lowerQuery)
        )
    );
    
    // Búsqueda por similitud de palabras clave
    const keywordMatches = allProducts.filter(p =>
        !exactMatches.includes(p) && !partialMatches.includes(p) && (
            getRelevanceScore(p, query.split(' ')) > 0.5
        )
    );
    
    // Combinar resultados ordenados por relevancia
    return [
        ...exactMatches,
        ...partialMatches.sort((a, b) => b.rating - a.rating),
        ...keywordMatches
    ].slice(0, 50); // Limitar a 50 resultados
}

// Calcular puntuación de relevancia
function getRelevanceScore(product, keywords) {
    let score = 0;
    const textToSearch = (product.name + ' ' + product.description + ' ' + product.category).toLowerCase();
    
    keywords.forEach(keyword => {
        const lowerKeyword = keyword.toLowerCase();
        if (textToSearch.includes(lowerKeyword)) {
            score += 0.5;
        }
    });
    
    // Aumentar puntuación por rating
    score += (product.rating / 5) * 0.5;
    
    return score / keywords.length;
}

// Mostrar sugerencias de búsqueda
function showSearchSuggestions() {
    const searchInput = document.getElementById('searchInput');
    const value = searchInput.value;
    
    // Mostrar historial si está vacío
    if (!value && searchHistory.length > 0) {
        showSearchHistorySuggestions();
    }
}

// Mostrar historial de búsquedas
function showSearchHistorySuggestions() {
    const searchInput = document.getElementById('searchInput');
    
    // Podría mostrar en un dropdown
    console.log('📋 Historial de búsquedas:', searchHistory);
}

// Agregar a historial de búsqueda
function addToSearchHistory(query) {
    // No agregar duplicados
    const index = searchHistory.indexOf(query);
    if (index > -1) {
        searchHistory.splice(index, 1);
    }
    
    // Agregar al inicio
    searchHistory.unshift(query);
    
    // Limitar tamaño del historial
    if (searchHistory.length > MAX_SEARCH_HISTORY) {
        searchHistory.pop();
    }
    
    // Guardar en localStorage
    localStorage.setItem('ferreweb-search-history', JSON.stringify(searchHistory));
}

// Limpiar historial de búsqueda
function clearSearchHistory() {
    searchHistory = [];
    localStorage.removeItem('ferreweb-search-history');
    showNotification('Historial de búsquedas eliminado');
}

// Búsqueda por etiquetas
function searchByTag(tag) {
    const results = allProducts.filter(product =>
        product.tags && product.tags.includes(tag)
    );
    
    renderProducts(results);
    showNotification(`🏷️ ${results.length} producto(s) con etiqueta "${tag}"`);
}

// Búsqueda por rango de precio
function searchByPriceRange(minPrice, maxPrice) {
    const results = allProducts.filter(p =>
        p.price >= minPrice && p.price <= maxPrice
    );
    
    renderProducts(results);
    return results;
}

// Búsqueda por stock disponible
function searchAvailableProducts() {
    const results = allProducts.filter(p => p.stock > 0);
    renderProducts(results);
    showNotification(`✅ ${results.length} producto(s) disponible(s)`);
    return results;
}

// Búsqueda de productos con bajo stock
function searchLowStockProducts() {
    const results = allProducts.filter(p => p.stock > 0 && p.stock < 20);
    renderProducts(results);
    showNotification(`⚠️ ${results.length} producto(s) con stock bajo`);
    return results;
}

// Búsqueda de productos más valorados
function searchBestRated(minRating = 4.5) {
    const results = allProducts.filter(p => p.rating >= minRating);
    renderProducts(results);
    showNotification(`⭐ ${results.length} producto(s) muy valorado(s)`);
    return results;
}

// Búsqueda de productos nuevos
function searchNewProducts(days = 30) {
    // En una app real, los productos tendrían fecha de creación
    const results = allProducts.slice(0, 5); // Simulación
    renderProducts(results);
    showNotification(`🆕 ${results.length} producto(s) nuevo(s)`);
    return results;
}

// Autocompletar búsqueda
function getSearchAutoComplete(query) {
    if (!query || query.length < 2) return [];
    
    const lowerQuery = query.toLowerCase();
    const suggestions = new Set();
    
    allProducts.forEach(product => {
        // Agregar nombres que coincidan
        if (product.name.toLowerCase().includes(lowerQuery)) {
            suggestions.add(product.name);
        }
        
        // Agregar categorías que coincidan
        if (product.category.toLowerCase().includes(lowerQuery)) {
            suggestions.add(product.category);
        }
    });
    
    return Array.from(suggestions).slice(0, 8);
}

// Búsqueda por coincidencia aproximada (fuzzy search)
function fuzzySearch(query) {
    const lowerQuery = query.toLowerCase();
    
    return allProducts.filter(product => {
        const productName = product.name.toLowerCase();
        
        // Algoritmo simple de coincidencia aproximada
        let queryIndex = 0;
        let productIndex = 0;
        let matches = 0;
        
        while (productIndex < productName.length && queryIndex < lowerQuery.length) {
            if (productName[productIndex] === lowerQuery[queryIndex]) {
                matches++;
                queryIndex++;
            }
            productIndex++;
        }
        
        return matches >= Math.ceil(lowerQuery.length / 2);
    });
}

// Obtener productos relacionados a uno específico
function getRelatedProducts(productId, limit = 5) {
    const product = getProductById(productId);
    if (!product) return [];
    
    return allProducts.filter(p =>
        p.id !== productId && p.category === product.category
    )
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
}

// Analíticas de búsqueda
function getSearchAnalytics() {
    return {
        totalSearches: searchHistory.length,
        uniqueSearches: new Set(searchHistory).size,
        searchHistory: searchHistory,
        topSearches: getTopSearches(5)
    };
}

// Obtener búsquedas más populares
function getTopSearches(limit = 5) {
    const counts = {};
    
    searchHistory.forEach(search => {
        counts[search] = (counts[search] || 0) + 1;
    });
    
    return Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([search, count]) => ({ search, count }));
}
