const { registerUser, loginUser, registerSeller, loginSeller } = require('../services/auth.service');
const { userRegistrationValidation, userLoginValidation, sellerRegistrationValidation, sellerLoginValidation } = require('../validations/auth.validation');

exports.userRegister = async (req, res) => {
  try {
    const { error } = userRegistrationValidation(req.body);
    if (error) {
      return res.status(400).json({ 
        success: false,
        error: 'Validation failed',
        details: error.details[0].message 
      });
    }
    const result = await registerUser(req.body);
    res.status(201).json({
      success: true,
      message: 'Registration successful! Welcome bonus of 100 points and coupons added.',
      data: result
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Registration failed',
      message: error.message || 'Unable to complete registration. Please try again later.'
    });
  }
};

exports.userLogin = async (req, res) => {
  try {
    const { error } = userLoginValidation(req.body);
    if (error) {
      return res.status(400).json({ 
        success: false,
        error: 'Validation failed',
        details: error.details[0].message 
      });
    }
    const result = await loginUser(req.body); 
    res.json({
      success: true,
      message: 'Login successful',
      data: result
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(401).json({ 
      success: false,
      error: 'Login failed',
      message: error.message || 'Invalid credentials'
    });
  }
};

exports.sellerRegister = async (req, res) => {
  try {
    const { error } = sellerRegistrationValidation(req.body);
    if (error) {
      return res.status(400).json({ 
        success: false,
        error: 'Validation failed',
        details: error.details[0].message 
      });
    }
    const result = await registerSeller(req.body); 
    res.status(201).json({
      success: true,
      message: 'Seller registered successfully',
      data: result
    });
  } catch (error) {
    console.error('Seller registration error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Seller registration failed',
      message: error.message || 'Unable to complete registration'
    });
  }
};

exports.sellerLogin = async (req, res) => {
  try {
    const { error } = sellerLoginValidation(req.body);
    if (error) {
      return res.status(400).json({ 
        success: false,
        error: 'Validation failed',
        details: error.details[0].message 
      });
    }
    const result = await loginSeller(req.body);
    
    res.json({
      success: true,
      message: 'Login successful',
      data: result
    });
  } catch (error) {
    console.error('Seller login error:', error);
    res.status(401).json({ 
      success: false,
      error: 'Login failed',
      message: error.message || 'Invalid credentials'
    });
  }
};