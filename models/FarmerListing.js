const mongoose = require('mongoose');

const FarmerListingSchema = new mongoose.Schema({
    farmerId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    riceVariety: { 
        type: String,
         required: true
         },
    availableQuantityKg: {
         type: Number, 
         required: true 
        },
    askingPricePerKg: {
         type: Number, 
         required: true 
        },
    moistureLevel: {
         type: Number,
          required: true 
        },
    isSold: {
         type: Boolean,
          default: false 
        }
}, { timestamps: true });

module.exports = mongoose.model('FarmerListing', FarmerListingSchema);