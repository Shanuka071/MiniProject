const express = require('express');
const router = express.Router();
const { spawn } = require('child_process');
const mongoose = require('mongoose');

// Define the schema to read our seeded data
const OrderSchema = new mongoose.Schema({
    riceVariety: String,
    quantityKg: Number,
    orderDate: Date
});
// Link to the exact 'groceryorders' collection we seeded
const GroceryOrder = mongoose.models.GroceryOrder || mongoose.model('GroceryOrder', OrderSchema, 'groceryorders');

router.get('/grocery-prediction', async (req, res) => {
    try {
        const { riceVariety } = req.query;

        if (!riceVariety) {
            return res.status(400).json({ success: false, error: "Missing riceVariety parameter" });
        }

        // 1. Fetch historical orders for this specific variety from MongoDB, sorted by date
        const historicalRecords = await GroceryOrder.find({ riceVariety: riceVariety }).sort({ orderDate: 1 });

        // 2. Map out just the numerical quantities into a clean array (e.g., [1200, 1450, 1800, 2100])
        const historyArray = historicalRecords.map(record => record.quantityKg);

        // 3. Prepare the payload structure your Python script expects
        const pythonPayload = {
            history: historyArray
        };

        // 4. Spawn the Python child process with the corrected folder name path
        const pythonProcess = spawn('python', ['../ai_engine/forecast.py', JSON.stringify(pythonPayload)]);

        let pythonData = "";
        let pythonError = "";

        pythonProcess.stdout.on('data', (data) => {
            pythonData += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            pythonError += data.toString();
        });

        pythonProcess.on('close', (code) => {
            if (code !== 0 || pythonError) {
                console.error("Python Error Engine Log:", pythonError);
                return res.status(500).json({ success: false, error: "AI execution failed", details: pythonError });
            }

            try {
                // Parse the clean JSON printed out by Python
                const parsedAIResult = JSON.parse(pythonData.trim());
                
                // Return our unified final data back to Chrome!
                res.json({
                    success: parsedAIResult.status === "success" || parsedAIResult.status === "fallback_baseline",
                    riceVariety: riceVariety,
                    predictedDemandKg: parsedAIResult.predicted_value,
                    engineStatus: parsedAIResult.status
                });
            } catch (parseErr) {
                res.status(500).json({ success: false, error: "Failed to parse AI output", raw: pythonData });
            }
        });

    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ success: false, error: "Internal Server Exception Error" });
    }
});

module.exports = router;