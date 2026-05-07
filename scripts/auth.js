/**
 * HERITAGE RICE EXPORTS - AUTHENTICATION MODULE
 * Handles user login, registration, and session management
 */

let authState = {
    isLoggedIn: false,
    currentUser: null,
    userType: null, // 'retail' or 'institutional'
    users: [
        {
            id: 'user1',
            email: 'buyer@company.com',
            password: 'password123', // In production, this would be hashed
            name: 'John Buyer',
            company: 'Premium Foods Inc.',
            userType: 'institutional',
            role: 'buyer'
        }
    ]
};

// Initialize authentication
function initializeAuth() {
    const savedAuth = localStorage.getItem('heritage_rice_auth');
    if (savedAuth) {
        authState = JSON.parse(savedAuth);
    }
}

// Login user
function loginUser(email, password) {
    const user = authState.users.find(u => u.email === email && u.password === password);
    
    if (!user) {
        showNotification('Invalid email or password', 'error');
        return false;
    }

    authState.isLoggedIn = true;
    authState.currentUser = { ...user };
    delete authState.currentUser.password; // Don't store password in state
    authState.userType = user.userType;
    
    saveAuthState();
    showNotification(`Welcome back, ${user.name}!`, 'success');
    
    return true;
}

// Register new user
function registerUser(formData) {
    // Check if email already exists
    if (authState.users.some(u => u.email === formData.email)) {
        showNotification('Email already registered', 'error');
        return false;
    }

    const newUser = {
        id: 'user' + (authState.users.length + 1),
        email: formData.email,
        password: formData.password, // In production, hash this
        name: formData.fullName,
        company: formData.company,
        userType: formData.userType || 'institutional',
        role: formData.userType === 'institutional' ? 'buyer' : 'customer',
        registrationDate: new Date().toISOString()
    };

    authState.users.push(newUser);
    
    // Auto-login after registration
    authState.isLoggedIn = true;
    authState.currentUser = { ...newUser };
    delete authState.currentUser.password;
    authState.userType = newUser.userType;
    
    saveAuthState();
    showNotification('Registration successful! Welcome to Guru Teja!', 'success');
    
    return true;
}

// Logout user
function logoutUser() {
    authState.isLoggedIn = false;
    authState.currentUser = null;
    authState.userType = null;
    
    saveAuthState();
    showNotification('You have been logged out', 'info');
    navigateTo('home');
}

// Update user profile
function updateUserProfile(updates) {
    if (!authState.currentUser) return false;

    const userIndex = authState.users.findIndex(u => u.id === authState.currentUser.id);
    if (userIndex !== -1) {
        authState.users[userIndex] = { ...authState.users[userIndex], ...updates };
        authState.currentUser = { ...authState.users[userIndex] };
        delete authState.currentUser.password;
        saveAuthState();
        showNotification('Profile updated successfully', 'success');
        return true;
    }
    return false;
}

// Change password
function changePassword(currentPassword, newPassword) {
    if (!authState.currentUser) return false;

    const user = authState.users.find(u => u.id === authState.currentUser.id);
    
    if (!user || user.password !== currentPassword) {
        showNotification('Current password is incorrect', 'error');
        return false;
    }

    if (newPassword.length < 6) {
        showNotification('Password must be at least 6 characters', 'error');
        return false;
    }

    user.password = newPassword;
    saveAuthState();
    showNotification('Password changed successfully', 'success');
    return true;
}

// Save auth state to localStorage
function saveAuthState() {
    const stateToSave = { ...authState };
    localStorage.setItem('heritage_rice_auth', JSON.stringify(stateToSave));
}

// Check if user is logged in
function isUserLoggedIn() {
    return authState.isLoggedIn && authState.currentUser !== null;
}

// Get current user
function getCurrentUser() {
    return authState.currentUser;
}

// Get user type
function getUserType() {
    return authState.userType;
}

