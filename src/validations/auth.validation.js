const Joi = require("joi");

const userRegistrationSchema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    phone: Joi.string().pattern(/^[0-9]{10}$/).optional()
});

const userLoginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

const sellerRegistrationSchema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    phone: Joi.string().pattern(/^[0-9]{10}$/).optional(),
    company_name: Joi.string().max(200).optional()
});

const sellerLoginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

const productSchema = Joi.object({
    name: Joi.string().min(2).max(200).required(),
    description: Joi.string().optional(),
    price: Joi.number().positive().required(),
    stock_quantity: Joi.number().integer().min(0).required(),
    category_id: Joi.number().integer().positive().required(),
    image_url: Joi.string().uri().optional(),
    status: Joi.string().valid('active', 'inactive').optional()
});

const addToCartSchema = Joi.object({
    product_id: Joi.number().integer().positive().required(),
    quantity: Joi.number().integer().min(1).required()
});

const applyCouponSchema = Joi.object({
    coupon_code: Joi.string().required()
});

const placeOrderSchema = Joi.object({
    use_wallet_points: Joi.boolean().default(false),
    coupon_code: Joi.string().optional()
});

const paymentStatusSchema = Joi.object({
    order_id: Joi.number().integer().positive().required(),
    payment_status: Joi.string().valid('success', 'failed').required()
});

module.exports = {
    userRegistrationValidation: (data) => userRegistrationSchema.validate(data),
    userLoginValidation: (data) => userLoginSchema.validate(data),
    sellerRegistrationValidation: (data) => sellerRegistrationSchema.validate(data),
    sellerLoginValidation: (data) => sellerLoginSchema.validate(data),
    productValidation: (data) => productSchema.validate(data),
    addToCartValidation: (data) => addToCartSchema.validate(data),
    applyCouponValidation: (data) => applyCouponSchema.validate(data),
    placeOrderValidation: (data) => placeOrderSchema.validate(data),
    paymentStatusValidation: (data) => paymentStatusSchema.validate(data)
};