

var products = [];
var editingProductId = null;

window.addEventListener('DOMContentLoaded', function() {
    checkAdminAccess();
    loadProducts();
    setupSearchFilter();
});

function checkAdminAccess() {
    var user = localStorage.getItem('user');
    if (!user) {
        alert('Please login to access admin panel');
        window.location.href = 'login.html';
        return;
    }

    var userData = JSON.parse(user);
    if (userData.role !== 'admin') {
        alert('Access denied. Admin privileges required.');
        window.location.href = 'catalog.html';
        return;
    }

    document.getElementById('adminName').textContent = userData.username;
}


function loadProducts() {

    fetchProducts().then(function(data) {
        products = data;
        displayProducts();
        updateStats();
    });
}

function displayProducts() {
    var tbody = document.getElementById('productsTableBody');

    if (products.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="empty-state">No products found</td>
            </tr>
        `;
        return;
    }

    var html = products.map(function (product) {
        return `
            <tr>
                <td>
                    <img src="${product.image}"
                         alt="${product.name}"
                         class="product-image-small">
                </td>

                <td><strong>${product.name}</strong></td>
                <td>${product.category}</td>
                <td>$${product.price.toFixed(2)}</td>
                <td>${product.stock}</td>

                <td>
                    <div class="actions-cell">
                        <button class="btn btn-warning btn-small"
                                onclick="openEditModal(${product.id})">
                            Edit
                        </button>

                        <button class="btn btn-danger btn-small"
                                onclick="deleteProduct(${product.id})">
                            Delete
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');

    tbody.innerHTML = html;
}


function updateStats() {
    document.getElementById('totalProducts').textContent = products.length;
    
    var lowStock = 0;
    var outOfStock = 0;
    
    for (var i = 0; i < products.length; i++) {
        if (products[i].stock === 0) {
            outOfStock++;
        } else if (products[i].stock < 10) {
            lowStock++;
        }
    }
    
    document.getElementById('lowStock').textContent = lowStock;
    document.getElementById('outOfStock').textContent = outOfStock;
}

function setupSearchFilter() {
    var searchInput = document.getElementById('searchProducts');
    if(!searchInput) return; 
    searchInput.addEventListener('input', function() {
        var searchTerm = this.value.toLowerCase();
        var rows = document.querySelectorAll('#productsTableBody tr');
        
        for (var i = 0; i < rows.length; i++) {
            var text = rows[i].textContent.toLowerCase();
            if (text.includes(searchTerm)) {
                rows[i].style.display = '';
            } else {
                rows[i].style.display = 'none';
            }
        }
    });
}

function openCreateModal() {
    editingProductId = null;
    document.getElementById('modalTitle').textContent = 'Add New Product';
    document.getElementById('productForm').reset();
    document.getElementById('productModal').style.display = 'flex';
}

function openEditModal(productId) {
    var product = products.find(p => p.id === productId);
    if (!product) return;

    editingProductId = productId;
    
    document.getElementById('modalTitle').textContent = 'Edit Product';

    document.getElementById('productName').value = product.name;
    
    var categorySelect = document.getElementById('productCategory');
    categorySelect.value = product.category; 
    
    if (!categorySelect.value) {
        for (var i = 0; i < categorySelect.options.length; i++) {
            if (categorySelect.options[i].value.toLowerCase() === product.category.toLowerCase()) {
                categorySelect.selectedIndex = i;
                break;
            }
        }
    }

    document.getElementById('productPrice').value = product.price;
    document.getElementById('productStock').value = product.stock;
    
  
    document.getElementById('productImage').value = product.imageurl || product.image || '';
    document.getElementById('productDescription').value = product.description;
    
   
    document.getElementById('productModal').style.display = 'flex';
}

function closeModal() {
    
    document.getElementById('productModal').style.display = 'none';
    document.getElementById('productForm').reset();
    editingProductId = null;
}

function saveProduct() {
    var name = document.getElementById('productName').value;
    var category = document.getElementById('productCategory').value;
    var price = parseFloat(document.getElementById('productPrice').value);
    var stock = parseInt(document.getElementById('productStock').value);
    var image = document.getElementById('productImage').value; 
    var description = document.getElementById('productDescription').value;

    if (!name || !category || isNaN(price) || isNaN(stock) || !image || !description) {
        alert('Please fill in all required fields');
        return;
    }

    var productData = {
        name: name,
        category: category,
        price: price,
        stock: stock,
        imageurl: image, // Mapped correctly for Backend
        description: description
    };

    var url = API_BASE_URL + '/api/products';
    var method = 'POST';
    
    if (editingProductId) {
        url = API_BASE_URL + '/api/products/' + editingProductId;
        method = 'PUT';
    }

    fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
    })
    .then(response => response.json())
    .then(data => {
        alert(editingProductId ? 'Product updated!' : 'Product created!');
        loadProducts();
        closeModal();
    })
    .catch(error => {
        console.error('Save error:', error);
        alert('Error saving product');
    });
}

function deleteProduct(productId) {
    if (!confirm('Are you sure you want to delete this product?')) {
        return;
    }

    fetch(API_BASE_URL + '/api/products/' + productId, {
        method: 'DELETE'
    })
    .then(function(response) { 
        if(response.ok) {
            alert('Product deleted successfully!');
            loadProducts();
        } else {
            alert('Error deleting product');
        }
    })
    .catch(function(error) {
        console.error('Delete error:', error);
        alert('Error deleting product');
    });
}