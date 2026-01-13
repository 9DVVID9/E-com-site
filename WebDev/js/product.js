// Product Detail Page JavaScript

var currentProduct = null;
var quantity = 1;

window.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    loadProductDetails();
});

function loadProductDetails() {
    var urlParams = new URLSearchParams(window.location.search);
    var productId = urlParams.get('id');

    if (!productId) {
        displayError('Product not found');
        return;
    }

    fetchProductById(productId).then(function(product) {
        if (product) {
            currentProduct = product;
            displayProduct();
        } else {
            displayError('Product not found');
        }
    });
}

function displayProduct() {
    const container = document.getElementById('productDetailContainer');

    let stockBadge = 'In Stock';
    let stockClass = 'in-stock';

    if (currentProduct.stock === 0) {
        stockBadge = 'Out of Stock';
        stockClass = 'out-of-stock';
    } else if (currentProduct.stock < 10) {
        stockBadge = 'Low Stock';
        stockClass = 'low-stock';
    }

    const disabled = currentProduct.stock === 0 ? 'disabled' : '';

    container.innerHTML = `
        <div class="product-container">
            <div class="product-grid">

                <div class="product-image-section">
                    <img src="${currentProduct.image}" alt="${currentProduct.name}" class="product-image">
                    <span class="stock-badge ${stockClass}">${stockBadge}</span>
                </div>

                <div class="product-info-section">
                    <span class="product-category">${currentProduct.category}</span>
                    <h1 class="product-title">${currentProduct.name}</h1>
                    <div class="product-price">$${currentProduct.price.toFixed(2)}</div>
                    <p class="product-description">${currentProduct.description}</p>

                    <div class="product-specs">
                        <h3>Product Specifications</h3>
                        <div class="spec-row"><span>Category:</span><span>${currentProduct.category}</span></div>
                        <div class="spec-row"><span>Price:</span><span>$${currentProduct.price.toFixed(2)}</span></div>
                        <div class="spec-row"><span>Availability:</span><span>${currentProduct.stock} units</span></div>
                        <div class="spec-row"><span>Product ID:</span><span>#${currentProduct.id}</span></div>
                    </div>

                    <div class="quantity-section">
                        <label>Quantity:</label>
                        <div class="quantity-controls">
                            <button onclick="decreaseQuantity()">-</button>
                            <span id="quantityDisplay">1</span>
                            <button onclick="increaseQuantity()">+</button>
                        </div>
                    </div>

                    <div class="action-buttons">
                        <button onclick="addToCartProduct()" ${disabled}>Add to Cart</button>
                        <button onclick="buyNow()" ${disabled}>Buy Now</button>
                    </div>
                </div>
            </div>

            <div class="related-products">
                <h3>Related Products</h3>
                <div id="relatedProductsGrid"></div>
            </div>
        </div>
    `;

    displayRelatedProducts();
}


function displayRelatedProducts() {
    fetchProducts().then(function (allProducts) {

        var related = allProducts
            .filter(function (p) {
                return p.category === currentProduct.category && p.id !== currentProduct.id;
            })
            .slice(0, 4);

        var grid = document.getElementById('relatedProductsGrid');

        var html = related.map(function (product) {
            return `
                <div class="related-card" onclick="viewProduct(${product.id})">
                    <img src="${product.image}" alt="${product.name}" class="related-image">
                    <div class="related-info">
                        <div class="related-name">${product.name}</div>
                        <div class="related-price">$${product.price.toFixed(2)}</div>
                    </div>
                </div>
            `;
        }).join('');

        grid.innerHTML = html;
    });
}


function increaseQuantity() {
    if (quantity < currentProduct.stock) {
        quantity++;
        document.getElementById('quantityDisplay').textContent = quantity;
    }
}

function decreaseQuantity() {
    if (quantity > 1) {
        quantity--;
        document.getElementById('quantityDisplay').textContent = quantity;
    }
}

function addToCartProduct() {
    var cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    for (var i = 0; i < quantity; i++) {
        cart.push(currentProduct);
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    alert(quantity + ' x ' + currentProduct.name + ' added to cart!');
    quantity = 1;
    document.getElementById('quantityDisplay').textContent = quantity;
}

function buyNow() {
    addToCartProduct();
    window.location.href = 'cart.html';
}

function viewProduct(productId) {
    window.location.href = 'product.html?id=' + productId;
}

function displayError(message) {
    var container = document.getElementById('productDetailContainer');
    container.innerHTML = '<div class="loading">' + message + '<br><a href="catalog.html" class="btn btn-primary" style="margin-top: 2rem;">Back to Products</a></div>';
}