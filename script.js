// Product Database
const products = [
    {
        id: 1,
        name: "1121 XXXL Extra Long Basmati",
        type: "basmati",
        price: 1250,
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDvB_UptGZfCOcfDGFMmilKk8ZuY5pmd0C9rjkDvhVU7if5Au8bpjGEzpSZNW0OjIcdgeuZ7s6Hs70tcHQwSBTBBJ_n_5WWzNxHgeOfhTL4-x4ixekDq3dkpKCJJjjO2AiKGiT6OtSk0qMnvaIT88tUEaUnpz3Lr0LacBLI_UdybmoVzPXV97SAGEmmI6IjTkLMdRJyuSTWoa8CKux3iW3PSlBYOMpJwYMUrUc2ckwHDmDT_6wCDH0QT0S3PrNy_Yh7Pngso3crWCrG",
        description: "Premium aged basmati rice with 2 years maturation for enhanced aroma.",
        grainLength: "extra-long",
        specs: {
            moisture: "12.5% Max",
            length: "8.35mm",
            purity: "< 2% Broken",
            broken: "< 2%"
        },
        details: "Aged for 2 years to perfection. Known globally for its distinct aroma and exquisite length after cooking."
    },
    {
        id: 2,
        name: "Traditional Golden Parboiled",
        type: "parboiled",
        price: 950,
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDskjpumrLFJmsJ7tdHaLfdHNIELX7VfiMD2CmzqLNhUbDAUIShR3k7sa4tSne8inISBEqNs_f2DKyWtso0XKwCBVZNdO2cqNHmRlZnMz8GGehOG0oGeX45IMTjy0vebz6wk-QdYM0_rV-FfM2iHmLogdzGx2nkKBM1PipDSTa7Yk8LEG6NJhxZy66ScHIME66ezvNqw98M9hpqIU8nFHj2Nc2012nBylYl5xKjXj0GPOLxCsycxpJhCCgfvLIfSf1DHJx04zec7HIE",
        description: "Nutritious parboiled rice perfect for catering and food service.",
        grainLength: "long",
        specs: {
            moisture: "13% Max",
            length: "6.00mm",
            purity: "100% Clean",
            broken: "< 5%"
        },
        details: "High nutritional value and easy to digest. Ideal for bulk catering and industrial kitchens."
    },
    {
        id: 3,
        name: "IR-64 Long Grain White",
        type: "white",
        price: 750,
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCVPcCBjqOHRVGclR7IUCHb3px94BENBMSuocuhXkr3Dz4dKGTUZimZlzIQsJ6I7JVdC3zMLb7HUQYgyldKNdY_R_aLZXZZilDKnA3iZZKMSjcAw8drPAMeYgpNzl_jQuON9QhiildbLc7au8k23AtPOqBSOocyox8_pm0hjWEsgYO88NBWc44rgPF3xIJBEIrXxh8lBtTwxtZ5A8eNMRL7pUlB_LIinMHzu_RvqUsjDjGQXtsDpEXtg01wM0pFhALYXXduYkkt0QyT",
        description: "Cost-effective long-grain white rice for wholesale markets.",
        grainLength: "long",
        specs: {
            moisture: "14% Max",
            length: "6.40mm",
            purity: "95% Min",
            broken: "< 5%"
        },
        details: "Cost-effective solution for global food security and wholesale distributors."
    },
    {
        id: 4,
        name: "Super Kernal Jasmine",
        type: "jasmine",
        price: 1100,
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDALvn0y3IJwgAfuNOiYw3DhJjoLVdBhS7jJWeaKaAjaqs7TOuFZYdI91I3CQG__gWEtQMoRq-imyIOJv9Wh4NaoKDURCahsYAKrKmI-cbTKNCEUcPnQG8SHG091iC30PylWa5sdbQc5tN9PanUu5jkbQugkYaOy7pVWooEIwlTUqAO7foeWlIyRSnHyr1DdhOnNr4o7JkCZoRsk0iJDIMVr9xVuwzoaHV9K26L12cfd9a4EVDGq1OKhVwO7wHGvXH7HX0tVJdIZlCp",
        description: "Fragrant jasmine rice with exceptional aroma and sticky texture.",
        grainLength: "extra-long",
        specs: {
            moisture: "12% Max",
            length: "7.20mm",
            purity: "< 3% Chalky",
            broken: "< 3%"
        },
        details: "Exceptional fragrance and sticky texture. Harvested from the region's most fertile river belts."
    }
];

