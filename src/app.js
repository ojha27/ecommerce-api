const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { logInfo, logRequest, logSuccess } = require("./utils/logger.util");

const app = express();

app.set('trust proxy', 1);

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (!origin) return callback(null, true);
    
    callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use((req, res, next) => {
  const startTime = Date.now();
  
  logRequest(
    req.method, 
    req.originalUrl, 
    req.get('User-Agent'), 
    req.ip || req.connection.remoteAddress
  );
  
  const originalJson = res.json;
  res.json = function(data) {
    const duration = Date.now() - startTime;
    logInfo(`Response sent in ${duration}ms`, { 
      statusCode: res.statusCode,
      url: req.originalUrl 
    });
    return originalJson.call(this, data);
  };
  
  next();
});

logSuccess('E-Commerce API Server initialized', {
  nodeVersion: process.version,
  environment: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000
});

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/products", require("./routes/product.routes"));
app.use("/api/cart", require("./routes/cart.routes"));
app.use("/api/orders", require("./routes/order.routes"));
app.use("/api/coupons", require("./routes/coupon.routes"));

app.get("/health", (req, res) => {
  const healthInfo = {
    status: "OK",
    message: "E-commerce API is running",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      products: '/api/products',
      cart: '/api/cart',
      orders: '/api/orders',
      coupons: '/api/coupons'
    }
  };
  
  logSuccess('Health check accessed', { ip: req.ip });
  res.json(healthInfo);
});

app.get("/api", (req, res) => {
  const apiDocs = {
    name: "E-Commerce API",
    version: "1.0.0",
    description: "Complete e-commerce solution with user authentication, product management, cart, and order processing",
    endpoints: {
      authentication: {
        "POST /api/auth/user/register": "User registration with welcome bonus",
        "POST /api/auth/user/login": "User login",
        "POST /api/auth/seller/register": "Seller registration",
        "POST /api/auth/seller/login": "Seller login"
      },
      products: {
        "GET /api/products": "Get all products",
        "GET /api/products/:id": "Get product by ID",
        "POST /api/products": "Add product (seller only)",
        "PUT /api/products/:id": "Update product (seller only)",
        "DELETE /api/products/:id": "Delete product (seller only)"
      },
      cart: {
        "GET /api/cart": "Get user cart",
        "POST /api/cart/add": "Add item to cart",
        "PUT /api/cart/update/:product_id": "Update cart quantity",
        "DELETE /api/cart/remove/:product_id": "Remove from cart",
        "DELETE /api/cart/clear": "Clear cart"
      },
      orders: {
        "POST /api/orders/calculate-total": "Calculate order total",
        "POST /api/orders/place": "Place order",
        "GET /api/orders/my-orders": "Get user orders",
        "GET /api/orders/:id": "Get order by ID"
      },
      coupons: {
        "GET /api/coupons/my-coupons": "Get user coupons"
      }
    },
    features: [
      "JWT Authentication",
      "Wallet Points System",
      "Coupon Management",
      "Stock Management",
      "Order Processing",
      "Payment Status Handling"
    ]
  };
  
  res.json(apiDocs);
});

app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    error: "Route Not Found",
    message: `The route ${req.method} ${req.originalUrl} does not exist`,
    availableEndpoints: [
      "/health",
      "/api",
      "/api/auth",
      "/api/products",
      "/api/cart",
      "/api/orders",
      "/api/coupons"
    ]
  });
});

module.exports = app;