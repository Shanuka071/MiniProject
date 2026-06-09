const mongoose = require('mongoose');

const GazettePriceSchema = new mongoose.Schema({
    itemType: { 
        type: String, 
        required: true, 
        unique: true // Prevents having duplicate price entries for the same item
    },
    controlledPricePerKg: { 
        type: Number, 
        required: true 
    }
}, { timestamps: true });

module.exports = mongoose.model('GazettePrice', GazettePriceSchema);