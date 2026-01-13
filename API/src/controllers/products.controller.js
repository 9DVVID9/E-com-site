import { openDB } from "../db/db.js";

// fetch all products
export async function getProducts(req, res) {

    try {

        // Open database
        const db = await openDB();

        //Retrieve all rows
        const products = await db.all("SELECT * FROM products");

        // Validation of the response
        if (products.length === 0) {
            return res.status(404).json({
                error: "There are not products."
            })
        }

        res.status(200).json(products);

    } catch {

        // Server Error
        res.status(500).json({
            error: "Internal server error"
        });

    }

}

// Create a product
export async function createProduct(req, res) {

    try {
        //Get body data from the JSON in the request
        const { code, name, category, price, stock, imageurl } = req.body;

        //Open Database
        const db = await openDB();

        //Insert new product with SQL query
        const result = await db.run(
            `INSERT INTO products (code, name, category, price, stock, imageurl)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [code, name, category, price, stock, imageurl]
        )

        res.status(201).json({ id: result.lastID, changes: result.changes });

    } catch {
        res.status(500).json({
            error: "Internal server error"
        });

    }
}

// Update a product
export async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const { code, name, category, price, stock, imageurl } = req.body;

    // Open Database
    const db = await openDB();

    // Update product with SQL query
    const result = await db.run(
      `UPDATE products
       SET code=?, name=?, category=?, price=?, stock=?, imageurl=?
       WHERE id=?`,
      [code, name, category, price, stock, imageurl, id]
    );

    res.status(200).json({
        message: "Product updated correctly",
        changes: result.changes
     });

  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
}

// Delete a product
export async function deleteProduct(req, res) {
  try {
    // We obtain the ID to remove from the URL
    const { id } = req.params;

    const db = await openDB();

    // We delete the corresponding row in the database
    const result = await db.run(
      `DELETE FROM products WHERE id=?`,
      [id]
    );

    res.status(200).json({
      message: "Product deleted successfully",
      changes: result.changes
    });

  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
}

// Get a product by ID
export async function getProductById(req, res) {
  try {
    const { id } = req.params;

    const db = await openDB();

    // Retrieve item using SQL
    const product = await db.get(
      "SELECT * FROM products WHERE id = ?",
      [id]
    );

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);

  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
}