/**
 * SendIT Frontend Application
 * 
 * This JavaScript file handles all frontend functionality:
 * - Authentication (login/register)
 * - API communication
 * - UI interactions
 * - Form handling
 * - Order management
 * 
 * In a production application, you might want to use a framework like React or Vue.js
 * for better organization and state management.
 */

// Application state
const AppState = {
  user: null,
  token: null,
  currentSection: 'home'
};

// API configuration
const API_BASE_URL = window.location.origin + '/api';

// Utility functions
const Utils = {
  // Show loading spinner
  showLoading() {
    document.getElementById('loadingSpinner').style.display = 'flex';
  },

  // Hide loading spinner
  hideLoading() {
    document.getElementById('loadingSpinner').style.display = 'none';
  },

  // Show toast notification
  showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <i class="fas fa-${this.getToastIcon(type)}"></i>
      <span>${message}</span>
    `;
    container.appendChild(toast);

    // Auto remove after 5 seconds
    setTimeout(() => {
      toast.remove();
    }, 5000);
  },

  // Get icon for toast type
  getToastIcon(type) {
    const icons = {
      success: 'check-circle',
      error: 'exclamation-circle',
      warning: 'exclamation-triangle',
      info: 'info-circle'
    };
    return icons[type] || 'info-circle';
  },

  // Format date
  formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  },

  // Format currency
  formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }
};

// API service
const API = {
  // Make authenticated API request
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(AppState.token && { 'Authorization': `Bearer ${AppState.token}` })
      },
      ...options
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // Authentication endpoints
  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },

  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },

  async getProfile() {
    return this.request('/auth/profile');
  },

  // Parcel endpoints
  async createParcel(parcelData) {
    return this.request('/parcels', {
      method: 'POST',
      body: JSON.stringify(parcelData)
    });
  },

  async getParcels() {
    return this.request('/parcels');
  },

  // Order endpoints
  async createOrder(orderData) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    });
  },

  async getOrders() {
    return this.request('/orders');
  },

  async trackOrder(trackingNumber) {
    return this.request(`/orders/track/${trackingNumber}`);
  },

  async updateOrderDestination(orderId, destination) {
    return this.request(`/orders/${orderId}/destination`, {
      method: 'PUT',
      body: JSON.stringify({ destinationLocation: destination })
    });
  },

  async cancelOrder(orderId) {
    return this.request(`/orders/${orderId}/cancel`, {
      method: 'PUT'
    });
  }
};

// Authentication service
const AuthService = {
  // Initialize authentication state
  init() {
    const token = localStorage.getItem('sendit_token');
    const user = localStorage.getItem('sendit_user');

    if (token && user) {
      AppState.token = token;
      AppState.user = JSON.parse(user);
      this.updateUI();
    }
  },

  // Login user
  async login(email, password) {
    try {
      Utils.showLoading();
      const response = await API.login(email, password);
      
      AppState.token = response.data.token;
      AppState.user = response.data.user;
      
      localStorage.setItem('sendit_token', AppState.token);
      localStorage.setItem('sendit_user', JSON.stringify(AppState.user));
      
      this.updateUI();
      Utils.showToast('Login successful!', 'success');
      this.closeModals();
      
      return response;
    } catch (error) {
      Utils.showToast(error.message, 'error');
      throw error;
    } finally {
      Utils.hideLoading();
    }
  },

  // Register user
  async register(userData) {
    try {
      Utils.showLoading();
      const response = await API.register(userData);
      
      AppState.token = response.data.token;
      AppState.user = response.data.user;
      
      localStorage.setItem('sendit_token', AppState.token);
      localStorage.setItem('sendit_user', JSON.stringify(AppState.user));
      
      this.updateUI();
      Utils.showToast('Registration successful!', 'success');
      this.closeModals();
      
      return response;
    } catch (error) {
      Utils.showToast(error.message, 'error');
      throw error;
    } finally {
      Utils.hideLoading();
    }
  },

  // Logout user
  logout() {
    AppState.token = null;
    AppState.user = null;
    localStorage.removeItem('sendit_token');
    localStorage.removeItem('sendit_user');
    this.updateUI();
    Utils.showToast('Logged out successfully', 'info');
    showSection('home');
  },

  // Update UI based on authentication state
  updateUI() {
    const navAuth = document.getElementById('navAuth');
    const navUser = document.getElementById('navUser');
    const userEmail = document.getElementById('userEmail');

    if (AppState.user) {
      navAuth.style.display = 'none';
      navUser.style.display = 'flex';
      userEmail.textContent = AppState.user.email;
    } else {
      navAuth.style.display = 'flex';
      navUser.style.display = 'none';
    }
  },

  // Close all modals
  closeModals() {
    document.getElementById('loginModal').style.display = 'none';
    document.getElementById('registerModal').style.display = 'none';
  }
};

// Order service
const OrderService = {
  // Create new order
  async createOrder() {
    if (!AppState.user) {
      Utils.showToast('Please login to create an order', 'warning');
      return;
    }

    try {
      Utils.showLoading();

      // First create parcel
      const parcelData = {
        description: document.getElementById('parcelDescription').value,
        weight: parseFloat(document.getElementById('parcelWeight').value),
        dimensions: {
          length: parseFloat(document.getElementById('parcelLength').value),
          width: parseFloat(document.getElementById('parcelWidth').value),
          height: parseFloat(document.getElementById('parcelHeight').value)
        },
        value: parseFloat(document.getElementById('parcelValue').value),
        fragile: document.getElementById('parcelFragile').checked
      };

      const parcelResponse = await API.createParcel(parcelData);
      
      // Then create order
      const orderData = {
        parcelId: parcelResponse.data.id,
        pickupLocation: {
          address: document.getElementById('pickupAddress').value,
          latitude: 40.7128, // Mock coordinates - in production, use geocoding
          longitude: -74.0060,
          city: 'New York',
          state: 'NY',
          country: 'USA',
          postalCode: '10001'
        },
        destinationLocation: {
          address: document.getElementById('destinationAddress').value,
          latitude: 34.0522, // Mock coordinates - in production, use geocoding
          longitude: -118.2437,
          city: 'Los Angeles',
          state: 'CA',
          country: 'USA',
          postalCode: '90001'
        }
      };

      const orderResponse = await API.createOrder(orderData);
      
      Utils.showToast('Order created successfully!', 'success');
      this.clearForm();
      showSection('orders');
      this.loadOrders();
      
    } catch (error) {
      Utils.showToast(error.message, 'error');
    } finally {
      Utils.hideLoading();
    }
  },

  // Load user orders
  async loadOrders() {
    if (!AppState.user) return;

    try {
      const response = await API.getOrders();
      this.displayOrders(response.data);
    } catch (error) {
      Utils.showToast('Failed to load orders', 'error');
    }
  },

  // Display orders
  displayOrders(orders) {
    const container = document.getElementById('ordersList');
    
    if (orders.length === 0) {
      container.innerHTML = '<p class="text-center">No orders found. Create your first order!</p>';
      return;
    }

    container.innerHTML = orders.map(order => `
      <div class="order-card">
        <div class="order-header">
          <h3>Order #${order.trackingNumber}</h3>
          <span class="order-status status-${order.status}">${order.status.replace('_', ' ').toUpperCase()}</span>
        </div>
        <div class="order-details">
          <p><strong>Price:</strong> ${Utils.formatCurrency(order.price)}</p>
          <p><strong>Distance:</strong> ${order.distance ? order.distance.toFixed(1) + ' km' : 'N/A'}</p>
          <p><strong>Estimated Delivery:</strong> ${Utils.formatDate(order.estimatedDelivery)}</p>
          <p><strong>Created:</strong> ${Utils.formatDate(order.createdAt)}</p>
        </div>
        <div class="order-actions">
          ${order.status === 'pending' ? `
            <button class="btn btn-outline" onclick="OrderService.cancelOrder('${order.id}')">Cancel</button>
          ` : ''}
        </div>
      </div>
    `).join('');
  },

  // Cancel order
  async cancelOrder(orderId) {
    if (!confirm('Are you sure you want to cancel this order?')) return;

    try {
      await API.cancelOrder(orderId);
      Utils.showToast('Order cancelled successfully', 'success');
      this.loadOrders();
    } catch (error) {
      Utils.showToast(error.message, 'error');
    }
  },

  // Clear create order form
  clearForm() {
    document.getElementById('parcelDescription').value = '';
    document.getElementById('parcelWeight').value = '';
    document.getElementById('parcelValue').value = '';
    document.getElementById('parcelLength').value = '';
    document.getElementById('parcelWidth').value = '';
    document.getElementById('parcelHeight').value = '';
    document.getElementById('parcelFragile').checked = false;
    document.getElementById('pickupAddress').value = '';
    document.getElementById('destinationAddress').value = '';
  }
};

// Track service
const TrackService = {
  // Track order by tracking number
  async trackOrder() {
    const trackingNumber = document.getElementById('trackingNumber').value.trim();
    
    if (!trackingNumber) {
      Utils.showToast('Please enter a tracking number', 'warning');
      return;
    }

    try {
      Utils.showLoading();
      const response = await API.trackOrder(trackingNumber);
      this.displayTrackResult(response.data);
    } catch (error) {
      Utils.showToast(error.message, 'error');
      document.getElementById('trackResult').style.display = 'none';
    } finally {
      Utils.hideLoading();
    }
  },

  // Display tracking result
  displayTrackResult(order) {
    const container = document.getElementById('trackResult');
    container.innerHTML = `
      <div class="order-card">
        <div class="order-header">
          <h3>Order #${order.trackingNumber}</h3>
          <span class="order-status status-${order.status}">${order.status.replace('_', ' ').toUpperCase()}</span>
        </div>
        <div class="order-details">
          <p><strong>Status:</strong> ${order.status.replace('_', ' ').toUpperCase()}</p>
          <p><strong>Price:</strong> ${Utils.formatCurrency(order.price)}</p>
          <p><strong>Distance:</strong> ${order.distance ? order.distance.toFixed(1) + ' km' : 'N/A'}</p>
          <p><strong>Estimated Delivery:</strong> ${Utils.formatDate(order.estimatedDelivery)}</p>
          ${order.currentLocation ? `<p><strong>Current Location:</strong> ${order.currentLocation.address}</p>` : ''}
          ${order.actualDelivery ? `<p><strong>Delivered:</strong> ${Utils.formatDate(order.actualDelivery)}</p>` : ''}
        </div>
      </div>
    `;
    container.style.display = 'block';
  }
};

// Navigation functions
function showSection(sectionId) {
  // Hide all sections
  document.querySelectorAll('.section').forEach(section => {
    section.classList.remove('active');
  });

  // Show selected section
  document.getElementById(sectionId).classList.add('active');

  // Update navigation
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
  });
  document.querySelector(`[onclick="showSection('${sectionId}')"]`)?.classList.add('active');

  // Load section-specific data
  if (sectionId === 'orders') {
    OrderService.loadOrders();
  }

  AppState.currentSection = sectionId;
}

// Modal functions
function showModal(modalId) {
  document.getElementById(modalId).style.display = 'block';
}

function hideModal(modalId) {
  document.getElementById(modalId).style.display = 'none';
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
  // Initialize authentication
  AuthService.init();

  // Navigation toggle for mobile
  document.getElementById('navToggle').addEventListener('click', function() {
    document.getElementById('navMenu').classList.toggle('active');
  });

  // Modal close buttons
  document.querySelectorAll('.close').forEach(button => {
    button.addEventListener('click', function() {
      const modal = this.closest('.modal');
      modal.style.display = 'none';
    });
  });

  // Close modals when clicking outside
  window.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
      event.target.style.display = 'none';
    }
  });

  // Login form
  document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    await AuthService.login(email, password);
  });

  // Register form
  document.getElementById('registerForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const userData = {
      firstName: document.getElementById('registerFirstName').value,
      lastName: document.getElementById('registerLastName').value,
      email: document.getElementById('registerEmail').value,
      phone: document.getElementById('registerPhone').value,
      password: document.getElementById('registerPassword').value
    };
    await AuthService.register(userData);
  });

  // Login button
  document.getElementById('loginBtn').addEventListener('click', function() {
    showModal('loginModal');
  });

  // Register button
  document.getElementById('registerBtn').addEventListener('click', function() {
    showModal('registerModal');
  });

  // Logout button
  document.getElementById('logoutBtn').addEventListener('click', function() {
    AuthService.logout();
  });

  // Create order button
  document.getElementById('createOrderBtn').addEventListener('click', function() {
    OrderService.createOrder();
  });

  // Track button
  document.getElementById('trackBtn').addEventListener('click', function() {
    TrackService.trackOrder();
  });

  // Navigation links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const sectionId = this.getAttribute('href').substring(1);
      showSection(sectionId);
      
      // Close mobile menu
      document.getElementById('navMenu').classList.remove('active');
    });
  });
});

// Make functions globally available
window.showSection = showSection;
window.showModal = showModal;
window.hideModal = hideModal;
window.OrderService = OrderService;
window.TrackService = TrackService;
