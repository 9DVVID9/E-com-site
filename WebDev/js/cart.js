// Shopping Cart Page JavaScript

var cart = [];

window.addEventListener('DOMContentLoaded', function() {
    loadCart();
    displayCart();
    updateSummary();
});

function loadCart() {
    var cartData = localStorage.getItem('cart');
    if (cartData) {
        cart = JSON.parse(cartData);
        cart = groupCartItems(cart);
    }
}

function groupCartItems(items) {
    var grouped = {};
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (grouped[item.id]) {
            grouped[item.id].quantity += 1;
        } else {
            grouped[item.id] = Object.assign({}, item);
            grouped[item.id].quantity = 1;
        }
    }
    
    var result = [];
    for (var id in grouped) {
        result.push(grouped[id]);
    }
    return result;
}

function displayCart() {
    var container = document.getElementById('cartItemsContainer');
    var itemCount = document.getElementById('itemCount');
    var checkoutBtn = document.getElementById('checkoutBtn');

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-icon">🛒</div>
                <p>Your cart is empty</p>
                <a href="catalog.html" class="btn btn-primary">Start Shopping</a>
            </div>
        `;
        itemCount.textContent = '0';
        checkoutBtn.disabled = true;
        return;
    }

    var totalItems = 0;
    for (var i = 0; i < cart.length; i++) {
        totalItems += cart[i].quantity;
    }
    itemCount.textContent = totalItems;
    checkoutBtn.disabled = false;

    var html = cart.map(function (item) {
        return `
            <article class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="item-image">

                <div class="item-details">
                    <span class="item-category">${item.category}</span>
                    <h3 class="item-name">${item.name}</h3>
                    <p class="item-description">${item.description}</p>

                    <div class="item-footer">
                        <span class="item-price">$${item.price.toFixed(2)}</span>

                        <div class="quantity-controls">
                            <button class="quantity-btn"
                                    onclick="decreaseQuantity(${item.id})">-</button>

                            <span class="quantity-display">${item.quantity}</span>

                            <button class="quantity-btn"
                                    onclick="increaseQuantity(${item.id})">+</button>

                            <button class="remove-btn"
                                    onclick="removeItem(${item.id})">
                                Remove
                            </button>
                        </div>
                    </div>
                </div>
            </article>
        `;
    }).join('');

    container.innerHTML = html;
}


function increaseQuantity(productId) {
    for (var i = 0; i < cart.length; i++) {
        if (cart[i].id === productId) {
            cart[i].quantity += 1;
            break;
        }
    }
    saveCart();
    displayCart();
    updateSummary();
}

function decreaseQuantity(productId) {
    for (var i = 0; i < cart.length; i++) {
        if (cart[i].id === productId) {
            if (cart[i].quantity > 1) {
                cart[i].quantity -= 1;
            } else {
                removeItem(productId);
                return;
            }
            break;
        }
    }
    saveCart();
    displayCart();
    updateSummary();
}

function removeItem(productId) {
    cart = cart.filter(function(item) {
        return item.id !== productId;
    });
    saveCart();
    displayCart();
    updateSummary();
}

function saveCart() {
    var flatCart = [];
    for (var i = 0; i < cart.length; i++) {
        for (var j = 0; j < cart[i].quantity; j++) {
            flatCart.push({
                id: cart[i].id,
                name: cart[i].name,
                price: cart[i].price,
                image: cart[i].image,
                category: cart[i].category,
                description: cart[i].description,
                stock: cart[i].stock
            });
        }
    }
    localStorage.setItem('cart', JSON.stringify(flatCart));
}

function updateSummary() {
    var subtotal = 0;
    
    for (var i = 0; i < cart.length; i++) {
        subtotal += cart[i].price * cart[i].quantity;
    }
    
    var tax = subtotal * 0.10;
    var shipping = cart.length > 0 ? 10.00 : 0;
    var total = subtotal + tax + shipping;
    
    document.getElementById('subtotal').textContent = '$' + subtotal.toFixed(2);
    document.getElementById('tax').textContent = '$' + tax.toFixed(2);
    document.getElementById('shipping').textContent = '$' + shipping.toFixed(2);
    document.getElementById('total').textContent = '$' + total.toFixed(2);
}

document.getElementById('checkoutBtn').addEventListener('click', function() {
    var user = localStorage.getItem('user');
    if (!user) {
        alert('Please login to checkout');
        window.location.href = 'login.html';
        return;
    }

    var userData = JSON.parse(user);
    var totalAmount = document.getElementById('total').textContent.replace('$', '');
    
    if (!confirm('Place order for $' + totalAmount + '?')) {
        return;
    }

    // prepare order data 
    var orderItems = [];
    for (var i = 0; i < cart.length; i++) {
        orderItems.push({
            productId: cart[i].id,
            quantity: cart[i].quantity,
            price: cart[i].price
        });
    }

    // send order to backend
    fetch(API_BASE_URL + '/api/orders', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'username': userData.username
        },
        body: JSON.stringify({
            items: orderItems,
            total: parseFloat(totalAmount)
        })
    })
    .then(function(response) {
        if (!response.ok) {
            throw new Error('Checkout failed');
        }
        return response.json();
    })
    .then(function(data) {
        localStorage.removeItem('cart');
        alert('Order placed successfully! Order ID: ' + data.id);
        window.location.href = 'catalog.html';
    })
    .catch(function(error) {
        console.error('Checkout error:', error);
        alert('There was an error processing your order.');
    });
});
    
