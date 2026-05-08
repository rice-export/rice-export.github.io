// Catalog page - Product listing with filters, search, and sorting

document.addEventListener('DOMContentLoaded', async () => {
  initializeNavigation();
  setupFilterListeners();
  setupSortListener();
  setupSearchListener();
  await loadProducts();
});

let currentPage = 1;
const itemsPerPage = 12;
let currentFilters = {};

// Load products from API
async function loadProducts(page = 1) {
  try {
    showSpinner();

    const params = new URLSearchParams({
      page,
      limit: itemsPerPage,
      ...currentFilters
    });

    const response = await window.apiClient.getProducts(`?${params.toString()}`);

    if (!response.success) {
      throw new Error(response.message || 'Failed to load products');
    }

    displayProducts(response.data);
    displayPagination(response.pages, page);
    currentPage = page;
  } catch (error) {
    console.error('Error loading products:', error);
    window.showNotification('Error loading products', 'error');
  } finally {
    hideSpinner();
  }
}

// Display products in grid
function displayProducts(products) {
  const gridContainer = document.getElementById('products-grid');

  if (!products || products.length === 0) {
    gridContainer.innerHTML = '<p class="col-span-full text-center py-12">No products found</p>';
    return;
  }

  gridContainer.innerHTML = products.map(product => `
    <a href="/pages/product.html?id=${product._id}" class="group">
      <div class="bg-white rounded-lg shadow hover:shadow-lg transition-all">
        <div class="relative h-48 bg-gray-200 overflow-hidden rounded-t-lg">
          <img src="${product.images[0] || 'https://via.placeholder.com/300x200'}" 
               alt="${product.name}"
               class="w-full h-full object-cover group-hover:scale-105 transition-transform">
          <div class="absolute top-2 right-2 bg-${product.stock > 0 ? 'green' : 'red'}-500 text-white px-2 py-1 rounded text-xs">
            ${product.stock > 0 ? 'In Stock' : 'Out of Stock'}
          </div>
        </div>
        
        <div class="p-4">
          <h3 class="font-semibold text-sm line-clamp-2 text-gray-800">${product.name}</h3>
          
          <div class="flex items-center mt-2 mb-3">
            <div class="flex text-yellow-400">
              ${[...Array(Math.floor(product.rating || 0))].map(() => '★').join('')}
              ${product.rating % 1 !== 0 ? '☆' : ''}
            </div>
            <span class="text-xs text-gray-500 ml-2">(${product.reviews ? product.reviews.length : 0})</span>
          </div>
          
          <div class="flex items-center justify-between">
            <span class="text-lg font-bold text-${product.price > 500 ? 'red' : 'green'}-600">
              ₹${window.formatPrice(product.price)}
            </span>
          </div>

          <p class="text-xs text-gray-500 mt-2">
            ${product.rice_type || 'Rice'}
          </p>
        </div>

        <div class="border-t p-3 flex gap-2">
          <button onclick="addToCartQuick('${product._id}', event)" 
                  class="flex-1 bg-${product.stock > 0 ? 'green' : 'gray'}-500 text-white py-2 rounded text-sm hover:opacity-90 ${product.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''}"
                  ${product.stock === 0 ? 'disabled' : ''}>
            🛒 Add
          </button>
          <button onclick="addToWishlistQuick('${product._id}', event)" 
                  class="flex-1 border border-red-400 text-red-500 py-2 rounded text-sm hover:bg-red-50">
            ❤ Wish
          </button>
        </div>
      </div>
    </a>
  `).join('');
}

// Add to cart from grid
async function addToCartQuick(productId, event) {
  event.preventDefault();
  event.stopPropagation();

  if (!window.isAuthenticated()) {
    window.requireAuth();
    return;
  }

  try {
    showSpinner();
    const response = await window.apiClient.addToCart(productId, 1);
    
    if (response.success) {
      window.showNotification('Added to cart!', 'success');
    }
  } catch (error) {
    window.handleApiError(error);
  } finally {
    hideSpinner();
  }
}