// Render login page
function renderLoginPage() {
    const loginHTML = `
        <div class="grid grid-cols-2 gap-12 items-center">
            <!-- Left Side - Features -->
            <div class="space-y-8">
                <div>
                    <h1 class="font-display-lg text-display-lg text-primary mb-4">Welcome Back</h1>
                    <p class="font-body-lg text-on-surface-variant">Sign in to your account to access your orders and preferences.</p>
                </div>

                <div class="space-y-6">
                    <div class="flex items-start gap-4">
                        <span class="material-symbols-outlined text-secondary text-3xl mt-1">verified</span>
                        <div>
                            <h3 class="font-headline-md text-primary mb-2">Secure Account</h3>
                            <p class="font-body-md text-on-surface-variant">Your data is protected with enterprise-level security.</p>
                        </div>
                    </div>
                    <div class="flex items-start gap-4">
                        <span class="material-symbols-outlined text-secondary text-3xl mt-1">dashboard</span>
                        <div>
                            <h3 class="font-headline-md text-primary mb-2">Order Tracking</h3>
                            <p class="font-body-md text-on-surface-variant">Track shipments in real-time from our dashboard.</p>
                        </div>
                    </div>
                    <div class="flex items-start gap-4">
                        <span class="material-symbols-outlined text-secondary text-3xl mt-1">local_shipping</span>
                        <div>
                            <h3 class="font-headline-md text-primary mb-2">Fast Delivery</h3>
                            <p class="font-body-md text-on-surface-variant">45-60 day delivery to major ports globally.</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Right Side - Login Form -->
            <div class="bg-surface-container p-12 rounded-xl space-y-6">
                <form id="loginForm" onsubmit="handleLoginSubmit(event)">
                    <div class="space-y-2 mb-6">
                        <label class="font-label-caps text-label-caps text-on-surface-variant uppercase">Email Address</label>
                        <input type="email" name="email" required placeholder="your@company.com" 
                            class="w-full border border-neutral-300 px-4 py-3 font-body-md focus:ring-primary rounded"/>
                    </div>

                    <div class="space-y-2 mb-6">
                        <label class="font-label-caps text-label-caps text-on-surface-variant uppercase">Password</label>
                        <input type="password" name="password" required placeholder="••••••••"
                            class="w-full border border-neutral-300 px-4 py-3 font-body-md focus:ring-primary rounded"/>
                        <p class="font-label-caps text-[11px] text-on-surface-variant">Demo: buyer@company.com / password123</p>
                    </div>

                    <button type="submit" class="w-full bg-primary text-on-primary py-4 font-button text-button uppercase mb-4 hover:bg-neutral-800 transition">
                        Sign In
                    </button>
                </form>

                <div class="relative">
                    <div class="absolute inset-0 flex items-center">
                        <div class="w-full border-t border-neutral-300"></div>
                    </div>
                    <div class="relative flex justify-center text-sm">
                        <span class="px-2 bg-surface-container text-on-surface-variant">New to Guru Teja?</span>
                    </div>
                </div>

                <button type="button" onclick="navigateTo('register')" class="w-full border-2 border-primary text-primary py-4 font-button text-button uppercase hover:bg-primary hover:text-white transition">
                    Create Account
                </button>

                <button type="button" onclick="navigateTo('home')" class="w-full text-neutral-500 py-2 font-button text-button hover:text-primary transition">
                    Continue as Guest
                </button>
            </div>
        </div>
    `;

    const loginPage = document.getElementById('login-page');
    if (loginPage) {
        loginPage.innerHTML = loginHTML;
    }
}

// Handle login form submission
function handleLoginSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const email = form.email.value;
    const password = form.password.value;

    if (loginUser(email, password)) {
        setTimeout(() => {
            navigateTo('user-dashboard');
        }, 500);
    }
}

