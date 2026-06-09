const express = require('express');
const router = express.Router();
const Stock = require('../models/Stock');
const FarmerListing = require('../models/FarmerListing');

// ==========================================
// 🌾 FARMER ENDPOINTS
// ==========================================

// 1. Post a new paddy crop listing for sale
router.post('/farmer/list', async (req, res) => {
    try {
        const { farmerId, riceVariety, availableQuantityKg, askingPricePerKg, moistureLevel } = req.body;

        const newListing = new FarmerListing({
            farmerId,
            riceVariety,
            availableQuantityKg: Number(availableQuantityKg),
            askingPricePerKg: Number(askingPricePerKg),
            moistureLevel: Number(moistureLevel) // Wetness factor tracked!
        });

        await newListing.save();
        res.status(201).json({ success: true, message: "Paddy crop listed successfully!", data: newListing });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: "Failed to post farmer listing" });
    }
});

// 2. Get all active farmer listings (So the Mill Owner can view/AI can filter them)
router.get('/farmer/listings', async (req, res) => {
    try {
        // Populates the farmer profile details automatically along with the listing
        const listings = await FarmerListing.find({ isSold: false }).populate('farmerId', 'fullName district phoneNumber');
        res.json({ success: true, data: listings });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: "Failed to fetch farmer listings" });
    }
});

// ==========================================
// 🏭 MILL OWNER ENDPOINTS
// ==========================================

// 3. Update or add Mill warehouse inventory stock levels
router.post('/mill/stock/update', async (req, res) => {
    try {
        const { riceVariety, quantityKg, moisturePercentage, status } = req.body;

        // Upsert logic based on variety & status (Raw, Drying, Milled, Ready)
        const updatedStock = await Stock.findOneAndUpdate(
            { riceVariety, status },
            { 
                $inc: { quantityKg: Number(quantityKg) }, // Increments current amount
                moisturePercentage: Number(moisturePercentage) 
            },
            { new: true, upsert: true }
        );

        res.json({ success: true, message: "Mill stock updated successfully!", data: updatedStock });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: "Failed to update mill stock" });
    }
});

// 4. Get current Mill inventory overview
router.get('/mill/stocks', async (req, res) => {
    try {
        const stocks = await Stock.find();
        res.json({ success: true, data: stocks });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: "Failed to fetch mill stocks" });
    }
});

module.exports = router;