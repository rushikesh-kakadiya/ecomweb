/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const express = require("express");
const jwt = require("jsonwebtoken");
const connectEnsureLogin = require("connect-ensure-login");
const app = express();
var cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const path = require("path");
const passport = require("passport");
const session = require("express-session");
const flash = require("connect-flash");
const bcrypt = require("bcrypt");
require("dotenv").config();
const {
  User,
  Product,
  Cart,
  Category,
  Order,
  OrderItem,
  Payment,
  Review,
  Wishlist,
  Shipping,
} = require("./models");
const cors = require("cors");
const multer = require("multer");
const LocalStrategy = require("passport-local");

exports.registerUser = async (req, res) => {
  const { name, email, password, phone, address } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(User);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      role: "customer",
    });
    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Registration failed", details: error.message });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || "default_secret_key", // Fallback in case JWT_SECRET is undefined
      { expiresIn: "1d" }
    );
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ error: "Login failed", details: error.message });
  }
};

exports.getUserProfile = async (req, res) => {
  const { id } = req.user; // Extracted from JWT middleware
  try {
    const user = await User.findByPk(id);
    res.status(200).json(user);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch user profile", details: error.message });
  }
};

exports.updateUserProfile = async (req, res) => {
  const { id } = req.user; // Extracted from JWT middleware
  const { name, email, phone, address } = req.body;
  try {
    const user = await User.update(
      { name, email, phone, address },
      { where: { id } }
    );
    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    res.status(500).json({ error: "Update failed", details: error.message });
  }
};

exports.getAllProducts = async (req, res) => {
  const { category, search, priceMin, priceMax, sort } = req.query;
  try {
    const where = {};
    if (category) where.category = category;
    if (search) where.name = { [Op.iLike]: `%${search}%` };
    if (priceMin || priceMax)
      where.price = {
        [Op.between]: [priceMin || 0, priceMax || Number.MAX_VALUE],
      };

    const products = await Product.findAll({
      where,
      order: sort ? [[sort, "ASC"]] : undefined,
    });
    res.status(200).json(products);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch products", details: error.message });
  }
};

exports.getProductDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.status(200).json(product);
  } catch (error) {
    res
      .status(500)
      .json({
        error: "Failed to fetch product details",
        details: error.message,
      });
  }
};

// Create Product with File Upload
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, size, color, category, stock } = req.body;
    console.log(name);

    if (req.file) {
      thumbnailBuffer = req.file.buffer;
    } else {
      console.log("No image uploaded.");
      thumbnailBuffer = Buffer.from("No image available!");
    }

    const productThumbnailBase64 = thumbnailBuffer.toString("base64");

    // Save product with the image file path
    const product = await Product.create({
      name,
      description,
      price,
      size,
      color,
      category,
      stock,
      image_url: productThumbnailBase64, // Save filename (not the full path)
    });

    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Product creation failed", details: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, size, color, category, stock, image_url } =
    req.body;
  try {
    const product = await Product.update(
      { name, description, price, size, color, category, stock, image_url },
      { where: { id } }
    );
    res.status(200).json({ message: "Product updated successfully", product });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Product update failed", details: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    await Product.destroy({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to delete product", details: error.message });
  }
};

exports.getUserCart = async (req, res) => {
  try {
    const cartItems = await Cart.findAll({
      where: { user_id: 1 },
      include: Product,
    });
    res.status(200).json(cartItems);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch cart", details: error.message });
  }
};

exports.addToCart = async (req, res) => {
  const { product_id, quantity } = req.body;
  try {
    const cartItem = await Cart.create({ user_id: 1, product_id, quantity });
    res.status(201).json({ message: "Added to cart", cartItem });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to add to cart", details: error.message });
  }
};

