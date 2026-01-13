import { openDB } from "../db/db.js";

function getUserId(req) {
    return req.headers["x-user-id"];
}

// Function to get cart items for a user
export async function getActiveCart(req, res) {
    try {
        const userId = getUserId(req);

        if (!userId) {
            return res.status(401).json({
                error: "User not authenticated"
            });
        }

        const db = await openDB();

        // Get active cart
        const cart = await db.get(
            `SELECT id, total_amount
             FROM carts
             WHERE user_id = ? AND status = 'active'`,
            [userId]
        );

        // No cart yet
        if (!cart) {
            return res.status(200).json({
                cartId: null,
                items: [],
                totalAmount: 0
            });
        }

        // Get cart items
        const items = await db.all(
            `SELECT
                p.id AS productId,
                p.name,
                p.price,
                ci.quantity,
                (p.price * ci.quantity) AS subtotal
             FROM cart_items ci
             JOIN products p ON ci.product_id = p.id
             WHERE ci.cart_id = ?`,
            [cart.id]
        );

        res.status(200).json({
            cartId: cart.id,
            totalAmount: cart.total_amount,
            items
        });

    } catch {
        res.status(500).json({
            error: "Internal server error"
        });
    }
}

//Add item to cart
export async function addItemToCart(req, res) {
    try {
        const userId = getUserId(req);
        const { productId, quantity = 1 } = req.body;

        if (!userId) {
            return res.status(401).json({
                error: "User not authenticated"
            });
        }

        const db = await openDB();

        // Check product stock
        const product = await db.get(
            `SELECT stock FROM products WHERE id = ?`,
            [productId]
        );

        if (!product) {
            return res.status(404).json({
                error: "Product not found"
            });
        }

        if (product.stock < quantity) {
            return res.status(400).json({
                error: "Not enough stock available"
            });
        }

        // Get active cart
        let cart = await db.get(
            `SELECT id FROM carts
             WHERE user_id = ? AND status = 'active'`,
            [userId]
        );

        // Create cart if it doesn't exist
        if (!cart) {
            const result = await db.run(
                `INSERT INTO carts (user_id) VALUES (?)`,
                [userId]
            );
            cart = { id: result.lastID };
        }

        // Insert or update cart item
        await db.run(
            `INSERT INTO cart_items (cart_id, product_id, quantity)
             VALUES (?, ?, ?)
             ON CONFLICT(cart_id, product_id)
             DO UPDATE SET quantity = quantity + excluded.quantity`,
            [cart.id, productId, quantity]
        );

        res.status(201).json({
            message: "Item added to cart"
        });

    } catch {
        res.status(500).json({
            error: "Internal server error"
        });
    }
}

// Remove item from cart
export async function removeItemFromCart(req, res) {
    try {
        const userId = getUserId(req);
        const { productId } = req.params;

        if (!userId) {
            return res.status(401).json({
                error: "User not authenticated"
            });
        }

        const db = await openDB();

        const result = await db.run(
            `DELETE FROM cart_items
             WHERE product_id = ?
             AND cart_id = (
                SELECT id FROM carts
                WHERE user_id = ? AND status = 'active'
             )`,
            [productId, userId]
        );

        if (result.changes === 0) {
            return res.status(404).json({
                error: "Item not found in cart"
            });
        }

        res.status(200).json({
            message: "Item removed from cart",
            changes: result.changes
        });

    } catch {
        res.status(500).json({
            error: "Internal server error"
        });
    }
}

//--new checkout function - convert cart to order
export async function checkoutCart(req, res) {
    try {
        const userId = getUserId(req);

        if (!userId) {
            return res.status(401).json({
                error: "User not authenticated"
            });
        }

        const db = await openDB();

        // get active cart with items
        const cart = await db.get(
            `SELECT id, total_amount
             FROM carts
             WHERE user_id = ? AND status = 'active'`,
            [userId]
        );

        if (!cart) {
            return res.status(404).json({
                error: "No active cart found"
            });
        }

        // get all items in cart
        const items = await db.all(
            `SELECT product_id, quantity
             FROM cart_items
             WHERE cart_id = ?`,
            [cart.id]
        );

        if (items.length === 0) {
            return res.status(400).json({
                error: "Cart is empty"
            });
        }

        // check stock for all items
        for (const item of items) {
            const product = await db.get(
                `SELECT stock FROM products WHERE id = ?`,
                [item.product_id]
            );

            if (!product || product.stock < item.quantity) {
                return res.status(400).json({
                    error: `Not enough stock for product ID ${item.product_id}`
                });
            }
        }

        // update cart status to 'completed' (making it an order)
        await db.run(
            `UPDATE carts
             SET status = 'completed', updated_at = CURRENT_TIMESTAMP
             WHERE id = ?`,
            [cart.id]
        );

        // reduce stock for each product
        for (const item of items) {
            await db.run(
                `UPDATE products
                 SET stock = stock - ?
                 WHERE id = ?`,
                [item.quantity, item.product_id]
            );
        }

        // get the completed order details
        const order = await db.get(
            `SELECT * FROM carts WHERE id = ?`,
            [cart.id]
        );

        res.status(200).json({
            message: "Order placed successfully",
            orderId: order.id,
            totalAmount: order.total_amount,
            order: order
        });

    } catch (error) {
        console.error("Checkout error:", error);
        res.status(500).json({
            error: "Internal server error"
        });
    }
}


