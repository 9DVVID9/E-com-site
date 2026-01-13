import { openDB } from "../db/db.js";
import bcrypt from 'bcrypt';

// 1. REGISTER FUNCTION
export async function register(req, res) {
    const { username, password, role } = req.body;

    try {
        const db = await openDB();

        // Check if username already exists
        const existingUser = await db.get(
            "SELECT * FROM users WHERE username = ?", 
            [username]
        );
        
        if (existingUser) {
            return res.status(400).json({ error: "Username already taken" });
        }

        // Hash the password (10 rounds)
        const hashedPassword = await bcrypt.hash(password, 10);

        // Default to 'user' role if none provided
        const userRole = role || 'user';
        
        const result = await db.run(
            "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
            [username, hashedPassword, userRole]
        );

        res.json({ 
            id: result.lastID, 
            username: username, 
            role: userRole,
            message: "Registration successful" 
        });

    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ error: "Server error during registration" });
    }
}

// 2. LOGIN FUNCTION
export async function login(req, res) {
    const { username, password } = req.body;

    try {
        const db = await openDB();

        // Get user by username ONLY
        const user = await db.get(
            "SELECT * FROM users WHERE username = ?",
            [username]
        );

        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // Compare the provided password with the hashed password in DB
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // Login successful
        res.status(200).json({
            message: "Login successful",
            id: user.id,
            username: user.username,
            role: user.role 
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Server error" });
    }
}