let currentProductId = 1;

// Navigation Function
function navigateTo(page, productId = null) {
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(p => {
        p.classList.add('hidden');
        p.classList.remove('active');
    });

    // Show selected page
    const targetPage = document.getElementById(page + '-page');
    if (targetPage) {
        targetPage.classList.remove('hidden');
        targetPage.classList.add('active');
        
        // Handle product page with product data
        if (page === 'product' && productId) {
            currentProductId = productId;
            displayProductDetails(productId);
        } else if (page === 'catalog') {
            renderProductGrid();
        }
    }

    // Scroll to top
    window.scrollTo(0, 0);
}

// Get Current Product ID
function getCurrentProductId() {
    return currentProductId;
}

// Display Product Details
function displayProductDetails(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    document.getElementById('productTitle').textContent = product.name;
    document.getElementById('productDesc').textContent = product.description;
    document.getElementById('productImage').src = product.image;
    document.getElementById('unitPrice').textContent = '$' + product.price.toLocaleString();
    
    // Specifications
    document.getElementById('specMoisture').textContent = product.specs.moisture;
    document.getElementById('specLength').textContent = product.specs.length;
    document.getElementById('specPurity').textContent = product.specs.purity;
    
    // Reset calculator
    document.getElementById('quantityInput').value = 1;
    calculateTotal();
    
    // Set form rice variety
    document.getElementById('formRiceVariety').value = product.name;
    
    // Render related products
    renderRelatedProducts(productId);
}

// Render Product Grid
function renderProductGrid() {
    const grid = document.getElementById('productGrid');
    const filteredProducts = filterProductList();
    
    grid.innerHTML = filteredProducts.map(product => `
        <div class="group cursor-pointer" onclick="navigateTo('product', ${product.id})">
            <div class="aspect-[4/5] overflow-hidden mb-6 bg-white shadow-[0px_4px_20px_rgba(0,0,0,0.04)] relative rounded-lg">
                <img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src="${product.image}" alt="${product.name}"/>
                <div class="absolute top-4 left-4 bg-secondary-container px-3 py-1 rounded">
                    <span class="font-label-caps text-[10px] text-on-secondary-container uppercase">${product.type.toUpperCase()}</span>
                </div>
            </div>
            <div class="space-y-3">
                <div class="flex justify-between items-start">
                    <h2 class="font-headline-md text-headline-md text-primary">${product.name}</h2>
                    <span class="material-symbols-outlined text-outline cursor-pointer hover:text-secondary">verified</span>
                </div>
                <div class="flex items-center gap-6 text-on-surface-variant font-body-md border-y border-neutral-100 py-3">
                    <div><span class="font-label-caps block text-[10px] mb-1">Moisture</span> ${product.specs.moisture}</div>
                    <div class="w-px h-8 bg-neutral-200"></div>
                    <div><span class="font-label-caps block text-[10px] mb-1">Avg Length</span> ${product.specs.length}</div>
                    <div class="w-px h-8 bg-neutral-200"></div>
                    <div><span class="font-label-caps block text-[10px] mb-1">Purity</span> ${product.specs.purity}</div>
                </div>
                <p class="font-body-md text-on-surface-variant line-clamp-2">${product.details}</p>
                <div class="flex justify-between items-center">
                    <span class="font-headline-md text-headline-md text-secondary">$${product.price}/MT</span>
                    <button class="bg-primary text-on-primary px-6 py-2 font-button text-button uppercase tracking-widest hover:bg-neutral-800 transition-colors" onclick="event.stopPropagation(); navigateTo('product', ${product.id})">Details</button>
                </div>
            </div>
        </div>
    `).join('');
}

