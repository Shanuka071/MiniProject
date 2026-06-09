//
const mongoose = require('mongoose');

const StockSchema = new mongoose.Schema({
    riceVariety: { type: String, required: true },
    quantityKg: { type: Number, required: true, default: 0 },
    moisturePercentage: { type: Number, required: true },
    status: { 
        type: String, 
        enum: ['Raw', 'Drying', 'Milled', 'Ready'], 
        required: true 
    }
}, { timestamps: true });

module.exports = mongoose.model('Stock', StockSchema);