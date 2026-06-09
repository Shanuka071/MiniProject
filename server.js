const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

app.use(cors());
app.use(express.json());

// Connect to your local MongoDB
mongoose.connect('mongodb://localhost:27017/paddy_management_db')
    .then(() => console.log("🔌 SUCCESS: Connected to MongoDB Database!"))
    .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Import custom AI Routes
const forecastRoutes = require('./routes/forecastRoutes');
app.use('/api/ai', forecastRoutes);

app.get('/', (req, res) => {
    res.send("Paddy Market System Backend and AI Core Engine is officially Active!");
});

// Middleware to parse incoming JSON request bodies (Crucial for reading req.body)
app.use(express.json());

// Import Auth Routes
const authRoutes = require('./routes/authRoutes');

// Mount Auth Routes
app.use('/api/auth', authRoutes);

// Import Gazette Routes
const gazetteRoutes = require('./routes/gazetteRoutes');

// Mount Gazette Routes
app.use('/api/government', gazetteRoutes);

// Import Supply Chain Routes
const supplyRoutes = require('./routes/supplyRoutes');

// Mount Supply Chain Routes
app.use('/api/supply', supplyRoutes);

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server launched on port ${PORT}`);
});