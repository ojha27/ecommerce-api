const User = require('../models/User.model');
const Seller = require('../models/Seller.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const registerUser = async (userData) => {
  const { name, email, password, phone } = userData;
  const existingUser = await User.findByEmail(email);
  if (existingUser) {
    throw new Error('Email already registered');
  }
  const userId = await User.create({ name, email, password, phone });
  
  await User.assignWelcomeCoupons(userId);
  

  const user = await User.findById(userId);
    const token = jwt.sign({ userId: user.id },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
  
  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      wallet_points: user.wallet_points,
      created_at: user.created_at
    },
    token,
    welcome_bonus: {
      wallet_points: 100,
      coupons_assigned: 3
    }
  };
};


const loginUser = async (loginData) => {
  const { email, password } = loginData;
  
  const user = await User.findByEmail(email);
  if (!user) {
    throw new Error('Invalid email or password');
  }
  
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw new Error('Invalid email or password');
  }
    const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
  
  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      wallet_points: user.wallet_points
    },
    token
  };
};


const registerSeller = async (sellerData) => {
  const { name, email, password, phone, company_name } = sellerData;
  
  const existingSeller = await Seller.findByEmail(email);
  if (existingSeller) {
    throw new Error('Email already registered');
  }
  
  const sellerId = await Seller.create({ name, email, password, phone, company_name });
  const seller = await Seller.findById(sellerId);
  
  const token = jwt.sign(
    { sellerId: seller.id },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
  
  return {
    seller: {
      id: seller.id,
      name: seller.name,
      email: seller.email,
      phone: seller.phone,
      company_name: seller.company_name
    },
    token
  };
};


const loginSeller = async (loginData) => {
  const { email, password } = loginData;
  
  const seller = await Seller.findByEmail(email);
  if (!seller) {
    throw new Error('Invalid email or password');
  }
  
  const isValidPassword = await bcrypt.compare(password, seller.password);
  if (!isValidPassword) {
    throw new Error('Invalid email or password');
  }
  
  const token = jwt.sign(
    { sellerId: seller.id },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
  
  return {
    seller: {
      id: seller.id,
      name: seller.name,
      email: seller.email,
      phone: seller.phone,
      company_name: seller.company_name
    },
    token
  };
};

module.exports = {
  registerUser,
  loginUser,
  registerSeller,
  loginSeller
};