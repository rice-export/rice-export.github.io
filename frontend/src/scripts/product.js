// Product detail page

let currentProduct = null;

document.addEventListener('DOMContentLoaded', async () => {
  initializeNavigation();
  const productId = new URLSearchParams(window.location.search).get('id');

  if (!productId) {
    window.location.href = '/pages/catalog.html';
    return;
  }

  await loadProduct(productId);
  setupEventListeners();
});

async function loadProduct(productId) {
  try {
    showSpinner();
    const response = await window.apiClient.getProduct(productId);

    if (!response.success) {
      throw new Error('Product not found');
    }

    currentProduct = response.data;
    displayProduct(currentProduct);
    await loadRelatedProducts(productId);
  } catch (error) {
    console.error('Error loading product:', error);
    window.showNotification('Product not found', 'error');
    setTimeout(() => window.location.href = '/pages/catalog.html', 2000);
  } finally {
    hideSpinner();
  }
}

function displayProduct(product) {
  // Main product image
  const mainImage = document.getElementById('main-image');
  if (mainImage) mainImage.src = product.images[0] || 'https://via.placeholder.com/600';

  // Thumbnails
  const thumbnailsContainer = document.getElementById('product-thumbnails');
  if (thumbnailsContainer && product.images) {
    thumbnailsContainer.innerHTML = product.images.map((img, idx) => `
      <img src="${img}" 
           alt="Product image ${idx + 1}"
           class="w-20 h-20 object-cover rounded cursor-pointer border-2 ${idx === 0 ? 'border-green-600' : 'border-gray-200'}"
           onclick="changeMainImage('${img}')">
    `).join('');
  }

  // Product info
  document.getElementById('product-name').textContent = product.name;
  document.getElementById('product-price').textContent = `₹${window.formatPrice(product.price)}`;
  document.getElementById('product-rating').innerHTML = `
    <div class="flex items-center gap-2">
      <div class="flex text-yellow-400">
        ${[...Array(Math.floor(product.rating || 0))].map(() => '★').join('')}
      </div>
      <span class="text-gray-600">${product.rating || 'No'} rating (${product.reviews?.length || 0} reviews)</span>
    </div>
  `;

  // Stock status
  const stockStatus = document.getElementById('stock-status');
  if (stockStatus) {
    stockStatus.innerHTML = product.stock > 0 
      ? `<span class="text-green-600 font-semibold">✓ In Stock (${product.stock} available)</span>`
      : `<span class="text-red-600 font-semibold">✗ Out of Stock</span>`;
  }

  // Description
  document.getElementById('product-description').textContent = product.description || 'No description available';

  // Specifications
  const specsContainer = document.getElementById('product-specifications');
  if (specsContainer && product.specifications) {
    specsContainer.innerHTML = Object.entries(product.specifications).map(([key, value]) => `
      <tr class="border-b">
        <td class="py-2 font-semibold text-gray-700">${key}</td>
        <td class="py-2 text-gray-600">${value}</td>
      </tr>
    `).join('');
  }

  // Reviews
  displayReviews(product.reviews || []);

  // Update button states
  updateAddToCartButton();
}

function changeMainImage(src) {
  document.getElementById('main-image').src = src;
}

function displayReviews(reviews) {
  const reviewsContainer = document.getElementById('product-reviews');

  if (!reviews || reviews.length === 0) {
    reviewsContainer.innerHTML = '<p class="text-gray-500">No reviews yet. Be the first to review!</p>';
    return;
  }

  reviewsContainer.innerHTML = reviews.map(review => `
    <div class="border-b pb-4 mb-4">
      <div class="flex justify-between items-start">
        <div>
          <p class="font-semibold">${review.user?.name || 'Anonymous'}</p>
          <div class="flex text-yellow-400 text-sm">
            ${[...Array(review.rating)].map(() => '★').join('')}
          </div>
        </div>
        <span class="text-gray-400 text-sm">${new Date(review.createdAt).toLocaleDateString()}</span>
      </div>
      <p class="text-gray-700 mt-2">${review.comment}</p>
    </div>
  `).join('');
}

