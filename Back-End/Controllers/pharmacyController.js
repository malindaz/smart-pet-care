const Pharmacy = require('../Models/Pharmacy');
const fs = require('fs');  // Import fs module
const path = require('path');  // Import path module

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
        const { category, name, price, description } = req.body;
        const image = req.file ? `/uploads/${req.file.filename}` : ''; // Ensure file path is saved

        console.log("Image path stored in DB:", image); // Debugging

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
        const { category, name, price, description } = req.body;
        const image = req.file ? `/uploads/${req.file.filename}` : req.body.image; // Keep old image if no new one

        const updatedProduct = await Pharmacy.findByIdAndUpdate(
            req.params.id,
            { category, name, price, description, image },
            { new: true }
        );

        if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });

        res.json(updatedProduct);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// Delete product
const deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Pharmacy.findById(req.params.id);
        if (!deletedProduct) return res.status(404).json({ message: 'Product not found' });

        // Log image path for debugging
        if (deletedProduct.image) {
            const imagePath = path.join(__dirname, '..', deletedProduct.image);
            console.log("Attempting to delete image:", imagePath); // Debugging log

            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath); // Delete file
                console.log("Image deleted successfully.");
            } else {
                console.log("Image file not found:", imagePath);
            }
        }

        // Delete product from database
        await Pharmacy.findByIdAndDelete(req.params.id);

        res.json({ message: 'Product and image deleted' });
    } catch (err) {
        console.error("Error in deleteProduct:", err); // Log error details
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