// Render registration page
function renderRegisterPage() {
    const registerHTML = `
        <div class="max-w-2xl mx-auto">
            <div class="mb-12 text-center">
                <h1 class="font-display-lg text-display-lg text-primary mb-4">Create Your Account</h1>
                <p class="font-body-lg text-on-surface-variant">Join Guru Teja for wholesale rice export opportunities.</p>
            </div>

            <div class="bg-surface-container p-12 rounded-xl">
                <form id="registerForm" onsubmit="handleRegisterSubmit(event)" class="space-y-6">
                    <!-- Account Type -->
                    <div>
                        <label class="font-label-caps text-label-caps text-on-surface-variant uppercase block mb-3">Account Type</label>
                        <div class="flex gap-4">
                            <label class="flex-1 border-2 border-neutral-300 p-4 rounded cursor-pointer hover:border-primary flex items-center">
                                <input type="radio" name="userType" value="institutional" checked onchange="renderRegisterPage()" class="mr-3"/>
                                <span class="font-body-md">Institutional Buyer</span>
                            </label>
                            <label class="flex-1 border-2 border-neutral-300 p-4 rounded cursor-pointer hover:border-primary flex items-center">
                                <input type="radio" name="userType" value="retail" onchange="renderRegisterPage()" class="mr-3"/>
                                <span class="font-body-md">Retail Buyer</span>
                            </label>
                        </div>
                    </div>

                    <!-- Company Info -->
                    <div>
                        <label class="font-label-caps text-label-caps text-on-surface-variant uppercase block mb-2">Company Name *</label>
                        <input type="text" name="company" required placeholder="Your Company"
                            class="w-full border border-neutral-300 px-4 py-3 font-body-md focus:ring-primary rounded"/>
                    </div>

                    <!-- Personal Info -->
                    <div class="grid grid-cols-2 gap-6">
                        <div>
                            <label class="font-label-caps text-label-caps text-on-surface-variant uppercase block mb-2">Full Name *</label>
                            <input type="text" name="fullName" required placeholder="Your Name"
                                class="w-full border border-neutral-300 px-4 py-3 font-body-md focus:ring-primary rounded"/>
                        </div>
                        <div>
                            <label class="font-label-caps text-label-caps text-on-surface-variant uppercase block mb-2">Email *</label>
                            <input type="email" name="email" required placeholder="your@company.com"
                                class="w-full border border-neutral-300 px-4 py-3 font-body-md focus:ring-primary rounded"/>
                        </div>
                    </div>

                    <!-- Password -->
                    <div class="grid grid-cols-2 gap-6">
                        <div>
                            <label class="font-label-caps text-label-caps text-on-surface-variant uppercase block mb-2">Password *</label>
                            <input type="password" name="password" required placeholder="Minimum 6 characters"
                                class="w-full border border-neutral-300 px-4 py-3 font-body-md focus:ring-primary rounded"/>
                        </div>
                        <div>
                            <label class="font-label-caps text-label-caps text-on-surface-variant uppercase block mb-2">Confirm Password *</label>
                            <input type="password" name="confirmPassword" required placeholder="Repeat password"
                                class="w-full border border-neutral-300 px-4 py-3 font-body-md focus:ring-primary rounded"/>
                        </div>
                    </div>

                    <!-- Terms -->
                    <label class="flex items-start gap-3 mb-6">
                        <input type="checkbox" name="agreeToTerms" required class="mt-1 focus:ring-primary"/>
                        <span class="font-body-md text-on-surface-variant">I agree to the Terms of Service and Privacy Policy</span>
                    </label>

                    <button type="submit" class="w-full bg-primary text-on-primary py-4 font-button text-button uppercase hover:bg-neutral-800 transition">
                        Create Account
                    </button>

                    <button type="button" onclick="navigateTo('login')" class="w-full text-primary py-2 font-button text-button hover:underline">
                        Already have an account? Sign in
                    </button>
                </form>
            </div>
        </div>
    `;

    const registerPage = document.getElementById('register-page');
    if (registerPage) {
        registerPage.innerHTML = registerHTML;
    }
}

// Handle registration form submission
function handleRegisterSubmit(event) {
    event.preventDefault();
    const form = event.target;

    if (form.password.value !== form.confirmPassword.value) {
        showNotification('Passwords do not match', 'error');
        return;
    }

    const formData = {
        email: form.email.value,
        password: form.password.value,
        fullName: form.fullName.value,
        company: form.company.value,
        userType: form.userType.value
    };

    if (registerUser(formData)) {
        setTimeout(() => {
            navigateTo('user-dashboard');
        }, 500);
    }
}

