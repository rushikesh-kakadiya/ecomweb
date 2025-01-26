const express = require('express');
const router = express.Router();
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
  getUserShippingAddress
} = require('./controller'); // Importing all functions from a controller file
const multer = require("multer")
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// User Routes
router.post('/users/register', registerUser);
router.post('/users/login', loginUser);
router.get('/users/profile', getUserProfile);
router.put('/users/profile', updateUserProfile);

// Product Routes
router.get('/products', getAllProducts);
router.get('/products/:id', getProductDetails);
router.post('/products',upload.single("image_url"), createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

// Cart Routes
router.get('/cart', getUserCart);
router.post('/cart', addToCart);
router.put('/cart/:cartItemId', updateCartQuantity);
router.delete('/cart/:cartItemId', deleteCartItem);
// Selected cart items route
router.get('/cart/selected', getSelectedCartItems); // Get selected items (is_selected: true)
router.put('/cart/select/:cartItemId', updateCartItemSelection); // Update is_selected status of a cart item

// User shipping address route
router.get('/user/address', getUserShippingAddress);
// Order Routes
router.post('/orders', createOrder);
router.get('/orders', getAllOrders);
router.get('/orders/:id', getOrderDetails);
router.put('/orders/:id', updateOrderStatus);

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
router.get('/wishlist', getWishlist);
router.post('/wishlist', addToWishlist);
router.delete('/wishlist/:id', removeFromWishlist);

// Shipping Routes
router.post('/shipping', createShipping);
router.put('/shipping/:id', updateShippingStatus);

module.exports = router;
