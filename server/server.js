const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs"); 
const jwt = require("jsonwebtoken");

const app = express();

app.use(cors());
app.use(express.json());

const jwt_secret = "SeCr3t";
const PORT = process.env.PORT || 3000;

mongoose
  .connect('mongodb+srv://mantissa6789:Mantis%402510@cluster0.9ramotn.mongodb.net/cat-app-chat')
  .then(() => console.log("MongoDB connected..."))
  .catch(() => console.log("Couldn't connect to MongoDB..."));

// Define the schema and model
const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);
// JWT Authentication Middleware
const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ message: "Access Denied." });

    try {
        const verified = jwt.verify(token, jwt_secret);
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).json({ message: "Token invalid" });
    }
};

// Signup route
app.post('/signup', async (req, res) => {
    const { fullName, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
    }

    try {
        const existingUser = await User.findOne({ email }); 
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ fullName, email, password: hashedPassword });
        await newUser.save();

        const token = jwt.sign({ _id: newUser._id }, jwt_secret, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// Login route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Email not found' });
        }

        const validPassword = await bcrypt.compare(password, user.password); 
        if (!validPassword) {
            return res.status(400).json({ message: "Password Incorrect" });
        }

        const token = jwt.sign({ _id: user._id }, jwt_secret, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
});
