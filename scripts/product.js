// ==========================================
// PRODUCT DETAILS PAGE MODULE
// ==========================================

/**
 * Initialize product details page
 * @param {number} productId - Product ID to display
 */
function initProductPage(productId) {
    const product = getProductById(productId);
    if (!product) return;

    displayProductDetails(product);
    renderRelatedProducts(productId);
    setupCalculatorListener();
}

/**
 * Display product details on page
 * @param {Object} product - Product object
 */
function displayProductDetails(product) {
    // Update page title
    document.title = `${product.name} - Guru Teja Heritage Exports`;

    // Product image
    const productImage = document.getElementById('productImage');
    if (productImage) {
        productImage.src = product.image;
        productImage.alt = product.name;
    }

    // Product info
    const productTitle = document.getElementById('productTitle');
    if (productTitle) {
        productTitle.textContent = product.name;
    }

    const productDesc = document.getElementById('productDesc');
    if (productDesc) {
        productDesc.textContent = product.description;
    }

    // Specifications
    document.getElementById('specMoisture').textContent = product.specs.moisture;
    document.getElementById('specLength').textContent = product.specs.length;
    document.getElementById('specPurity').textContent = product.specs.purity;

    // Price
    document.getElementById('unitPrice').textContent = '$' + product.price.toLocaleString();

    // Reset calculator
    const quantityInput = document.getElementById('quantityInput');
    if (quantityInput) {
        quantityInput.value = 1;
        calculateTotal();
    }

    // Set form rice variety
    const formRiceVariety = document.getElementById('formRiceVariety');
    if (formRiceVariety) {
        formRiceVariety.value = product.name;
    }
}

/**
 * Calculate total price based on quantity
 */
function calculateTotal() {
    const quantityInput = document.getElementById('quantityInput');
    const unitPriceEl = document.getElementById('unitPrice');
    const totalPriceEl = document.getElementById('totalPrice');

    if (!quantityInput || !unitPriceEl || !totalPriceEl) return;

    const quantity = parseInt(quantityInput.value) || 1;
    const unitPrice = parseInt(unitPriceEl.textContent.replace('$', '').replace(/,/g, '')) || 0;
    const total = quantity * unitPrice;

    totalPriceEl.textContent = '$' + total.toLocaleString();
}

/**
 * Setup calculator input listener
 */
function setupCalculatorListener() {
    const quantityInput = document.getElementById('quantityInput');
    if (quantityInput) {
        quantityInput.addEventListener('change', calculateTotal);
        quantityInput.addEventListener('input', calculateTotal);
    }
}

/**
 * Render related/other products
 * @param {number} currentProductId - ID of current product
 */
function renderRelatedProducts(currentProductId) {
    const relatedContainer = document.getElementById('relatedProducts');
    if (!relatedContainer) return;

    const related = products
        .filter(p => p.id !== currentProductId)
        .slice(0, 3);

    relatedContainer.innerHTML = related.map(product => `
        <div class="card scale-in" style="cursor: pointer;" onclick="navigateTo('product', ${product.id})">
            <div style="width: 100%; aspect-ratio: 4/5; overflow: hidden; margin-bottom: 1rem; border-radius: 0.25rem;">
                <img src="${product.image}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s ease;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'"/>
            </div>
            <h3 class="card-title">${product.name}</h3>
            <p style="font-size: 16px; color: var(--secondary-light); font-weight: 600; margin-bottom: 1rem;">$${product.price}/MT</p>
            <button class="btn-outline medium" style="width: 100%;" onclick="event.stopPropagation(); navigateTo('product', ${product.id})">
                View Product
            </button>
        </div>
    `).join('');
}
