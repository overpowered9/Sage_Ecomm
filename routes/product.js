const express = require("express");
const router = express.Router();
const productController = require('../controllers/Products_controller');
// const isAdmin = require('../middleware/isAdmin');
const { isAdmin } = require('../middleware/isAdmin');
router.get('/addproducts',isAdmin, productController.getShoes);
router.get('/shoesdata',productController.Shoesdata);
router.get('/visited',productController.visited_products);
router.post('/add', productController.saveShoes);
router.get('/products_listings', productController.getProducts_listings);
router.get('/search', productController.searchProducts);
router.post('/delete/:id', productController.deleteProduct);
router.get('/product/:id', productController.getProductDetails);  // New route for product details
// routes/product.js
router.get('/cart', productController.viewCart);
router.post('/checkout', productController.checkout);
// routes/product.js
router.post('/cart/update/:productId/:size', productController.updateCartItem);

module.exports = router;
