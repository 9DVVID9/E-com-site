// Shared functions used across multiple pages

// API Configuration
var API_BASE_URL = 'http://localhost:3000';
var FALLBACK_IMAGE_URL = 'https://placehold.co/600x400?text=No+Image';

// Update cart count in header
function updateCartCount() {
    var cart = JSON.parse(localStorage.getItem('cart') || '[]');
    var cartCountElement = document.getElementById('cartCount');
    if (cartCountElement) {
        cartCountElement.textContent = cart.length;
    }
}

// check if user is logged in
function checkAuth() {
    var user = localStorage.getItem('user');
    if (user) {
        return JSON.parse(user);
    }
    return null;
}

// logout function
function logout() {
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}

// format price to currency
function formatPrice(price) {
    return '$' + parseFloat(price).toFixed(2);
}

// show alert message
function showAlert(message, type) {
    alert(message);
}

// ensure API products expose a usable image property
function normalizeProduct(product) {
    if (!product) return product;
    // handle different database column names for images
    if (!product.image && product.imageurl) {
        product.image = product.imageurl;
    }
    // handle null or empty images
    if (!product.image) {
        product.image = FALLBACK_IMAGE_URL;
    }
    return product;
}

function fetchProducts() {
    return fetch(API_BASE_URL + '/api/products')
        .then(function(response) {
            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }
            return response.json();
        })
        .then(function(products) {
            return products.map(function(p) { return normalizeProduct(p); });
        })
        .catch(function(error) {
            console.error('Error fetching products:', error);
            // return empty array instead of missing mockProducts
            return [];
        });
}

function fetchProductById(productId) {
    return fetch(API_BASE_URL + '/api/products/' + productId)
        .then(function(response) {
            if (!response.ok) {
                throw new Error('Product not found');
            }
            return response.json();
        })
        .then(function(product) {
            return normalizeProduct(product);
        })
        .catch(function(error) {
            console.error('Error fetching product:', error);
            // return null instead of missing mockProducts
            return null;
        });
}

// initialize cart count on page load
window.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
});