async function loadRelatedProducts(productId) {
  try {
    const response = await window.apiClient.getRelatedProducts(productId);

    if (response.success && response.data.length > 0) {
      const relatedContainer = document.getElementById('related-products');
      relatedContainer.innerHTML = response.data.map(product => `
        <a href="/pages/product.html?id=${product._id}" class="group">
          <div class="bg-white rounded-lg shadow hover:shadow-lg transition-all">
            <img src="${product.images[0] || 'https://via.placeholder.com/300x200'}" 
                 alt="${product.name}"
                 class="w-full h-40 object-cover rounded-t-lg group-hover:scale-105 transition-transform">
            <div class="p-3">
              <h3 class="font-semibold text-sm line-clamp-2">${product.name}</h3>
              <p class="text-green-600 font-bold mt-1">₹${window.formatPrice(product.price)}</p>
            </div>
          </div>
        </a>
      `).join('');
    }
  } catch (error) {
    console.error('Error loading related products:', error);
  }
}

function setupEventListeners() {
  // Quantity selector
  const quantityInput = document.getElementById('quantity-input');
  if (quantityInput) {
    quantityInput.addEventListener('change', (e) => {
      if (e.target.value < 1) e.target.value = 1;
      if (e.target.value > currentProduct.stock) e.target.value = currentProduct.stock;
    });
  }

  // Add to cart
  const addToCartBtn = document.getElementById('add-to-cart-btn');
  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', addToCart);
  }

  // Add to wishlist
  const addToWishlistBtn = document.getElementById('add-to-wishlist-btn');
  if (addToWishlistBtn) {
    addToWishlistBtn.addEventListener('click', addToWishlist);
  }

  // Add review
  const addReviewBtn = document.getElementById('add-review-btn');
  if (addReviewBtn) {
    addReviewBtn.addEventListener('click', submitReview);
  }
}

async function addToCart() {
  if (!window.isAuthenticated()) {
    window.requireAuth();
    return;
  }

  try {
    showSpinner();
    const quantity = parseInt(document.getElementById('quantity-input')?.value || 1);

    const response = await window.apiClient.addToCart(currentProduct._id, quantity);

    if (response.success) {
      window.showNotification('Added to cart!', 'success');
    }
  } catch (error) {
    window.handleApiError(error);
  } finally {
    hideSpinner();
  }
}

async function addToWishlist() {
  if (!window.isAuthenticated()) {
    window.requireAuth();
    return;
  }

  try {
    const response = await window.apiClient.addToWishlist(currentProduct._id);

    if (response.success) {
      window.showNotification('Added to wishlist!', 'success');
      document.getElementById('add-to-wishlist-btn').classList.add('bg-red-100');
    }
  } catch (error) {
    if (error.message.includes('already')) {
      window.showNotification('Already in your wishlist', 'info');
    } else {
      window.handleApiError(error);
    }
  }
}

async function submitReview() {
  if (!window.isAuthenticated()) {
    window.requireAuth();
    return;
  }

  try {
    const rating = document.getElementById('review-rating')?.value;
    const comment = document.getElementById('review-comment')?.value;

    if (!rating) {
      window.showNotification('Please select a rating', 'error');
      return;
    }

    showSpinner();
    const response = await window.apiClient.addReview(currentProduct._id, rating, comment);

    if (response.success) {
      window.showNotification('Review added successfully!', 'success');
      currentProduct = response.data;
      displayReviews(currentProduct.reviews);
      document.getElementById('review-rating').value = '';
      document.getElementById('review-comment').value = '';
    }
  } catch (error) {
    window.handleApiError(error);
  } finally {
    hideSpinner();
  }
}

function updateAddToCartButton() {
  const btn = document.getElementById('add-to-cart-btn');
  if (currentProduct.stock === 0) {
    btn.disabled = true;
    btn.classList.add('opacity-50');
    btn.textContent = 'Out of Stock';
  } else {
    btn.disabled = false;
    btn.classList.remove('opacity-50');
    btn.textContent = 'Add to Cart';
  }
}

function showSpinner() {
  const spinner = document.getElementById('loading-spinner');
  if (spinner) spinner.style.display = 'block';
}

function hideSpinner() {
  const spinner = document.getElementById('loading-spinner');
  if (spinner) spinner.style.display = 'none';
}
