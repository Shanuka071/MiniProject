const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Imports your multi-role user schema
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. REGISTER ROUTE (Matches your explicit validation fields)
router.post('/register', async (req, res) => {
    try {
        const { fullName, email, password, role, district, phoneNumber, latitude, longitude } = req.body;

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ success: false, error: "User already registered with this email" });
        }

        // Hash the password for security
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user record with your exact fields
        user = new User({
            fullName,
            email,
            password: hashedPassword,
            role,
            district,
            phoneNumber,
            latitude: Number(latitude),
            longitude: Number(longitude)
        });

        await user.save();
        res.status(201).json({ success: true, message: "User registered successfully!" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: "Registration server error" });
    }
});

// 2. LOGIN ROUTE
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Verify user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, error: "Invalid email or password" });
        }

        // Validate password match
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, error: "Invalid email or password" });
        }

        // Generate a secure JWT Token containing user metadata and role
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            'YOUR_SUPER_SECRET_KEY_123', // In production, keep this in an .env file
            { expiresIn: '24h' }
        );

        // Send token and user details back to frontend
        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                role: user.role,
                district: user.district
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: "Login server error" });
    }
});

module.exports = router;