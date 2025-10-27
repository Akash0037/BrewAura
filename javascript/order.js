// Order functionality for BrewAura

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize order page
    if (document.getElementById('order-form')) {
        initOrderPage();
    }
});

// Initialize Order Page
function initOrderPage() {
    // Load cart summary
    renderOrderSummary();
    
    // Delivery option selection
    const deliveryOptions = document.querySelectorAll('.delivery-option');
    deliveryOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove selected class from all options
            deliveryOptions.forEach(opt => opt.classList.remove('selected'));
            
            // Add selected class to clicked option
            this.classList.add('selected');
            
            // Update hidden input value
            const input = this.querySelector('input');
            input.checked = true;
            
            // Show/hide address field based on selection
            const addressField = document.getElementById('address-field');
            if (input.value === 'delivery') {
                addressField.style.display = 'block';
            } else {
                addressField.style.display = 'none';
            }
        });
    });
    
    // Form submission
    const orderForm = document.getElementById('order-form');
    orderForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate form
        if (!validateOrderForm()) {
            return;
        }
        
        // Process order
        processOrder();
    });
}

// Render order summary
function renderOrderSummary() {
    const orderSummaryContainer = document.getElementById('order-summary-items');
    const orderTotalElement = document.getElementById('order-total');
    
    if (!orderSummaryContainer) return;
    
    // Clear existing items
    orderSummaryContainer.innerHTML = '';
    
    const cart = JSON.parse(localStorage.getItem('brewAuraCart')) || [];
    
    if (cart.length === 0) {
        orderSummaryContainer.innerHTML = '<p>Your cart is empty.</p>';
        if (orderTotalElement) orderTotalElement.textContent = formatCurrency(0);
        return;
    }
    
    let total = 0;
    
    // Render each item in order summary
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const summaryItem = document.createElement('div');
        summaryItem.className = 'summary-item';
        summaryItem.innerHTML = `
            <span>${item.name} x ${item.quantity}</span>
            <span>${formatCurrency(itemTotal)}</span>
        `;
        
        orderSummaryContainer.appendChild(summaryItem);
    });
    
    // Update total
    if (orderTotalElement) {
        orderTotalElement.textContent = formatCurrency(total);
    }
}

// Validate order form
function validateOrderForm() {
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const deliveryOption = document.querySelector('input[name="delivery"]:checked');
    const address = document.getElementById('address').value.trim();
    
    // Basic validation
    if (!name) {
        showConfirmation('Please enter your name.');
        return false;
    }
    
    if (!phone) {
        showConfirmation('Please enter your phone number.');
        return false;
    }
    
    if (!deliveryOption) {
        showConfirmation('Please select a delivery option.');
        return false;
    }
    
    if (deliveryOption.value === 'delivery' && !address) {
        showConfirmation('Please enter your delivery address.');
        return false;
    }
    
    // Check if cart is empty
    const cart = JSON.parse(localStorage.getItem('brewAuraCart')) || [];
    if (cart.length === 0) {
        showConfirmation('Your cart is empty. Please add items before placing an order.');
        return false;
    }
    
    return true;
}

// Process order
function processOrder() {
    // Get form data
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const deliveryOption = document.querySelector('input[name="delivery"]:checked').value;
    const address = deliveryOption === 'delivery' ? document.getElementById('address').value.trim() : '';
    const notes = document.getElementById('notes').value.trim();
    
    // Get cart data
    const cart = JSON.parse(localStorage.getItem('brewAuraCart')) || [];
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Create order object
    const order = {
        id: Date.now().toString(),
        customer: { name, phone, address, deliveryOption, notes },
        items: cart,
        total: total,
        date: new Date().toISOString()
    };
    
    // Save order to localStorage (in a real app, this would be sent to a server)
    const orders = JSON.parse(localStorage.getItem('brewAuraOrders')) || [];
    orders.push(order);
    localStorage.setItem('brewAuraOrders', JSON.stringify(orders));
    
    // Clear cart
    localStorage.removeItem('brewAuraCart');
    
    // Show confirmation
    const deliveryText = deliveryOption === 'delivery' ? 'delivery' : 'pickup';
    const addressText = deliveryOption === 'delivery' ? ` to ${address}` : '';
    
    showConfirmation(`Thank you, ${name}! Your order has been placed successfully. We'll contact you at ${phone} when your order is ready for ${deliveryText}${addressText}.`);
    
    // Redirect to home page after a delay
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 5000);
}