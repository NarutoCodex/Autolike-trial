const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// Ye do lines zaroori hain JSON data read karne ke liye
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI);

const User = mongoose.model('User', new mongoose.Schema({
    username: { type: String, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    balance: { type: Number, default: 0 },
    status: { type: String, default: "new" },
    uid: { type: String, default: "" },
    pendingBalance: { type: Number, default: 0 },
    redeemCode: { type: String, default: "" },
    expiryDate: Date,
    totalLikes: { type: Number, default: 0 },
    history: []
}));

// SIGNUP ROUTE
app.post('/api/auth/signup', async (req, res) => {
    try {
        const { username, password } = req.body;
        if(!username || !password) return res.status(400).json({ success: false, msg: "Missing fields" });
        
        const exists = await User.findOne({ username: username.toLowerCase() });
        if (exists) return res.status(400).json({ success: false, msg: "Username already taken!" });

        const user = new User({ username: username.toLowerCase(), password });
        await user.save();
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ success: false, msg: "Signup Error" });
    }
});

// LOGIN ROUTE
app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username: username.toLowerCase(), password });
        if (!user) return res.status(401).json({ success: false, msg: "Invalid ID or Password!" });
        res.json({ success: true, user });
    } catch (e) {
        res.status(500).json({ success: false, msg: "Login Error" });
    }
});

// Baki saare routes (add-balance, buy-likes, admin) pehle jaise hi rakho...
module.exports = app;
