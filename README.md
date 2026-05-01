# E-Commerce API Documentation
A complete Node.js e-commerce API with user authentication, product management, cart system, order processing, and seller functionality.

## Features

### User Side
- ✅ User registration and login
- ✅ Automatic wallet points (100 welcome points)
- ✅ Automatic coupon assignment on registration
- ✅ Add products to cart
- ✅ Calculate total with discount coupons and wallet points
- ✅ Place orders with stock deduction
- ✅ Payment status handling (success/failure)

### Seller Side
- ✅ Seller registration and login
- ✅ Add products with stock management
- ✅ Update product information
- ✅ Delete products

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL** - Database
- **Joi** - Input validation
- **JWT** - Authentication
- **bcrypt** - Password hashing

## Project Structure

```
ecommerce-api/
├── src/
│   ├── config/
│   │   ├── database.js      
│   │   └── schema.sql       
│   ├── controllers/
│   │   ├── auth.controller.js    
│   │   ├── product.controller.js 
│   │   ├── cart.controller.js    
│   │   ├── order.controller.js   # Order management
│   │   └── coupon.controller.js  # Coupon management
│   ├── middleware/
│   │   └── auth.middleware.js     # JWT authentication
│   ├── models/
│   │   ├── User.model.js     # User operations
│   │   ├── Seller.model.js   # Seller operations
│   │   ├── Product.model.js  # Product operations
│   │   ├── Cart.model.js     # Cart operations
│   │   ├── Order.model.js    # Order operations
│   │   └── Coupon.model.js   # Coupon operations
│   ├── routes/
│   │   ├── auth.routes.js    # Authentication routes
│   │   ├── product.routes.js # Product routes
│   │   ├── cart.routes.js    # Cart routes
│   │   ├── order.routes.js   # Order routes
│   │   └── coupon.routes.js  # Coupon routes
│   ├── validations/
│   │   └── auth.validation.js # Joi validation schemas
│   ├── app.js               # Express app setup
│   └── server.js            # Server startup
├── .env                     # Environment variables
├── package.json
└── README.md
```

## Setup Instructions

### 1. Database Setup

Create a MySQL database named `ecommerce_db` and run the schema:

```bash
mysql -u root -p < src/config/schema.sql
```



### 3. Install Dependencies
npm install
### 4. Start the Server
npm run dev

The API will be available at `http://localhost:3000`

## API Endpoints

### Authentication

#### User Registration
```http
POST /api/auth/user/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "1234567890"
}
```

#### User Login
```http
POST /api/auth/user/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Seller Registration
```http
POST /api/auth/seller/register
Content-Type: application/json

{
  "name": "Seller Name",
  "email": "seller@example.com",
  "password": "password123",
  "phone": "1234567890",
  "company_name": "ABC Company"
}
```

#### Seller Login
```http
POST /api/auth/seller/login
Content-Type: application/json

{
  "email": "seller@example.com",
  "password": "password123"
}
```

### Products

#### Get All Products
```http
GET /api/products
```

#### Get Product by ID
```http
GET /api/products/1
```

#### Add Product (Seller Only)
```http
POST /api/products
Authorization: Bearer <seller_token>
Content-Type: application/json

{
  "name": "Product Name",
  "description": "Product description",
  "price": 99.99,
  "stock_quantity": 100,
  "category_id": 1,
  "image_url": "https://example.com/image.jpg"
}
```

#### Update Product (Seller Only)
```http
PUT /api/products/1
Authorization: Bearer <seller_token>
Content-Type: application/json

{
  "name": "Updated Product Name",
  "price": 149.99,
  "stock_quantity": 150
}
```

#### Delete Product (Seller Only)
```http
DELETE /api/products/1
Authorization: Bearer <seller_token>
```

### Cart

#### Get Cart
```http
GET /api/cart
Authorization: Bearer <user_token>
```

#### Add to Cart
```http
POST /api/cart/add
Authorization: Bearer <user_token>
Content-Type: application/json

{
  "product_id": 1,
  "quantity": 2
}
```

#### Update Cart Item
```http
PUT /api/cart/update/1
Authorization: Bearer <user_token>
Content-Type: application/json

{
  "quantity": 3
}
```

#### Remove from Cart
```http
DELETE /api/cart/remove/1
Authorization: Bearer <user_token>
```

#### Clear Cart
```http
DELETE /api/cart/clear
Authorization: Bearer <user_token>
```

### Orders

#### Calculate Order Total
```http
POST /api/orders/calculate-total
Authorization: Bearer <user_token>
Content-Type: application/json

{
  "use_wallet_points": true,
  "coupon_code": "WELCOME10"
}
```

#### Place Order
```http
POST /api/orders/place
Authorization: Bearer <user_token>
Content-Type: application/json

{
  "use_wallet_points": true,
  "coupon_code": "WELCOME10"
}
```

#### Get User Orders
```http
GET /api/orders/my-orders
Authorization: Bearer <user_token>
```

#### Get Order by ID
```http
GET /api/orders/1
Authorization: Bearer <user_token>
```

#### Update Payment Status
```http
PUT /api/orders/payment-status
Content-Type: application/json

{
  "order_id": 1,
  "payment_status": "success"
}
```

### Coupons

#### Get User Coupons
```http
GET /api/coupons/my-coupons
Authorization: Bearer <user_token>
```

### When without postman needs check

You can test the API using curl in your terminal:
curl http://localhost:3000/health

# User registration
curl -X POST http://localhost:3000/api/auth/user/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123","phone":"1234567890"}'

# User login
curl -X POST http://localhost:3000/api/auth/user/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'

You can test GET endpoints directly in your browser:
- `http://localhost:3000/health`
- `http://localhost:3000/api/products`
- `http://localhost:3000/api/products/1`

