const Pharmacy = require('../models/Pharmacy');

// Get all products
const getProducts = async (req, res) => {
    try {
        const products = await Pharmacy.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get product by ID
const getProductById = async (req, res) => {
    try {
        const product = await Pharmacy.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Create a new product
const createProduct = async (req, res) => {
    try {
        const { category, name, price, description, image } = req.body;
        const product = new Pharmacy({ category, name, price, description, image });
        await product.save();
        res.status(201).json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update product
const updateProduct = async (req, res) => {
    try {
        const updatedProduct = await Pharmacy.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });
        res.json(updatedProduct);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete product
const deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Pharmacy.findByIdAndDelete(req.params.id);
        if (!deletedProduct) return res.status(404).json({ message: 'Product not found' });
        res.json({ message: 'Product deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};
