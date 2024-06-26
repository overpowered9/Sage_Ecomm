const express = require("express");
const Product = require('../models/Product');

const router= express.Router();
router.get('/', async (req, res) => {
     // Assuming products is your array of product objects

     const products = await Product.find().limit(4);
     const limitedProducts = products // Get only the first 4 products
     const featuredProducts = await Product.find({ isFeatured: true });
     console.log(featuredProducts);
    res.render('pages/home', {products: limitedProducts, featuredProducts: featuredProducts});
});

module.exports= router