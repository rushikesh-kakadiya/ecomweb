const express = require('express');
const router = express.Router();
const passport = require("passport");
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getAllProducts,
  getProductDetails,
  createProduct,
  updateProduct,
  deleteProduct,
  getUserCart,
  addToCart,
  createOrder,
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getAllOrders,
  getOrderDetails,
  updateOrderStatus,
  makePayment,
  getProductReviews,
  addReview,
  deleteReview,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  createShipping,
  updateShippingStatus,
  updateCartQuantity,
  deleteCartItem,
  getSelectedCartItems,
  updateCartItemSelection,
  getUserShippingAddress,
} = require('./controller'); // Importing all functions from a controller file
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.use(passport.initialize());
router.use(passport.session());

// User Routes
router.post('/users/register', registerUser);
router.post('/users/login', loginUser);
router.get('/users/profile', passport.authenticate('jwt', { session: false }), getUserProfile); // Protected route
router.put('/users/profile', passport.authenticate('jwt', { session: false }), updateUserProfile); // Protected route

// Product Routes
router.get('/products', getAllProducts);
router.get('/products/:id', getProductDetails);
router.post('/products', upload.single("image_url"), createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

// Cart Routes
router.get('/cart', passport.authenticate('jwt', { session: false }), getUserCart); // Protected route
router.post('/cart', passport.authenticate('jwt', { session: false }), addToCart); // Protected route
router.put('/cart/:cartItemId', passport.authenticate('jwt', { session: false }), updateCartQuantity); // Protected route
router.delete('/cart/:cartItemId', passport.authenticate('jwt', { session: false }), deleteCartItem); // Protected route

// Selected cart items route
router.get('/cart/selected', passport.authenticate('jwt', { session: false }), getSelectedCartItems); // Protected route
router.put('/cart/select/:cartItemId', passport.authenticate('jwt', { session: false }), updateCartItemSelection); // Protected route

// User shipping address route
router.get('/user/address', passport.authenticate('jwt', { session: false }), getUserShippingAddress); // Protected route

// Order Routes
router.post('/orders', passport.authenticate('jwt', { session: false }), createOrder); // Protected route
router.get('/orders', passport.authenticate('jwt', { session: false }), getAllOrders); // Protected route
router.get('/orders/:id', passport.authenticate('jwt', { session: false }), getOrderDetails); // Protected route
router.put('/orders/:id', passport.authenticate('jwt', { session: false }), updateOrderStatus); // Protected route

// Category Routes
router.get('/categories', getAllCategories);
router.post('/categories', createCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

// Payment Routes
router.post('/payments', makePayment);

// Review Routes
router.get('/products/:id/reviews', getProductReviews);
router.post('/products/:id/reviews', addReview);
router.delete('/reviews/:id', deleteReview);

// Wishlist Routes
router.get('/wishlist', passport.authenticate('jwt', { session: false }), getWishlist); // Protected route
router.post('/wishlist', passport.authenticate('jwt', { session: false }), addToWishlist); // Protected route
router.delete('/wishlist/:id', passport.authenticate('jwt', { session: false }), removeFromWishlist); // Protected route

// Shipping Routes
router.post('/shipping', passport.authenticate('jwt', { session: false }), createShipping); // Protected route
router.put('/shipping/:id', passport.authenticate('jwt', { session: false }), updateShippingStatus); // Protected route

module.exports = router;