// Render user profile/dashboard
function renderUserDashboard() {
    if (!authState.currentUser) {
        navigateTo('login');
        return;
    }

    const userHTML = `
        <h1 class="font-display-lg text-display-lg text-primary mb-8">Welcome, ${authState.currentUser.name}!</h1>

        <div class="grid grid-cols-3 gap-8 mb-12">
            <!-- Profile Card -->
            <div class="bg-surface-container p-8 rounded-xl">
                <h2 class="font-headline-md text-headline-md text-primary mb-6">Profile Information</h2>
                <div class="space-y-4 mb-6">
                    <div>
                        <p class="font-label-caps text-[12px] text-on-surface-variant uppercase">Name</p>
                        <p class="font-body-md text-primary">${authState.currentUser.name}</p>
                    </div>
                    <div>
                        <p class="font-label-caps text-[12px] text-on-surface-variant uppercase">Email</p>
                        <p class="font-body-md text-primary">${authState.currentUser.email}</p>
                    </div>
                    <div>
                        <p class="font-label-caps text-[12px] text-on-surface-variant uppercase">Company</p>
                        <p class="font-body-md text-primary">${authState.currentUser.company}</p>
                    </div>
                    <div>
                        <p class="font-label-caps text-[12px] text-on-surface-variant uppercase">Account Type</p>
                        <p class="font-body-md text-primary uppercase">${authState.currentUser.userType}</p>
                    </div>
                </div>
                <button class="w-full border border-primary text-primary py-3 font-button mb-3" onclick="navigateTo('profile-edit')">
                    Edit Profile
                </button>
                <button class="w-full bg-error text-white py-3 font-button" onclick="logoutUser()">
                    Sign Out
                </button>
            </div>

            <!-- Quick Stats -->
            <div class="space-y-4">
                <div class="bg-secondary-container/20 p-6 rounded-xl">
                    <p class="font-label-caps text-[12px] text-on-surface-variant uppercase mb-2">Total Orders</p>
                    <p class="font-display-lg text-secondary">3</p>
                </div>
                <div class="bg-secondary-container/20 p-6 rounded-xl">
                    <p class="font-label-caps text-[12px] text-on-surface-variant uppercase mb-2">Total Spent</p>
                    <p class="font-display-lg text-secondary">$12,500</p>
                </div>
                <div class="bg-secondary-container/20 p-6 rounded-xl">
                    <p class="font-label-caps text-[12px] text-on-surface-variant uppercase mb-2">Active Shipments</p>
                    <p class="font-display-lg text-secondary">1</p>
                </div>
            </div>

            <!-- Actions -->
            <div class="space-y-4">
                <button class="w-full bg-primary text-on-primary py-4 font-button uppercase rounded-xl hover:bg-neutral-800 transition flex items-center justify-center gap-2" onclick="navigateTo('catalog')">
                    <span class="material-symbols-outlined">shopping_cart</span>
                    Browse Products
                </button>
                <button class="w-full border-2 border-primary text-primary py-4 font-button uppercase rounded-xl hover:bg-primary hover:text-white transition flex items-center justify-center gap-2" onclick="navigateTo('export-tracking')">
                    <span class="material-symbols-outlined">local_shipping</span>
                    Track Orders
                </button>
                <button class="w-full border-2 border-neutral-300 text-primary py-4 font-button uppercase rounded-xl hover:bg-neutral-100 transition flex items-center justify-center gap-2" onclick="navigateTo('admin-dashboard')">
                    <span class="material-symbols-outlined">dashboard</span>
                    Dashboard
                </button>
            </div>
        </div>

        <!-- Recent Orders -->
        <div class="bg-surface-container p-8 rounded-xl">
            <h2 class="font-headline-md text-headline-md text-primary mb-6">Recent Orders</h2>
            <div class="text-center py-12 text-on-surface-variant">
                <p class="font-body-md mb-4">No orders yet</p>
                <button class="text-primary font-button hover:underline" onclick="navigateTo('catalog')">
                    Place your first order
                </button>
            </div>
        </div>
    `;

    const dashboardPage = document.getElementById('user-dashboard');
    if (dashboardPage) {
        dashboardPage.innerHTML = userHTML;
    }
}

// Initialize on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAuth);
} else {
    initializeAuth();
}
