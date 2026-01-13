# TechStore - E-Commerce Platform

## 📋 Project Overview

TechStore is a full-stack e-commerce platform for technology products, developed as the final project for the Web and App Development course (3rd BDCE). The platform allows users to browse products, manage shopping carts, and includes an admin panel for product management.

**Group:** 3rd BDCE  
**Course:** Web and App Development  
**Academic Year:** 2025-2026

---

## 🚀 Features

### User Features
- ✅ **Product Catalog**: Browse technology products with category filtering
- ✅ **Search Functionality**: Search products by name or description
- ✅ **Product Details**: View detailed information about each product
- ✅ **Shopping Cart**: Add, remove, and manage cart items with quantity controls
- ✅ **User Authentication**: Register and login system with role-based access
- ✅ **Responsive Design**: Fully functional on desktop, tablet, and mobile devices

### Admin Features
- ✅ **Product Management**: Create, read, update, and delete (CRUD) products
- ✅ **Dashboard Statistics**: View total products, low stock, and out of stock items
- ✅ **Product Search**: Filter products in admin panel
- ✅ **Access Control**: Admin-only access with authentication

---

## 🛠️ Technologies Used

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Styling with Flexbox and Grid
- **JavaScript (ES5)** - Client-side logic and DOM manipulation

### Backend (To be integrated)
- **Node.js** - Server runtime
- **Express.js** - Web framework
- **SQLite/MySQL** - Database

### Additional Tools
- **localStorage** - Session management and cart persistence
- **Fetch API** - REST API communication (prepared for backend integration)
- **bcryptjs** - Password hashing (backend)

---

## 📁 Project Structure

```
WebDev/
├── css/
│   ├── styles.css          # Shared styles (header, footer, buttons)
│   ├── catalog.css         # Catalog page styles
│   ├── cart.css            # Shopping cart styles
│   ├── login.css           # Login/Register page styles
│   ├── product.css         # Product detail page styles
│   └── admin.css           # Admin dashboard styles
│
├── js/
│   ├── index.js            # Shared functions and mock data
│   ├── catalog.js          # Catalog page logic
│   ├── cart.js             # Shopping cart logic
│   ├── login.js            # Authentication logic
│   ├── product.js          # Product detail logic
│   └── admin.js            # Admin panel logic
│
├── index.html              # Homepage/Welcome page
├── catalog.html            # Product catalog page
├── cart.html               # Shopping cart page
├── login.html              # Login/Register page
├── product.html            # Product detail page
├── admin.html              # Admin dashboard
└── README.md               # Project documentation
```

---

## 🎨 Design Principles

### Responsive Design
- **Desktop** (> 968px): Multi-column layouts with sidebars
- **Tablet** (768px - 968px): Adjusted grids and flexible layouts
- **Mobile** (< 768px): Single-column, stacked layouts optimized for touch

