const Product = require('../models/Product');
const express = require('express');
const app = express();
const session = require('express-session');
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));
const visited_products= async (req, res) => {
    if (!req.session.visitedProducts || req.session.visitedProducts.length === 0) {
        return res.render('pages/visited_products', { products: [] });
    }

    // Find the products by their IDs
    const visitedProducts = await Product.find({ _id: { $in: req.session.visitedProducts } });
    console.log('Visited products:', visitedProducts);
    res.render('pages/visited_products', { products: visitedProducts });
};

const Shoesdata = async (req, res) => {
    const products = await Product.find();
    res.json({ products });
};
// Controller function to get all shoes
const getShoes = async (req, res) => {
    const products = await Product.find();
    res.render('pages/addproduct', { products });
};

const getProducts_listings = async (req, res) => {
    const { size, priceMin, priceMax, sort, page = 1, limit = 3, category } = req.query;

    let filter = {};
    let sortOption = {};

    // Add size filter
    if (size) {
        filter.sizes = { $elemMatch: { size: Number(size) } };
    }

    // Add price filters
    if (priceMin || priceMax) {
        filter.price = {};
        if (priceMin) {
            filter.price.$gte = Number(priceMin);
        }
        if (priceMax) {
            filter.price.$lte = Number(priceMax);
        }
    }

    // Add category filter
    if (category) {
        filter.category = category;
    }

    // Add sorting option
    if (sort) {
        sortOption.price = sort === 'asc' ? 1 : -1;
    }

    // Calculate the number of documents to skip
    const skip = (page - 1) * limit;

    // Fetch the total count of documents
    const totalProducts = await Product.countDocuments(filter);

    // Fetch the products with pagination
    const products = await Product.find(filter)
        .sort(sortOption)
        .skip(skip)
        .limit(Number(limit));
        if (products.length === 0 && size) {
            return res.render('pages/product_listings', { 
                message: `No products of size ${size} are available.`,
                products: [],
                currentPage: Number(page),
                totalPages: 0,
                limit: Number(limit)
            });
        }
    // Calculate the total number of pages
    const totalPages = Math.ceil(totalProducts / limit);

    // Render the products with pagination data
    res.render('pages/product_listings', { 
        products,
        currentPage: Number(page),
        totalPages,
        limit: Number(limit)
    });
};


// Controller function to save a new shoe
const saveShoes = async (req, res) => {
    const { articleNumber, name, category, price, description, sizes } = req.body;
    let imageUrls = req.body.imageUrls;
    const isFeatured = req.body.isFeatured === 'on'; // Convert checkbox value to boolean

    // Check if a product with the same articleNumber already exists
    const existingProduct = await Product.findOne({ articleNumber });

    if (existingProduct) {
        // Handle the error: a product with this articleNumber already exists
        res.status(400).send('A product with this articleNumber already exists');
    } else {
        // Parse sizes input to create an array of size-quantity objects
        const sizesArray = sizes.split(',').map(sizeQty => {
            const [size, quantity] = sizeQty.split(':').map(Number);
            return { size, quantity };
        });

        // Ensure imageUrls is an array
        if (!Array.isArray(imageUrls)) {
            imageUrls = [imageUrls];
        }

        // Create and save the new product
        const product = new Product({
            articleNumber,
            name,
            category,
            price,
            description,
            sizes: sizesArray,
            imageUrls,
            isFeatured // Add the isFeatured field
        });

        await product.save();
        res.redirect('/products/addproducts');
    }
};


// Controller function to search products by article number or name
const searchProducts = async (req, res) => {
    const { query, page = 1, limit = 3 } = req.query;

    const searchQuery = {
        $or: [
            { articleNumber: query },
            { name: { $regex: query, $options: 'i' } } // Case-insensitive search
        ]
    };

    // Calculate the number of documents to skip
    const skip = (page - 1) * limit;

    // Fetch the total count of documents
    const totalProducts = await Product.countDocuments(searchQuery);

    // Fetch the products with pagination
    const products = await Product.find(searchQuery)
        .skip(skip)
        .limit(Number(limit));

    // Calculate the total number of pages
    const totalPages = Math.ceil(totalProducts / limit);

    res.render('pages/product_listings', { 
        products,
        currentPage: Number(page),
        totalPages,
        limit: Number(limit)
    });
};

// Controller function to delete a product by ID
const deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        await Product.findByIdAndDelete(id);
        res.redirect('/products/addproducts');
    } catch (error) {
        res.status(500).send('Error deleting product');
    }
};

// Controller function to get details of a single product
const getProductDetails = async (req, res) => {
    const { id } = req.params;
    const productId = req.params.id;
    if (!req.session.visitedProducts) {
        req.session.visitedProducts = [];
    }

    // Add the current product ID to the visitedProducts array if it's not already there
    if (!req.session.visitedProducts.includes(productId)) {
        req.session.visitedProducts.push(productId);
        console.log('Visited products:', req.session.visitedProducts);}

    try {
        const product = await Product.findById(id);

        res.render('pages/product_details', { product });
        
    } catch (error) {
        res.status(500).send('Error fetching product details');
    }
};

const viewCart = (req, res) => {
    const cart = req.cookies.cart ? JSON.parse(req.cookies.cart) : [];
    res.render('pages/cart', { cart: cart });
  };
  
  const checkout = async (req, res) => {
    const cart = JSON.parse(req.cookies.cart);
    for (const item of cart) {
        try {
            const product = await Product.findById(item.productId);
            if (!product) {
                console.error(`Product with ID ${item.productId} not found`);
                continue;
            }

            const sizeObj = product.sizes.find(sizeObj => sizeObj.size === parseInt(item.size));
            if (!sizeObj) {
                console.error(`Size ${item.size} not found for product with ID ${item.productId}`);
                continue;
            }

            if (sizeObj.quantity >= item.quantity) {
                sizeObj.quantity -= item.quantity;
                await product.save();
            } else {
                console.error(`Not enough stock for size ${item.size} of product with ID ${item.productId}`);
            }
        } catch (error) {
            console.error(`Error processing product with ID ${item.productId}:`, error);
        }
    }

    res.cookie('cart', '', { maxAge: 0 });
    const trackingId = Math.random().toString(36).substring(2, 15);
    res.render('pages/checkout', { trackingId });
};

  

const updateCartItem = (req, res) => {
    const { productId, size } = req.params;
    const action = req.query.action;
    let cart = req.cookies.cart ? JSON.parse(req.cookies.cart) : [];

    console.log('Initial cart:', cart);
    console.log('Product ID:', productId);
    console.log('Size:', size);
    console.log('Action:', action);const productIndex = cart.findIndex(item => item.productId === productId && item.size === size.toString());
    if (productIndex !== -1) {
        console.log('Found product in cart:', cart[productIndex]);
        if (action === 'increase') {
            cart[productIndex].quantity += 1;
        } else if (action === 'decrease' && cart[productIndex].quantity > 1) {
            cart[productIndex].quantity -= 1;
        } else if (action === 'decrease' && cart[productIndex].quantity === 1) {
            // Remove item from cart if quantity is 1 and decrease action is called
            cart.splice(productIndex, 1);
        }
    } else {
        console.error('Product not found in cart');
    }

    console.log('Updated cart:', cart);
    res.cookie('cart', JSON.stringify(cart), { path: '/' });
    res.redirect('/products/cart');
};


  
  
module.exports = {
    getShoes,
    saveShoes,
    getProducts_listings,
    searchProducts,
    deleteProduct,
    viewCart,
    checkout,
    getProductDetails,
    updateCartItem,
    Shoesdata,
    visited_products  // Export the new controller function
};