// Update the quantity of a cart item
exports.updateCartQuantity = async (req, res) => {
  const { cartItemId } = req.params; // Get cart item ID from URL params
  const { quantity } = req.body; // New quantity from request body
  console.log(cartItemId);

  try {
    const cartItem = await Cart.findOne({
      where: { id: cartItemId, user_id: 1 },
    });

    if (!cartItem) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    cartItem.quantity = quantity;
    await cartItem.save();

    res.status(200).json({ message: "Cart item quantity updated", cartItem });
  } catch (error) {
    res
      .status(500)
      .json({
        error: "Failed to update cart item quantity",
        details: error.message,
      });
  }
};

// Delete a cart item
exports.deleteCartItem = async (req, res) => {
  const { cartItemId } = req.params; // Get cart item ID from URL params

  try {
    const cartItem = await Cart.findOne({
      where: { id: cartItemId, user_id: 1 },
    });

    if (!cartItem) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    await cartItem.destroy();

    res.status(200).json({ message: "Cart item deleted" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to delete cart item", details: error.message });
  }
};

// Fetch selected cart items
exports.getSelectedCartItems = async (req, res) => {
  try {
    // const userId = req.user.id; // Assuming the user ID is available in the request
    const selectedItems = await Cart.findAll({
      where: {
        user_id : 1,
        isSelected: true,
      },
      include: ["Product"], // Adjust based on your association
    });

    return res.status(200).json(selectedItems);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Failed to fetch selected cart items" });
  }
};

// Update is_selected status
exports.updateCartItemSelection = async (req, res) => {
  try {
    const { cartItemId } = req.params;
    const { isSelected } = req.body;
    console.log("//////////////////////////////////////////////////////");
    console.log(isSelected);

    const cartItem = await Cart.findByPk(cartItemId);
    console.log(cartItem);
    

    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    cartItem.isSelected = isSelected;
    await cartItem.save();

    return res
      .status(200)
      .json({ message: "Cart item selection updated", cartItem });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Failed to update cart item selection" });
  }
};

// Fetch user shipping address
exports.getUserShippingAddress = async (req, res) => {
  try {
    // const userId = req.user.id; // Assuming the user ID is available in the request
    const user = await User.findByPk(1);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { address, city, state, postalCode, country } = user;
    return res.status(200).json({ address, city, state, postalCode, country });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Failed to fetch user shipping address" });
  }
};

const stripe = require('stripe')(process.env.secret_key); // Add your Stripe secret key here

exports.createOrder = async (req, res) => {
    const { cart_items, total_price, shipping_address } = req.body;
    try {
      // Create the order record in the database
      const order = await Order.create({
        user_id: 1, // Use the user ID from the session or token
        total_price,
        status: 'pending',
        shipping_address, // Add shipping address if needed
      });
  
      // Create order items in the database
      for (const item of cart_items) {
        await OrderItem.create({
          order_id: order.id,
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price, // Use the price of each individual item
        });
      }
            
      // Prepare the line items for the Stripe checkout session
      const line_items = cart_items.map(item => ({        
        price_data: {
          currency: 'usd', // Set the currency
          product_data: {
            name: item.Product.name, // Adjust to access correct property
            description: item.Product.description, // Adjust to access correct property

            // Optionally, you can add an image URL here
          },
          unit_amount: Math.round(item.Product.price * 100), // Price should be in the smallest currency unit (cents for USD)
        },
        quantity: item.quantity,
      }));
      console.log("_____________________________________________________");
      
      console.log(line_items);
  
      // Create the Stripe Checkout session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: line_items,
        mode: 'payment',
        success_url: `${process.env.FURL}/success`, // Redirect URL on success
        cancel_url: `${process.env.FURL}/failure`, // Redirect URL on cancellation
      });
  
      // Return the session URL in the response
      res.status(201).json({
        order,
        sessionId: session.id // Send the session URL to the client for redirection
      });
      console.log(session.id);
      
    } catch (error) {
      res.status(500).json({
        error: 'Failed to create order',
        details: error.message,
      });
    }
  };



exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.status(200).json(categories);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch categories", details: error.message });
  }
};

exports.createCategory = async (req, res) => {
  const { name, description } = req.body;
  try {
    const category = await Category.create({ name, description });
    res
      .status(201)
      .json({ message: "Category created successfully", category });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to create category", details: error.message });
  }
};

exports.updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  try {
    const category = await Category.update(
      { name, description },
      { where: { id } }
    );
    res
      .status(200)
      .json({ message: "Category updated successfully", category });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to update category", details: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    await Category.destroy({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to delete category", details: error.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        {
          model: OrderItem,
          attributes: ["id", "product_id", "quantity", "price"],
        },
      ],
    });
    res.status(200).json(orders);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch orders", details: error.message });
  }
};

exports.getOrderDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findByPk(id, { include: OrderItem });
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.status(200).json(order);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch order details", details: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const order = await Order.update({ status }, { where: { id } });
    res.status(200).json({ message: "Order status updated", order });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to update order status", details: error.message });
  }
};

exports.makePayment = async (req, res) => {
  const { order_id, payment_method } = req.body;
  try {
    const order = await Order.findByPk(order_id);
    if (!order) return res.status(404).json({ error: "Order not found" });

    const payment = await Payment.create({
      order_id,
      payment_method,
      status: "success",
      amount: order.total_price,
    });
    res.status(201).json({ message: "Payment successful", payment });
  } catch (error) {
    res.status(500).json({ error: "Payment failed", details: error.message });
  }
};

exports.getProductReviews = async (req, res) => {
  const { id: product_id } = req.params;
  try {
    const reviews = await Review.findAll({ where: { product_id } });
    res.status(200).json(reviews);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch reviews", details: error.message });
  }
};

exports.addReview = async (req, res) => {
  const { id: user_id } = req.user;
  const { id: product_id } = req.params;
  const { rating, comment } = req.body;
  try {
    const review = await Review.create({
      user_id,
      product_id,
      rating,
      comment,
    });
    res.status(201).json({ message: "Review added successfully", review });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to add review", details: error.message });
  }
};

exports.deleteReview = async (req, res) => {
  const { id } = req.params;
  try {
    await Review.destroy({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to delete review", details: error.message });
  }
};

exports.getWishlist = async (req, res) => {
  const { id: user_id } = req.user;
  try {
    const wishlist = await Wishlist.findAll({
      where: { user_id },
      include: Product,
    });
    res.status(200).json(wishlist);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch wishlist", details: error.message });
  }
};

exports.addToWishlist = async (req, res) => {
  const { id: user_id } = req.user;
  const { product_id } = req.body;
  try {
    const wishlistItem = await Wishlist.create({ user_id, product_id });
    res.status(201).json({ message: "Added to wishlist", wishlistItem });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to add to wishlist", details: error.message });
  }
};

exports.removeFromWishlist = async (req, res) => {
  const { id } = req.params;
  try {
    await Wishlist.destroy({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res
      .status(500)
      .json({
        error: "Failed to remove from wishlist",
        details: error.message,
      });
  }
};

exports.createShipping = async (req, res) => {
  const { order_id, shipping_address, city, state, postal_code, country } =
    req.body;
  try {
    const shipping = await Shipping.create({
      order_id,
      shipping_address,
      city,
      state,
      postal_code,
      country,
      status: "pending",
    });
    res.status(201).json({ message: "Shipping details added", shipping });
  } catch (error) {
    res
      .status(500)
      .json({
        error: "Failed to create shipping details",
        details: error.message,
      });
  }
};

exports.updateShippingStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const shipping = await Shipping.update({ status }, { where: { id } });
    res.status(200).json({ message: "Shipping status updated", shipping });
  } catch (error) {
    res
      .status(500)
      .json({
        error: "Failed to update shipping status",
        details: error.message,
      });
  }
};
