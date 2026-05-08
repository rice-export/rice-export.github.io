// Auth page - Login and Register

let isLogin = true;

document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();

  // Redirect if already logged in
  if (window.isAuthenticated()) {
    window.location.href = '/';
  }
});

function setupEventListeners() {
  // Toggle between login and register
  document.getElementById('toggle-auth')?.addEventListener('click', toggleAuthMode);

  // Form submissions
  document.getElementById('login-form')?.addEventListener('submit', handleLogin);
  document.getElementById('register-form')?.addEventListener('submit', handleRegister);

  // Show/hide password
  document.getElementById('show-password')?.addEventListener('change', togglePasswordVisibility);
  document.getElementById('show-password-register')?.addEventListener('change', togglePasswordVisibility);
}

function toggleAuthMode(e) {
  e.preventDefault();
  isLogin = !isLogin;

  const loginSection = document.getElementById('login-section');
  const registerSection = document.getElementById('register-section');
  const toggleBtn = document.getElementById('toggle-auth');

  if (isLogin) {
    loginSection.style.display = 'block';
    registerSection.style.display = 'none';
    toggleBtn.textContent = 'Create new account';
  } else {
    loginSection.style.display = 'none';
    registerSection.style.display = 'block';
    toggleBtn.textContent = 'Already have an account?';
  }
}

async function handleLogin(e) {
  e.preventDefault();

  try {
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    if (!email || !password) {
      window.showNotification('Please fill all fields', 'error');
      return;
    }

    showSpinner();

    const response = await window.apiClient.login(email, password);

    if (response.success) {
      window.showNotification('Login successful!', 'success');
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('userRole', response.data?.role || 'customer');

      // Redirect based on role
      setTimeout(() => {
        if (response.data?.role === 'admin') {
          window.location.href = '/pages/admin-dashboard.html';
        } else if (response.data?.role === 'vendor') {
          window.location.href = '/pages/vendor-dashboard.html';
        } else {
          window.location.href = '/';
        }
      }, 1500);
    } else {
      throw new Error(response.message);
    }
  } catch (error) {
    window.handleApiError(error);
  } finally {
    hideSpinner();
  }
}

async function handleRegister(e) {
  e.preventDefault();

  try {
    const name = document.getElementById('register-name').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const phone = document.getElementById('register-phone').value.trim();
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    const agreeTerms = document.getElementById('agree-terms').checked;

    // Validation
    if (!name || !email || !phone || !password || !confirmPassword) {
      window.showNotification('Please fill all fields', 'error');
      return;
    }

    if (password.length < 6) {
      window.showNotification('Password must be at least 6 characters', 'error');
      return;
    }

    if (password !== confirmPassword) {
      window.showNotification('Passwords do not match', 'error');
      return;
    }

    if (!agreeTerms) {
      window.showNotification('Please agree to terms and conditions', 'error');
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      window.showNotification('Please enter a valid 10-digit phone number', 'error');
      return;
    }

    showSpinner();

    const response = await window.apiClient.register(name, email, phone, password);

    if (response.success) {
      window.showNotification('Registration successful! Please login.', 'success');

      // Auto-fill login form and switch to login
      document.getElementById('login-email').value = email;
      document.getElementById('login-password').value = '';

      setTimeout(() => {
        isLogin = true;
        toggleAuthMode({ preventDefault: () => {} });
      }, 1500);
    } else {
      throw new Error(response.message);
    }
  } catch (error) {
    window.handleApiError(error);
  } finally {
    hideSpinner();
  }
}

function togglePasswordVisibility(e) {
  const passwordInputId = e.target.dataset.target;
  const input = document.getElementById(passwordInputId);

  if (input) {
    input.type = e.target.checked ? 'text' : 'password';
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
