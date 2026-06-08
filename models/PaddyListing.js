// Farmers making list is considerable
//1.Import Libraries
const mongoose=require('mongoose');

//2.Create the Farmer Schema
const PaddyListingSchema=new mongoose.Schema({
    farmerId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'FarmerUser', 
        required: true 
    },
    paddyType: { type: String, enum: ['Samba', 'Nadu', 'Keeri Samba', 'Red Rice'], required: true },
    quantityKg: { type: Number, required: true },
    harvestMonth: { type: String, required: true }, 
    askingPricePerKg: { type: Number, required: true },
    
    status: { 
        type: String, 
        enum: ['Available', 'Purchased'], 
        default: 'Available' 
    },
    
    purchasedByMillerId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'MillerUser', 
        default: null 
    },
    datePosted: { type: Date, default: Date.now }
});


//3.Create the Model
const Farmer=mongoose.model('Farmer',PaddyListingSchema);
//4.Export the model
module.exports=Farmer;