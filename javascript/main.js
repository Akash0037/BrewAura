// Main JavaScript for BrewAura Website

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart count
    updateCartCount();
    
    // Check login status on page load
    checkLoginStatus();
    
    // Mobile Navigation Toggle
    const menuBar = document.getElementById('menuBar');
    const navMenu = document.getElementById('nav-menu');
    
    if (menuBar && navMenu) {
        menuBar.addEventListener('click', function() {
            menuBar.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                menuBar.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
    
    // Order Now Button Scroll
    const orderNowBtn = document.getElementById('order-now-btn');
    if (orderNowBtn) {
        orderNowBtn.addEventListener('click', function() {
            window.location.href = 'menu.html';
        });
    }
    
    // Testimonial Carousel
    initTestimonialCarousel();
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.backgroundColor = 'rgba(255, 248, 231, 0.98)';
            navbar.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.backgroundColor = 'rgba(255, 248, 231, 0.95)';
            navbar.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        }
    });
    
    // Initialize menu filter if on menu page
    if (document.querySelector('.menu-filters')) {
        initMenuFilters();
    }
});

// Testimonial Carousel Function
function initTestimonialCarousel() {
    const testimonials = document.querySelectorAll('.testimonial');
    const dots = document.querySelectorAll('.dot');
    let currentIndex = 0;
    
    if (testimonials.length === 0) return;
    
    // Function to show testimonial
    function showTestimonial(index) {
        testimonials.forEach(testimonial => {
            testimonial.classList.remove('active');
        });
        
        dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        testimonials[index].classList.add('active');
        dots[index].classList.add('active');
        currentIndex = index;
    }
    
    // Dot click events
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            showTestimonial(index);
        });
    });
    
    // Auto rotate testimonials
    setInterval(function() {
        currentIndex = (currentIndex + 1) % testimonials.length;
        showTestimonial(currentIndex);
    }, 5000);
}

// Update Cart Count in Navigation
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (!cartCount) return;
    
    const cart = JSON.parse(localStorage.getItem('brewAuraCart')) || [];
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    cartCount.textContent = totalItems;
}

// Utility function to format currency
function formatCurrency(amount) {
    return '₹' + Math.round(amount).toLocaleString('en-IN');
}

// Show confirmation modal
function showConfirmation(message) {
    // Create modal if it doesn't exist
    let modal = document.getElementById('confirmation-modal');
    
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'confirmation-modal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>Notification</h3>
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

// Check login status
function checkLoginStatus() {
    const user = JSON.parse(localStorage.getItem('brewAuraUser'));
    const userNameElement = document.getElementById('user-name');
    
    if (user && userNameElement) {
        // User is logged in
        userNameElement.textContent = user.name.split(' ')[0]; // Show first name
        updateNavForLoggedInUser(user);
    }
}

// Update navigation for logged in user
function updateNavForLoggedInUser(user) {
    const userProfile = document.querySelector('.user-profile');
    if (!userProfile) return;
    
    // Create avatar with first letter
    const firstLetter = user.name.charAt(0).toUpperCase();
    
    // Update the user profile link
    userProfile.innerHTML = `
        <a href="javascript:void(0)" class="nav-link user-dropdown-trigger">
            <div class="user-avatar">${firstLetter}</div>
            <span id="user-name">${user.name.split(' ')[0]}</span>
        </a>
        <div class="user-dropdown" id="user-dropdown">
            <a href="profile.html">My Profile</a>
            <a href="orders.html">My Orders</a>
            <div class="divider"></div>
            <a href="javascript:void(0)" id="logout-btn">Logout</a>
        </div>
    `;
    
    // Add dropdown toggle functionality
    const dropdownTrigger = document.querySelector('.user-dropdown-trigger');
    const dropdown = document.getElementById('user-dropdown');
    
    if (dropdownTrigger && dropdown) {
        dropdownTrigger.addEventListener('click', function(e) {
            e.preventDefault();
            dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!dropdown.contains(e.target) && !dropdownTrigger.contains(e.target)) {
                dropdown.style.display = 'none';
            }
        });
    }
    
    // Add logout functionality
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }
}

// Logout function
function logout() {
    localStorage.removeItem('brewAuraUser');
    
    // Update navigation
    const userProfile = document.querySelector('.user-profile');
    if (userProfile) {
        userProfile.innerHTML = `
            <a href="login.html" class="nav-link">
                <span id="user-name">Login</span>
            </a>
        `;
    }
    
    showConfirmation('You have been logged out');
    
    // Redirect to home page after a short delay
    setTimeout(() => {
        if (!window.location.href.includes('login.html')) {
            window.location.href = 'index.html';
        }
    }, 1500);
}

// Initialize menu filters
function initMenuFilters() {
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
}

// Filter Menu Items
function filterMenuItems(filter) {
    const menuItems = document.querySelectorAll('.menu-item');
    
    menuItems.forEach(item => {
        if (filter === 'all' || item.getAttribute('data-category') === filter) {
            item.style.display = 'block';
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, 10);
        } else {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            setTimeout(() => {
                item.style.display = 'none';
            }, 300);
        }
    });
}

// Initialize menu page functionality (if not already in cart.js)
function initMenuPage() {
    // Add to cart buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart')) {
            const itemElement = e.target.closest('.menu-item');
            const itemId = itemElement.getAttribute('data-id');
            const itemName = itemElement.querySelector('h3').textContent;
            
            // Get price from data attribute or fallback to price mapping
            let itemPrice = itemElement.getAttribute('data-price');
            if (!itemPrice) {
                // Fallback price mapping (should be in cart.js)
                const priceMapping = {
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
                itemPrice = priceMapping[itemId] || 0;
            }
            
            const itemImage = itemElement.querySelector('img').getAttribute('src');
            const itemCategory = itemElement.getAttribute('data-category');
            
            // Call addToCart function from cart.js
            if (typeof addToCart === 'function') {
                addToCart({
                    id: itemId,
                    name: itemName,
                    price: parseInt(itemPrice),
                    image: itemImage,
                    category: itemCategory
                });
                
                // Show confirmation
                showConfirmation(`${itemName} added to cart!`);
            } else {
                console.error('addToCart function not found. Make sure cart.js is loaded.');
            }
        }
    });
}

// Add event listener for menu page initialization
if (document.querySelector('.menu-grid')) {
    // Add price data attributes to menu items
    document.querySelectorAll('.menu-item').forEach(item => {
        const priceElement = item.querySelector('.menu-item-price');
        if (priceElement) {
            const priceText = priceElement.textContent;
            const priceMatch = priceText.match(/₹(\d+)/);
            if (priceMatch) {
                item.setAttribute('data-price', priceMatch[1]);
            }
        }
    });
    
    // Initialize menu page after a short delay to ensure cart.js is loaded
    setTimeout(() => {
        initMenuPage();
    }, 100);
}