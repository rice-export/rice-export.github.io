// ==========================================
// INQUIRY FORM MODULE
// ==========================================

/**
 * Initialize inquiry page
 */
function initInquiryPage() {
    setupFormListeners();
    setupFormValidation();
}

/**
 * Setup form submission listener
 */
function setupFormListeners() {
    const inquiryForm = document.getElementById('inquiryForm');
    if (inquiryForm) {
        inquiryForm.addEventListener('submit', submitInquiry);
    }
}

/**
 * Setup form field validation
 */
function setupFormValidation() {
    const formInputs = document.querySelectorAll('#inquiryForm input, #inquiryForm select, #inquiryForm textarea');
    
    formInputs.forEach(input => {
        input.addEventListener('blur', validateField);
    });
}

/**
 * Validate single form field
 * @param {Event} event - Input event
 */
function validateField(event) {
    const field = event.target;
    let isValid = true;
    let message = '';

    // Email validation
    if (field.type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        isValid = emailRegex.test(field.value);
        message = 'Please enter a valid email address';
    }

    // Phone validation
    if (field.type === 'tel' && field.value) {
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        isValid = phoneRegex.test(field.value) && field.value.length >= 10;
        message = 'Please enter a valid phone number';
    }

    // Number validation
    if (field.type === 'number') {
        isValid = parseInt(field.value) > 0;
        message = 'Please enter a valid quantity';
    }

    // Update field styling
    if (!isValid && field.value) {
        field.style.borderBottomColor = 'var(--error)';
    } else {
        field.style.borderBottomColor = 'var(--surface-variant)';
    }

    return isValid;
}

/**
 * Validate entire form
 * @returns {boolean} Form is valid
 */
function validateForm() {
    const inquiryForm = document.getElementById('inquiryForm');
    if (!inquiryForm) return false;

    const requiredFields = inquiryForm.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
        if (!field.value || !validateField({ target: field })) {
            isValid = false;
        }
    });

    return isValid;
}

/**
 * Submit inquiry form
 * @param {Event} event - Form submit event
 */
function submitInquiry(event) {
    event.preventDefault();

    // Validate form
    if (!validateForm()) {
        showNotification('Please fill in all required fields correctly', 'error');
        return;
    }

    // Collect form data
    const formData = new FormData(document.getElementById('inquiryForm'));
    const inquiry = {
        timestamp: new Date().toISOString(),
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

    // Log inquiry (in real app, send to server)
    console.log('Inquiry Submitted:', inquiry);
    console.log(JSON.stringify(inquiry, null, 2));

    // Store in localStorage for demo
    const inquiries = JSON.parse(localStorage.getItem('inquiries') || '[]');
    inquiries.push(inquiry);
    localStorage.setItem('inquiries', JSON.stringify(inquiries));

    // Show success message
    showNotification(
        `Thank you! Your inquiry has been submitted.\n\nCompany: ${inquiry.companyName}\nProduct: ${inquiry.riceVariety}\nQuantity: ${inquiry.quantity} Tonnes\n\nOur team will contact you within 24 hours.`,
        'success'
    );

    // Reset form
    document.getElementById('inquiryForm').reset();

    // Navigate to home after 2 seconds
    setTimeout(() => navigateTo('home'), 2000);
}

/**
 * Show notification message
 * @param {string} message - Notification message
 * @param {string} type - Notification type (success, error, info)
 */
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type} fade-in`;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 1.5rem;
        background-color: ${type === 'success' ? 'var(--success)' : type === 'error' ? 'var(--error)' : 'var(--secondary-light)'};
        color: white;
        border-radius: 0.5rem;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        max-width: 400px;
        word-wrap: break-word;
        white-space: pre-line;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Auto-remove after 5 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

/**
 * Populate inquiry form with product data
 * @param {number} productId - Product ID
 */
function populateFormWithProduct(productId) {
    const product = getProductById(productId);
    if (!product) return;

    const riceVarietySelect = document.getElementById('formRiceVariety');
    if (riceVarietySelect) {
        riceVarietySelect.value = product.name;
    }
}

// Initialize on page load if needed
document.addEventListener('DOMContentLoaded', function() {
    // Initialize inquiry page when needed
    if (document.getElementById('inquiryForm')) {
        initInquiryPage();
    }
});
