// Main JavaScript for BrewAura Website

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart count
    updateCartCount();
    
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
                <h3>Order Confirmation</h3>
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