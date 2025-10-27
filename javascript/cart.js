// Cart functionality for BrewAura

// Cart data structure
let cart = JSON.parse(localStorage.getItem('brewAuraCart')) || [];

// Price mapping in Indian Rupees
const itemPrices = {
    'espresso': 180,
    'cappuccino': 240,
    'latte': 260,
    'americano': 200,
    'mocha': 290,
    'macchiato': 220,
    'cold-brew': 250,
    'flat-white': 260,
    'croissant': 190,
    'muffin': 180,
    'donut': 150,
    'sandwich': 350,
    'cookie': 140,
    'brownie': 210
};

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart functionality based on page
    if (document.getElementById('menu-grid')) {
        initMenuPage();
    } else if (document.getElementById('cart-items')) {
        initCartPage();
    }
    
    // Update cart count in navigation
    updateCartCount();
});

// Initialize Menu Page
function initMenuPage() {
    // Filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Filter menu items
            const filter = this.getAttribute('data-filter');
            filterMenuItems(filter);
        });
    });
    
    // Add to cart buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart')) {
            const itemElement = e.target.closest('.menu-item');
            const itemId = itemElement.getAttribute('data-id');
            const itemName = itemElement.querySelector('h3').textContent;
            const itemPrice = itemPrices[itemId];
            const itemImage = itemElement.querySelector('img').getAttribute('src');
            const itemCategory = itemElement.getAttribute('data-category');
            
            addToCart({
                id: itemId,
                name: itemName,
                price: itemPrice,
                image: itemImage,
                category: itemCategory
            });
            
            // Show confirmation
            showConfirmation(`${itemName} added to cart!`);
        }
    });
}

// Filter Menu Items
function filterMenuItems(filter) {
    const menuItems = document.querySelectorAll('.menu-item');
    
    menuItems.forEach(item => {
        if (filter === 'all' || item.getAttribute('data-category') === filter) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

// Add item to cart
function addToCart(item) {
    // Check if item already exists in cart
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...item,
            quantity: 1
        });
    }
    
    // Save to localStorage
    localStorage.setItem('brewAuraCart', JSON.stringify(cart));
    
    // Update cart count
    updateCartCount();
}

// Remove item from cart
function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    localStorage.setItem('brewAuraCart', JSON.stringify(cart));
    updateCartCount();
    renderCartItems();
}

// Update item quantity in cart
function updateQuantity(itemId, newQuantity) {
    if (newQuantity < 1) {
        removeFromCart(itemId);
        return;
    }
    
    const item = cart.find(item => item.id === itemId);
    if (item) {
        item.quantity = newQuantity;
        localStorage.setItem('brewAuraCart', JSON.stringify(cart));
        updateCartCount();
        renderCartItems();
    }
}

// Initialize Cart Page
function initCartPage() {
    renderCartItems();
    
    // Event delegation for quantity buttons and remove buttons
    document.addEventListener('click', function(e) {
        // Quantity decrease
        if (e.target.classList.contains('decrease')) {
            const itemId = e.target.closest('.cart-item').getAttribute('data-id');
            const item = cart.find(item => item.id === itemId);
            if (item) {
                updateQuantity(itemId, item.quantity - 1);
            }
        }
        
        // Quantity increase
        if (e.target.classList.contains('increase')) {
            const itemId = e.target.closest('.cart-item').getAttribute('data-id');
            const item = cart.find(item => item.id === itemId);
            if (item) {
                updateQuantity(itemId, item.quantity + 1);
            }
        }
        
        // Remove item
        if (e.target.classList.contains('remove-item')) {
            const itemId = e.target.closest('.cart-item').getAttribute('data-id');
            removeFromCart(itemId);
        }
    });
    
    // Checkout button
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (cart.length === 0) {
                showConfirmation('Your cart is empty. Please add items before checking out.');
                return;
            }
            
            window.location.href = 'order.html';
        });
    }
}

// Render cart items on cart page
function renderCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    const cartTaxElement = document.getElementById('cart-tax');
    const cartGrandTotalElement = document.getElementById('cart-grand-total');
    const emptyCartElement = document.getElementById('empty-cart');
    const cartSummaryElement = document.getElementById('cart-summary');
    
    if (!cartItemsContainer) return;
    
    // Clear existing items
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        // Show empty cart message
        if (emptyCartElement) emptyCartElement.style.display = 'block';
        if (cartSummaryElement) cartSummaryElement.style.display = 'none';
        return;
    }
    
    // Hide empty cart message
    if (emptyCartElement) emptyCartElement.style.display = 'none';
    if (cartSummaryElement) cartSummaryElement.style.display = 'block';
    
    // Calculate totals
    let subtotal = 0;
    
    // Render each cart item
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        const cartItemElement = document.createElement('div');
        cartItemElement.className = 'cart-item';
        cartItemElement.setAttribute('data-id', item.id);
        cartItemElement.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <div class="cart-item-price">${formatCurrency(item.price)}</div>
            </div>
            <div class="cart-item-quantity">
                <button class="quantity-btn decrease">-</button>
                <span>${item.quantity}</span>
                <button class="quantity-btn increase">+</button>
            </div>
            <div class="cart-item-total">${formatCurrency(itemTotal)}</div>
            <button class="remove-item">&times;</button>
        `;
        
        cartItemsContainer.appendChild(cartItemElement);
    });
    
    // Calculate tax (5% GST)
    const tax = calculateTax(subtotal);
    const grandTotal = subtotal + tax;
    
    // Update totals
    if (cartTotalElement) {
        cartTotalElement.textContent = formatCurrency(subtotal);
    }
    if (cartTaxElement) {
        cartTaxElement.textContent = formatCurrency(tax);
    }
    if (cartGrandTotalElement) {
        cartGrandTotalElement.textContent = formatCurrency(grandTotal);
    }
}

// Calculate tax (5% GST for India)
function calculateTax(subtotal) {
    return Math.round(subtotal * 0.05); // 5% GST
}

// Update cart count in navigation
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (!cartCount) return;
    
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
}

// Utility function to format Indian Rupees
function formatCurrency(amount) {
    return '₹' + Math.round(amount).toLocaleString('en-IN');
}

// Show confirmation message
function showConfirmation(message) {
    // Create modal if it doesn't exist
    let modal = document.getElementById('confirmation-modal');
    
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'confirmation-modal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>Success!</h3>
                <p>${message}</p>
                <div class="modal-buttons">
                    <button class="btn-primary" id="modal-ok">OK</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Add event listener to close modal
        document.getElementById('modal-ok').addEventListener('click', function() {
            modal.style.display = 'none';
        });
        
        // Close modal when clicking outside
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    } else {
        // Update message if modal exists
        modal.querySelector('p').textContent = message;
    }
    
    modal.style.display = 'flex';
}