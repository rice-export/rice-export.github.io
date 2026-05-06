// ==========================================
// CATALOG PAGE MODULE
// ==========================================

/**
 * Initialize catalog page
 */
function initCatalogPage() {
    renderProductGrid();
    setupFilterListeners();
    setupSortListener();
}

/**
 * Render product grid based on current filters
 */
function renderProductGrid() {
    const grid = document.getElementById('productGrid');
    if (!grid) return;

    const filteredProducts = getFilteredAndSortedProducts();
    
    grid.innerHTML = filteredProducts.map(product => `
        <div class="product-card scale-in" onclick="navigateTo('product', ${product.id})">
            <div class="product-card-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy"/>
                <span class="product-badge">${product.badge}</span>
            </div>
            <div class="product-card-content">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.5rem;">
                    <h3 class="product-card-title">${product.name}</h3>
                    <span class="material-symbols-outlined" style="font-size: 20px; color: #775a19;">verified</span>
                </div>
                <div class="product-card-specs">
                    <div class="product-card-spec">
                        <span class="product-card-spec-label">Moisture</span>
                        <span>${product.specs.moisture}</span>
                    </div>
                    <div class="product-card-spec">
                        <span class="product-card-spec-label">Length</span>
                        <span>${product.specs.length}</span>
                    </div>
                    <div class="product-card-spec">
                        <span class="product-card-spec-label">Purity</span>
                        <span>${product.specs.purity}</span>
                    </div>
                </div>
                <p class="product-card-description">${product.details}</p>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1rem;">
                    <span class="product-card-price">$${product.price}/MT</span>
                    <button class="product-card-button" onclick="event.stopPropagation(); navigateTo('product', ${product.id})">
                        Details
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    // Show empty state if no products
    if (filteredProducts.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 2rem; color: var(--on-surface-variant);">No products found matching your filters.</p>';
    }
}

/**
 * Get filtered and sorted products
 * @returns {Array} Filtered and sorted products
 */
function getFilteredAndSortedProducts() {
    // Get filter values from checkboxes
    const typeFilters = Array.from(document.querySelectorAll('.filter-checkbox:checked')).map(cb => cb.value);
    const grainFilter = document.querySelector('.filter-radio:checked')?.value || 'all';
    const sortValue = document.querySelector('select[name="sortBy"]')?.value || 'default';

    // Update app state
    appState.filterState.types = typeFilters;
    appState.filterState.grainLength = grainFilter;
    appState.sortBy = sortValue;

    // Get filtered products
    const filters = {
        type: typeFilters.length > 0 ? typeFilters : null,
        grainLength: grainFilter
    };

    let filtered = getProducts(filters);

    // If no products match, show all
    if (filtered.length === 0) {
        filtered = products;
    }

    // Sort products
    filtered = sortProducts(filtered, sortValue);

    return filtered;
}

/**
 * Setup filter change listeners
 */
function setupFilterListeners() {
    const filterCheckboxes = document.querySelectorAll('.filter-checkbox');
    const filterRadios = document.querySelectorAll('.filter-radio');

    filterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', renderProductGrid);
    });

    filterRadios.forEach(radio => {
        radio.addEventListener('change', renderProductGrid);
    });
}

/**
 * Setup sort dropdown listener
 */
function setupSortListener() {
    const sortSelect = document.querySelector('select[name="sortBy"]');
    if (sortSelect) {
        sortSelect.addEventListener('change', renderProductGrid);
    }
}
