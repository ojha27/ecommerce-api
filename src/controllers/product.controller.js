const { getAllProducts, getProductById, addProduct, updateProduct, deleteProduct, getSellerProducts } = require('../services/product.service');
const { productValidation } = require('../validations/auth.validation');

exports.getAllProducts = async (req, res) => {
  try {
    const result = await getAllProducts(true);
    
    res.json({
      success: true,
      message: 'Products retrieved successfully',
      data: result
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to retrieve products',
      message: error.message
    });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await getProductById(req.params.id);

    if (product.status !== 'active') {
      return res.status(404).json({ 
        success: false,
        error: 'Product not available' 
      });
    }

    res.json({
      success: true,
      message: 'Product retrieved successfully',
      data: product
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(404).json({ 
      success: false,
      error: 'Product not found',
      message: error.message
    });
  }
};

exports.addProduct = async (req, res) => {
  try {
    const { error } = productValidation(req.body);
    if (error) {
      return res.status(400).json({ 
        success: false,
        error: 'Validation failed',
        details: error.details[0].message 
      });
    }

    const product = await addProduct(req.body, req.seller.id);

    res.status(201).json({
      success: true,
      message: 'Product added successfully',
      data: product
    });
  } catch (error) {
    console.error('Add product error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to add product',
      message: error.message
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = productValidation(req.body);
    if (error) {
      return res.status(400).json({ 
        success: false,
        error: 'Validation failed',
        details: error.details[0].message 
      });
    }

    const product = await updateProduct(id, req.body, req.seller.id);

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(400).json({ 
      success: false,
      error: 'Failed to update product',
      message: error.message
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const result = await deleteProduct(req.params.id, req.seller.id);

    res.json({
      success: true,
      message: result.message
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(400).json({ 
      success: false,
      error: 'Failed to delete product',
      message: error.message
    });
  }
};

exports.getSellerProducts = async (req, res) => {
  try {
    const products = await getSellerProducts(req.seller.id);
    
    res.json({
      success: true,
      message: 'Seller products retrieved successfully',
      data: products
    });
  } catch (error) {
    console.error('Get seller products error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to retrieve seller products',
      message: error.message
    });
  }
};