// Filter Product List
function filterProductList() {
    const typeFilters = Array.from(document.querySelectorAll('.filter-checkbox:checked')).map(cb => cb.value);
    const grainFilter = document.querySelector('.filter-radio:checked')?.value || 'all';
    const sortValue = document.querySelector('select')?.value || 'default';

    let filtered = products.filter(product => {
        const typeMatch = typeFilters.length === 0 || typeFilters.includes(product.type);
        const grainMatch = grainFilter === 'all' || product.grainLength === grainFilter;
        return typeMatch && grainMatch;
    });

    // Sorting
    if (sortValue === 'price-low') {
        filtered.sort((a, b) => a.price - b.price);
    } else if (sortValue === 'price-high') {
        filtered.sort((a, b) => b.price - a.price);
    }

    return filtered.length > 0 ? filtered : products;
}

// Filter Products
function filterProducts() {
    renderProductGrid();
}

// Calculate Total
function calculateTotal() {
    const quantity = parseInt(document.getElementById('quantityInput').value) || 1;
    const unitPrice = parseInt(document.getElementById('unitPrice').textContent.replace('$', '').replace(/,/g, '')) || 0;
    const total = quantity * unitPrice;
    document.getElementById('totalPrice').textContent = '$' + total.toLocaleString();
}

// Render Related Products
function renderRelatedProducts(currentProductId) {
    const relatedContainer = document.getElementById('relatedProducts');
    const related = products.filter(p => p.id !== currentProductId).slice(0, 3);
    
    relatedContainer.innerHTML = related.map(product => `
        <div class="group cursor-pointer" onclick="navigateTo('product', ${product.id})">
            <div class="aspect-[4/5] overflow-hidden mb-4 bg-white shadow-md rounded-lg">
                <img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src="${product.image}" alt="${product.name}"/>
            </div>
            <h3 class="font-headline-md text-headline-md text-primary mb-2">${product.name}</h3>
            <p class="text-on-surface-variant font-body-md mb-3">$${product.price}/MT</p>
            <button class="w-full border-2 border-primary text-primary py-2 font-button text-button uppercase tracking-widest hover:bg-primary hover:text-white transition-all" onclick="event.stopPropagation(); navigateTo('product', ${product.id})">View</button>
        </div>
    `).join('');
}

// Submit Inquiry Form
function submitInquiry(event) {
    event.preventDefault();
    
    const formData = new FormData(document.getElementById('inquiryForm'));
    const inquiry = {
        companyName: formData.get('companyName'),
        contactName: formData.get('contactName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        country: formData.get('country'),
        riceVariety: formData.get('riceVariety'),
        quantity: formData.get('quantity'),
        packaging: formData.get('packaging'),
        destination: formData.get('destination'),
        deliveryWindow: formData.get('deliveryWindow'),
        organic: document.querySelector('input[name="organic"]:checked') ? 'Yes' : 'No',
        haccp: document.querySelector('input[name="haccp"]:checked') ? 'Yes' : 'No',
        message: formData.get('message')
    };

    // Log the inquiry (in real app, send to server)
    console.log('Inquiry Submitted:', inquiry);
    
    // Show success message
    alert('Thank you! Your inquiry has been submitted. Our sales team will contact you within 24 hours.\n\nInquiry Details:\n' +
        `Company: ${inquiry.companyName}\n` +
        `Product: ${inquiry.riceVariety}\n` +
        `Quantity: ${inquiry.quantity} Tonnes\n` +
        `Email: ${inquiry.email}`);
    
    // Reset form
    document.getElementById('inquiryForm').reset();
    
    // Optionally navigate to home
    setTimeout(() => navigateTo('home'), 1000);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Render initial product grid
    renderProductGrid();
    
    // Show home page by default
    navigateTo('home');
});

// Keyboard navigation (optional)
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        navigateTo('home');
    }
});
