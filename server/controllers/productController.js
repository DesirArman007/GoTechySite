import { Product } from '../models/Product.js';

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
    console.log(`[ProductController] ${req.method} ${req.originalUrl} called`);

    try {
        const products = await Product.find().sort({ createdAt: -1 });

        console.log('[ProductController] Products fetched count', products.length);

        res.status(200).json({
            success: true,
            message: 'Products fetched successfully',
            data: products
        });
    } catch (error) {
        console.error('[ProductController] Error fetching products', error.message);

        res.status(500).json({
            success: false,
            message: 'Error fetching products',
            error: error.message
        });
    }
};


// @desc    Add a product
// @route   POST /api/products
// @access  Private (Admin)
const addProduct = async (req, res) => {

    console.log(`[ProductController] ${req.method} ${req.originalUrl} called`);
    try {
        console.log('[ProductController] Request body keys:', Object.keys(req.body));

        const product = await Product.create(req.body);

        console.log('[ProductController] Product created with id:', product?.id || product?._id);

        res.status(201).json({
            success: true,
            message: 'Product added',
            data: product
        });
    } catch (error) {
        console.error("[ProductController] Error adding product: ", error.message);

        res.status(500).json({
            success: false,
            message: "Error adding the product",
        });
    }
};


const searchProduct = async (req, res) => {

    console.log(`[ProductController] ${req.method} ${req.originalUrl} called`);

    const { productName } = req.query;
    console.log("[ProductController] Search query: ", productName);

    try {
        const products = await Product.find({
            title: {
                $regex: productName,
                $options: 'i'
            }
        }).sort({ createdAt: -1 });


        console.log("[ProductController] Products search count: ", products.length);

        res.status(200).json({
            success: true,
            message: 'Products fetched successfully',
            data: products
        });
    } catch (error) {
        console.error("[ProductController] Error fetching products: ", error.message);

        res.status(500).json({
            success: false,
            message: "Error fetching the products",
        });
    }
};

const deleteProduct = async (req, res) => {
    console.log(`[ProductController] ${req.method} ${req.originalUrl} called`);
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        console.log(`[ProductController] Product deleted: ${req.params.id}`);
        res.status(200).json({ success: true, message: 'Product deleted' });
    } catch (error) {
        console.error('[ProductController] Error deleting product', error.message);
        res.status(500).json({ success: false, message: 'Failed to delete product' });
    }
};

const togglePinProduct = async (req, res) => {
    console.log(`[ProductController] ${req.method} ${req.originalUrl} called`);
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        // If trying to pin, check the limit
        if (!product.pinned) {
            const pinnedCount = await Product.countDocuments({ pinned: true });
            if (pinnedCount >= 6) {
                return res.status(400).json({ success: false, message: 'Maximum 6 products can be pinned' });
            }
        }

        product.pinned = !product.pinned;
        await product.save();
        console.log(`[ProductController] Product ${req.params.id} pinned: ${product.pinned}`);
        res.status(200).json({ success: true, message: `Product ${product.pinned ? 'pinned' : 'unpinned'}`, data: product });
    } catch (error) {
        console.error('[ProductController] Error toggling pin', error.message);
        res.status(500).json({ success: false, message: 'Failed to toggle pin' });
    }
};

const updateProduct = async (req, res) => {
    console.log(`[ProductController] ${req.method} ${req.originalUrl} called`);
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        console.log(`[ProductController] Product updated: ${req.params.id}`);
        res.status(200).json({ success: true, message: 'Product updated', data: product });
    } catch (error) {
        console.error('[ProductController] Error updating product', error.message);
        res.status(500).json({ success: false, message: 'Failed to update product' });
    }
};

export { getProducts, addProduct, searchProduct, deleteProduct, togglePinProduct, updateProduct };