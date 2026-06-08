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

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server launched on port ${PORT}`);
});