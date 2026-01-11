// Authentication functionality for BrewAura

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in
    checkLoginStatus();
    
    // Initialize auth page if we're on login page
    if (document.getElementById('login-form')) {
        initAuthPage();
    }
});

// Check login status and update UI
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
    
    userProfile.innerHTML = `
        <a href="profile.html" class="nav-link">
            <div class="user-avatar">${firstLetter}</div>
            <span id="user-name">${user.name.split(' ')[0]}</span>
        </a>
    `;
    
    // Add logout functionality
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
}

// Initialize authentication page
function initAuthPage() {
    // Tab switching
    const tabs = document.querySelectorAll('.auth-tab');
    const forms = document.querySelectorAll('.auth-form');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            
            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding form
            forms.forEach(form => {
                form.classList.remove('active');
                if (form.id === `${tabName}-form`) {
                    form.classList.add('active');
                }
            });
        });
    });
    
    // Switch between login and signup forms
    const switchToLogin = document.querySelector('.switch-to-login');
    if (switchToLogin) {
        switchToLogin.addEventListener('click', function(e) {
            e.preventDefault();
            tabs.forEach(t => t.classList.remove('active'));
            tabs[0].classList.add('active');
            forms.forEach(f => f.classList.remove('active'));
            forms[0].classList.add('active');
        });
    }
    
    // Guest login
    const guestLoginBtn = document.getElementById('guest-login');
    if (guestLoginBtn) {
        guestLoginBtn.addEventListener('click', function() {
            window.location.href = 'index.html';
        });
    }
    
    // Login form submission
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleLogin();
        });
    }
    
    // Signup form submission
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleSignup();
        });
    }
}

// Handle login
function handleLogin() {
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();
    
    // Simple validation
    if (!email || !password) {
        showConfirmation('Please fill in all fields');
        return;
    }
    
    // Check if user exists
    const users = JSON.parse(localStorage.getItem('brewAuraUsers')) || [];
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
        showConfirmation('Invalid email or password');
        return;
    }
    
    // Save current user session
    localStorage.setItem('brewAuraUser', JSON.stringify({
        name: user.name,
        email: user.email
    }));
    
    showConfirmation(`Welcome back, ${user.name}!`);
    
    // Redirect to home page
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
}

// Handle signup
function handleSignup() {
    const name = document.getElementById('signup-name').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value.trim();
    const confirmPassword = document.getElementById('signup-confirm').value.trim();
    
    // Validation
    if (!name || !email || !password || !confirmPassword) {
        showConfirmation('Please fill in all fields');
        return;
    }
    
    if (password.length < 6) {
        showConfirmation('Password must be at least 6 characters');
        return;
    }
    
    if (password !== confirmPassword) {
        showConfirmation('Passwords do not match');
        return;
    }
    
    // Check if email already exists
    const users = JSON.parse(localStorage.getItem('brewAuraUsers')) || [];
    const existingUser = users.find(u => u.email === email);
    
    if (existingUser) {
        showConfirmation('Email already registered. Please login instead.');
        return;
    }
    
    // Add new user (in real app, password would be hashed)
    const newUser = {
        name: name,
        email: email,
        password: password, // Note: In production, NEVER store plain text passwords
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('brewAuraUsers', JSON.stringify(users));
    
    // Auto login after signup
    localStorage.setItem('brewAuraUser', JSON.stringify({
        name: name,
        email: email
    }));
    
    showConfirmation(`Account created successfully! Welcome to BrewAura, ${name}!`);
    
    // Redirect to home page
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
}

// Logout function
function logout() {
    localStorage.removeItem('brewAuraUser');
    showConfirmation('You have been logged out');
    
    // Redirect to home page
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
}

// Show confirmation message (reuse from main.js)
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