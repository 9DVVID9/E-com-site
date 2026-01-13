import express from "express";
import {
    getActiveCart,
    addItemToCart,
    removeItemFromCart,
    checkoutCart //--new import for checkout
} from "../controllers/cart.controller.js";

const router = express.Router();

// Get active cart for logged-in user
router.get("/", getActiveCart);

// Add item to cart
router.post("/items", addItemToCart);

// Remove item from cart
router.delete("/items/:productId", removeItemFromCart);

// Checkout cart
router.post("/checkout", checkoutCart); //--new route for checkout

export default router;

