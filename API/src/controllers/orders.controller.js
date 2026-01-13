import { openDB } from '../db/db.js';

export const createOrder = async (req, res) => {
    const db = await openDB();
    const { items, total } = req.body;
    const username = req.headers.username;

    if (!username) {
        return res.status(401).json({ error: 'User not authenticated' });
    }

    try {
        //  find the User ID based on the username
        const user = await db.get('SELECT id FROM users WHERE username = ?', [username]);
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // create the Order
        const result = await db.run(
            'INSERT INTO orders (user_id, total_amount) VALUES (?, ?)',
            [user.id, total]
        );
        const orderId = result.lastID;

        //  save Order Items & Update Stock
        for (const item of items) {
            // Add to order_items table
            await db.run(
                'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
                [orderId, item.productId, item.quantity, item.price]
            );

            // subtract from products table stock
            await db.run(
                'UPDATE products SET stock = stock - ? WHERE id = ?',
                [item.quantity, item.productId]
            );
        }

        res.json({ id: orderId, message: 'Order created successfully' });
    } catch (error) {
        console.error('Checkout Error:', error);
        res.status(500).json({ error: 'Failed to process order' });
    }
};

export const getOrders = async (req, res) => {
    const db = await openDB();
    try {
        // this query joins users so you can see WHO ordered what
        const orders = await db.all(`
            SELECT orders.*, users.username 
            FROM orders 
            LEFT JOIN users ON orders.user_id = users.id 
            ORDER BY created_at DESC
        `);
        res.json(orders);
    } catch (error) {
        console.error('Get Orders Error:', error);
        res.status(500).json({ error: 'Failed to retrieve orders' });
    }
};