### Color Scheme
- **Primary Gradient**: Purple to blue (#667eea → #764ba2)
- **Background**: Light gray (#f5f5f5)
- **Text**: Dark gray (#333) and medium gray (#666)
- **Accent**: Red for cart count (#ff4444)

### UI/UX Features
- Modern card-based design
- Smooth hover animations and transitions
- Visual feedback for user actions
- Consistent component styling across pages

---

## 🔧 Setup Instructions

### 1. Clone or Download the Project
```bash
git clone <repository-url>
cd WebDev
```

### 2. Open with Live Server
- Open the project folder in VS Code
- Install "Live Server" extension
- Right-click on `index.html` → "Open with Live Server"
- The site will open at `http://localhost:5500`

### 3. Navigate the Site
- **Homepage**: `index.html`
- **Browse Products**: Click "Browse Products" or navigate to `catalog.html`
- **Login**: Click "Login" to access authentication page
- **Admin Panel**: Login with admin credentials to access `admin.html`

---

## 👤 User Roles

### Regular User
- Browse product catalog
- Search and filter products
- View product details
- Add products to cart
- Manage cart (add/remove items, adjust quantities)
- Checkout (mock functionality)

### Administrator
- All user features
- Access admin dashboard
- Create new products
- Edit existing products
- Delete products
- View inventory statistics

---

## 🔐 Authentication Flow

### Registration
1. Navigate to Login page
2. Click "Register" tab
3. Fill in required fields:
   - Username *
   - Password * (minimum 6 characters)
   - Confirm Password *
   - User Type * (User or Admin)
   - Optional: Full Name, Address, Phone
4. Click "Create Account"
5. Redirected to login form

### Login
1. Enter username and password
2. Click "Login"
3. User data stored in `localStorage`
4. Redirected based on role:
   - **Admin** → Admin Dashboard
   - **User** → Product Catalog

---

## 🛒 Shopping Cart Functionality

### Cart Features
- Products stored in `localStorage`
- Grouped items with quantity counters
- Increase/decrease quantity buttons
- Remove item functionality
- Real-time price calculations:
  - Subtotal
  - Tax (10%)
  - Shipping ($10 flat rate)
  - Total

### Cart Workflow
1. Browse products in catalog
2. Click "Add to Cart" on any product
3. View cart by clicking cart icon in header
4. Adjust quantities or remove items
5. Click "Proceed to Checkout"
6. Login if not authenticated
7. Confirm order

---

## 📊 API Integration (Ready for Backend)

### Current Status
The frontend is **ready for backend integration** with mock data and TODO comments marking API call locations.

### API Endpoints Expected

#### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

#### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - Login user

#### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders

### Integration Steps
1. Replace mock data in `js/index.js` with actual API calls
2. Uncomment `fetch()` calls in each JS file
3. Update `API_BASE_URL` in `js/index.js`
4. Test all endpoints
5. Remove mock data after successful integration

---

## 🧪 Testing Checklist

### Functionality Testing
- ✅ Product catalog loads and displays correctly
- ✅ Category filtering works
- ✅ Search functionality filters products
- ✅ Product detail page displays correct information
- ✅ Add to cart updates cart count
- ✅ Cart displays items with correct quantities
- ✅ Quantity controls work (increase/decrease)
- ✅ Remove from cart works
- ✅ Cart totals calculate correctly
- ✅ Login/Register forms validate input
- ✅ Admin panel requires authentication
- ✅ Admin CRUD operations work (with mock data)

### Responsive Testing
- ✅ Test on desktop (1920px, 1440px, 1024px)
- ✅ Test on tablet (768px, 834px)
- ✅ Test on mobile (375px, 390px, 414px)
- ✅ All buttons are touch-friendly
- ✅ Text is readable on all screen sizes
- ✅ Images scale properly

### Browser Testing
- ✅ Google Chrome
- ✅ Mozilla Firefox
- ✅ Microsoft Edge
- ✅ Safari (if available)

---

## 🎯 Project Requirements Compliance

### Technical Requirements Met
✅ Semantic HTML  
✅ CSS using Flexbox and Grid  
✅ Responsive design with @media queries  
✅ Login and registration forms  
✅ Dynamic catalog generation  
✅ Use of JS modules (import/export pattern)  
✅ REST API consumption prepared (fetch with TODO comments)  
✅ Separate routes by entity (prepared for backend)  
✅ CRUD for products (frontend ready)  
✅ User authentication flow  
✅ Basic error handling  

### Functional Requirements Met
✅ Registration and Login system  
✅ User roles (Admin and User)  
✅ Product catalog with filtering  
✅ Shopping cart with CRUD operations  
✅ Product management (Admin only)  
✅ Clean, modern, responsive UI  
✅ REST API integration points ready  

---

## 🐛 Known Limitations

### Current Limitations (Mock Data)
- Products are stored in JavaScript array (not database)
- User authentication is simulated (no real password verification)
- Orders are not persisted (cleared on page refresh)
- No actual backend server

### To Be Implemented (Backend)
- Real database integration (SQLite/MySQL)
- Password hashing with bcryptjs
- Persistent user sessions
- Order history storage
- Email notifications
- Payment gateway integration

---

## 🔮 Future Enhancements

### Potential Features
- Product reviews and ratings
- Wishlist functionality
- Order tracking system
- Email notifications
- Product recommendations
- Advanced search with filters (price range, brand)
- User profile management
- Multiple shipping addresses
- Coupon/discount codes
- Inventory alerts for low stock

### Technical Improvements
- Implement actual backend with Node.js + Express
- Add database (MySQL/SQLite)
- Implement JWT authentication
- Add image upload functionality
- Deploy to cloud (Render, Railway, Vercel)
- Add Swagger API documentation

---

## 📚 Learning Outcomes

This project demonstrates understanding of:
- HTML5 semantic markup and accessibility
- CSS3 modern layouts (Flexbox, Grid)
- Responsive web design principles
- JavaScript DOM manipulation
- Event handling and dynamic content generation
- localStorage for client-side data persistence
- REST API architecture and design
- CRUD operations
- User authentication flows
- Role-based access control
- Code organization and modularity
- Git version control (if applicable)

---

## 👥 Team Members

- [Iancu David] 
- [Diego Gutierrez] 


-




