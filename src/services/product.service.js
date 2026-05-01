const Product = require('../models/Product.model');

const getAllProducts = async (activeOnly = true) => {
  const products = await Product.findAll(activeOnly);
  return { products: products || [], count: products ? products.length : 0 };
};

const getProductById = async (id) => {
  const product = await Product.findById(id);
  if (!product) throw new Error('Product not found');
  return product;
};

const addProduct = async (productData, sellerId) => {
  const productId = await Product.create(productData, sellerId);
  const product = await Product.findById(productId);
  return product;
};

const updateProduct = async (id, productData, sellerId) => {
  const updated = await Product.update(id, productData, sellerId);
  if (!updated) throw new Error('Product not found or you do not have permission');
  const product = await Product.findById(id);
  return product;
};

const deleteProduct = async (id, sellerId) => {
  const deleted = await Product.delete(id, sellerId);
  if (!deleted) throw new Error('Product not found or you do not have permission');
  return { message: 'Product deleted successfully' };
};

const getSellerProducts = async (sellerId) => {
  const products = await Product.findBySeller(sellerId);
  return products;
};

module.exports = { getAllProducts, getProductById, addProduct, updateProduct, deleteProduct, getSellerProducts };