// Add to wishlist from grid
async function addToWishlistQuick(productId, event) {
  event.preventDefault();
  event.stopPropagation();

  if (!window.isAuthenticated()) {
    window.requireAuth();
    return;
  }

  try {
    const response = await window.apiClient.addToWishlist(productId);
    
    if (response.success) {
      window.showNotification('Added to wishlist!', 'success');
      event.target.closest('button').classList.add('bg-red-100');
    }
  } catch (error) {
    window.handleApiError(error);
  }
}

// Setup filter listeners
function setupFilterListeners() {
  const categoryFilter = document.getElementById('filter-category');
  const priceMinFilter = document.getElementById('filter-price-min');
  const priceMaxFilter = document.getElementById('filter-price-max');
  const riceTypeFilter = document.getElementById('filter-rice-type');

  if (categoryFilter) {
    categoryFilter.addEventListener('change', (e) => {
      currentFilters.category = e.target.value || undefined;
      delete currentFilters.category;
      if (e.target.value) currentFilters.category = e.target.value;
      loadProducts(1);
    });
  }

  if (priceMinFilter && priceMaxFilter) {
    priceMinFilter.addEventListener('change', () => {
      if (priceMinFilter.value) currentFilters.minPrice = priceMinFilter.value;
      loadProducts(1);
    });

    priceMaxFilter.addEventListener('change', () => {
      if (priceMaxFilter.value) currentFilters.maxPrice = priceMaxFilter.value;
      loadProducts(1);
    });
  }

  if (riceTypeFilter) {
    riceTypeFilter.addEventListener('change', (e) => {
      currentFilters.rice_type = e.target.value || undefined;
      delete currentFilters.rice_type;
      if (e.target.value) currentFilters.rice_type = e.target.value;
      loadProducts(1);
    });
  }
}

// Setup sort listener
function setupSortListener() {
  const sortDropdown = document.getElementById('sort-dropdown');

  if (sortDropdown) {
    sortDropdown.addEventListener('change', (e) => {
      currentFilters.sort = e.target.value || undefined;
      delete currentFilters.sort;
      if (e.target.value) currentFilters.sort = e.target.value;
      loadProducts(1);
    });
  }
}

// Setup search listener with debouncing
function setupSearchListener() {
  const searchInput = document.getElementById('search-input');

  if (searchInput) {
    searchInput.addEventListener('input', window.debounce(async (e) => {
      const query = e.target.value.trim();

      if (query.length < 2) {
        loadProducts(1);
        return;
      }

      try {
        showSpinner();
        const response = await window.apiClient.searchProducts(query);

        if (response.success) {
          displayProducts(response.data);
          displayPagination(response.pages, 1);
        }
      } catch (error) {
        window.handleApiError(error);
      } finally {
        hideSpinner();
      }
    }, 300));
  }
}

// Display pagination controls
function displayPagination(totalPages, currentPage) {
  const paginationContainer = document.getElementById('pagination');

  if (!paginationContainer || totalPages <= 1) {
    if (paginationContainer) paginationContainer.innerHTML = '';
    return;
  }

  let html = '<div class="flex justify-center gap-2 mt-8">';

  // Previous button
  if (currentPage > 1) {
    html += `<button onclick="loadProducts(${currentPage - 1})" class="px-4 py-2 border rounded hover:bg-gray-100">← Previous</button>`;
  }

  // Page numbers
  for (let i = Math.max(1, currentPage - 2); i <= Math.min(totalPages, currentPage + 2); i++) {
    if (i === currentPage) {
      html += `<button class="px-4 py-2 bg-green-600 text-white rounded">${i}</button>`;
    } else {
      html += `<button onclick="loadProducts(${i})" class="px-4 py-2 border rounded hover:bg-gray-100">${i}</button>`;
    }
  }

  // Next button
  if (currentPage < totalPages) {
    html += `<button onclick="loadProducts(${currentPage + 1})" class="px-4 py-2 border rounded hover:bg-gray-100">Next →</button>`;
  }

  html += '</div>';
  paginationContainer.innerHTML = html;
}

// Utility functions
function showSpinner() {
  const spinner = document.getElementById('loading-spinner');
  if (spinner) spinner.style.display = 'block';
}

function hideSpinner() {
  const spinner = document.getElementById('loading-spinner');
  if (spinner) spinner.style.display = 'none';
}
