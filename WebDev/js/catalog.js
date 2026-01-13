// catalog page specific JavaScript

var allProducts = [];
var filteredProducts = [];
var selectedCategory = 'all';

// initialize catalog page when DOM is loaded
window.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    updateCartCount();
    setupEventListeners();
});

// load products from API
function loadProducts() {
    fetchProducts().then(function(products) {
        allProducts = products;
        filteredProducts = allProducts;
        displayProducts();
    });
}

// display products in the grid
function displayProducts() {
    var grid = document.getElementById('productsGrid');
    var countElement = document.getElementById('productCount');

    if (!grid) return;

    countElement.textContent = filteredProducts.length;

    if (filteredProducts.length === 0) {
        grid.innerHTML = '<p class="no-products">No products found</p>';
        return;
    }

    var html = filteredProducts.map(function (product) {

        var disabled = product.stock === 0 ? 'disabled' : '';
        var stockText = product.stock === 0
            ? 'Out of Stock'
            : 'Stock: ' + product.stock;

        var opacityStyle = product.stock === 0 ? 'opacity: 0.6;' : '';
        var price = parseFloat(product.price) || 0;

        return `
            <article class="product-card" style="${opacityStyle}">
                <img src="${product.image}" alt="${product.name}" class="product-image">

                <div class="product-info">
                    <span class="product-category">${product.category}</span>
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-description">${product.description}</p>

                    <div class="product-footer">
                        <span class="product-price">$${price.toFixed(2)}</span>
                        <span class="product-stock">${stockText}</span>
                    </div>

                    <div class="product-actions">
                        <button class="btn btn-primary"
                                onclick="addToCart(${product.id})"
                                ${disabled}>
                            Add to Cart
                        </button>

                        <button class="btn btn-secondary"
                                onclick="viewProduct(${product.id})">
                            View
                        </button>
                    </div>
                </div>
            </article>
        `;
    }).join('');

    grid.innerHTML = html;
}


// setup event listeners for filters and search
function setupEventListeners() {
    // category filter buttons
    var categoryButtons = document.querySelectorAll('.category-btn');
    for (var i = 0; i < categoryButtons.length; i++) {
        categoryButtons[i].addEventListener('click', function() {
            // visually update buttons
            var buttons = document.querySelectorAll('.category-btn');
            for (var j = 0; j < buttons.length; j++) {
                buttons[j].classList.remove('active');
            }
            this.classList.add('active');
            
            // set logic
            selectedCategory = this.getAttribute('data-category');
            
            // clear search bar when clicking a category for better UX
            document.getElementById('searchBar').value = '';
            
            filterProducts();
        });
    }

    // Search bar
    var searchBar = document.getElementById('searchBar');
    if (searchBar) {
        searchBar.addEventListener('input', function() {
            // UX improvement: If typing, automatically switch category to 'All'
            if (this.value.length > 0 && selectedCategory !== 'all') {
                selectedCategory = 'all';
                // Reset buttons visually
                document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
                document.querySelector('.category-btn[data-category="all"]').classList.add('active');
            }
            filterProducts();
        });
    }
}

// Filter products by category and search
function filterProducts() {
    var searchBar = document.getElementById('searchBar');
    var searchTerm = searchBar ? searchBar.value.toLowerCase().trim() : '';
    
    filteredProducts = [];
    for (var i = 0; i < allProducts.length; i++) {
        var product = allProducts[i];
        
        // --- category matching ---
        var productCat = product.category ? product.category.toLowerCase() : '';
        var selectedCat = selectedCategory.toLowerCase();

        // allow "gaming" button to find "gaming equipment" or "gaming pc"
        var isGamingMatch = (selectedCat === 'gaming' && productCat.includes('gaming'));
        var isDirectMatch = (selectedCat === 'all' || productCat === selectedCat);
        var categoryMatch = isDirectMatch || isGamingMatch;
        
        // --- search matching ---
        // Search in Name OR Description OR Category
        var nameMatch = product.name.toLowerCase().indexOf(searchTerm) !== -1;
        var descMatch = product.description && product.description.toLowerCase().indexOf(searchTerm) !== -1;
        var catMatch = productCat.indexOf(searchTerm) !== -1; // Allows searching "Tablet" to find items in Tablet category

        var searchMatch = searchTerm === '' || nameMatch || descMatch || catMatch;
        
        if (categoryMatch && searchMatch) {
            filteredProducts.push(product);
        }
    }

    displayProducts();
}

// Add product to cart
function addToCart(productId) {
    var product = allProducts.find(p => p.id === productId);
    if (!product) return;

    var cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    alert(product.name + ' added to cart!');
}

// View product details
function viewProduct(productId) {
    window.location.href = 'product.html?id=' + productId;
}