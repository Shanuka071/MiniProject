const express = require('express');
const router = express.Router();
const GazettePrice = require('../models/GazettePrice');

// ROUTE 1: Get all official Sri Lankan controlled prices (Publicly accessible by all roles)
router.get('/prices', async (req, res) => {
    try {
        const prices = await GazettePrice.find();
        res.json({ success: true, data: prices });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: "Failed to fetch Gazette prices" });
    }
});

// ROUTE 2: Update or Create a Gazette price (Strictly managed by Government account)
router.post('/update', async (req, res) => {
    try {
        const { itemType, controlledPricePerKg } = req.body;

        // Upsert logic: If item exists, update it. If not, create a new entry.
        const updatedPrice = await GazettePrice.findOneAndUpdate(
            { itemType },
            { controlledPricePerKg },
            { new: true, upsert: true }
        );

        res.json({ success: true, message: "Government Gazette updated!", data: updatedPrice });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: "Failed to update Gazette price" });
    }
});

module.exports = router;