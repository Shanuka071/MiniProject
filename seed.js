const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User'); // Imports your User model

// 1. Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/paddy_management_db')
    .then(() => console.log("🔌 Connected to database for ultimate data seeding..."))
    .catch(err => console.error(err));

// 2. Define Grocery Orders Schema (For AI training history data)
const OrderSchema = new mongoose.Schema({
    riceVariety: String,
    quantityKg: Number,
    orderDate: { type: Date }
});
const GroceryOrder = mongoose.models.GroceryOrder || mongoose.model('GroceryOrder', OrderSchema, 'groceryorders');

// --- ADDITIONAL SCHEMAS FOR COUPLING DATA OVERVIEWS ---
const GazetteSchema = new mongoose.Schema({ itemType: String, controlledPricePerKg: Number });
const GazettePrice = mongoose.models.GazettePrice || mongoose.model('GazettePrice', GazetteSchema, 'gazetteprices');

const FarmerListingSchema = new mongoose.Schema({
    farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    riceVariety: String,
    availableQuantityKg: Number,
    askingPricePerKg: Number,
    moistureLevel: Number,
    isSold: { type: Boolean, default: false }
});
const FarmerListing = mongoose.models.FarmerListing || mongoose.model('FarmerListing', FarmerListingSchema, 'farmerlistings');

const StockSchema = new mongoose.Schema({
    riceVariety: String,
    quantityKg: Number,
    moisturePercentage: Number,
    status: String
});
const Stock = mongoose.models.Stock || mongoose.model('Stock', StockSchema, 'stocks');


async function runMasterSeed() {
    try {
        // -------------------------------------------------------------
        // PHASE 1: SEED PROFILES WITH ALL REQUIRED SCHEMA PROPERTIES
        // -------------------------------------------------------------
        console.log("🧹 Clearing old user profiles...");
        await User.deleteMany({});

        // Hash a single universal test password ('password123') for all users
        const salt = await bcrypt.genSalt(10);
        const testPassword = await bcrypt.hash('password123', salt);

        const systemUsers = [
            {
                fullName: "Kamal Perera",
                email: "miller@paddymill.lk",
                password: testPassword,
                role: "mill_owner",
                district: "Polonnaruwa",
                phoneNumber: "0771234567",
                latitude: 7.9398, // Realistic Polonnaruwa coordinates for AI geo-matching later!
                longitude: 81.0031
            },
            {
                fullName: "Sunil Silva",
                email: "farmer@paddymill.lk",
                password: testPassword,
                role: "farmer",
                district: "Anuradhapura",
                phoneNumber: "0719876543",
                latitude: 8.3114, // Anuradhapura coordinates
                longitude: 80.4037
            },
            {
                fullName: "Asanka Fernando",
                email: "grocery@paddymill.lk",
                password: testPassword,
                role: "grocery_owner",
                district: "Colombo",
                phoneNumber: "0751112223",
                latitude: 6.9271, // Colombo coordinates
                longitude: 79.8612
            },
            {
                fullName: "Gov Administration",
                email: "admin@government.gov.lk",
                password: testPassword,
                role: "government",
                district: "Colombo",
                phoneNumber: "0112223334",
                latitude: 6.8937,
                longitude: 79.9189
            }
        ];

        await User.insertMany(systemUsers);
        console.log("👤 SUCCESS: 4 Secure User Profiles loaded with complete geo-data fields!");

        // -------------------------------------------------------------
        // PHASE 2: SEED HISTORICAL MARKET DATA FOR THE AI ENGINE
        // -------------------------------------------------------------
        console.log("🧹 Clearing old market records...");
        await GroceryOrder.deleteMany({});
        
        const realisticOrders = [
            // --- SAMBA HISTORICAL TREND ---
            { riceVariety: 'Samba', quantityKg: 1200, orderDate: new Date('2026-01-10') },
            { riceVariety: 'Samba', quantityKg: 1350, orderDate: new Date('2026-02-12') },
            { riceVariety: 'Samba', quantityKg: 1500, orderDate: new Date('2026-03-05') },
            { riceVariety: 'Samba', quantityKg: 1800, orderDate: new Date('2026-04-18') },
            { riceVariety: 'Samba', quantityKg: 2100, orderDate: new Date('2026-05-22') },
            { riceVariety: 'Samba', quantityKg: 2350, orderDate: new Date('2026-06-02') },

            // --- KEERI SAMBA HISTORICAL TREND ---
            { riceVariety: 'Keeri Samba', quantityKg: 800,  orderDate: new Date('2026-01-15') },
            { riceVariety: 'Keeri Samba', quantityKg: 950,  orderDate: new Date('2026-02-20') },
            { riceVariety: 'Keeri Samba', quantityKg: 1100, orderDate: new Date('2026-03-18') },
            { riceVariety: 'Keeri Samba', quantityKg: 2500, orderDate: new Date('2026-04-10') },
            { riceVariety: 'Keeri Samba', quantityKg: 1400, orderDate: new Date('2026-05-14') },
            { riceVariety: 'Keeri Samba', quantityKg: 1600, orderDate: new Date('2026-06-05') },

            // --- NADU HISTORICAL TREND ---
            { riceVariety: 'Nadu', quantityKg: 4000, orderDate: new Date('2026-01-05') },
            { riceVariety: 'Nadu', quantityKg: 4150, orderDate: new Date('2026-02-10') },
            { riceVariety: 'Nadu', quantityKg: 4300, orderDate: new Date('2026-03-12') },
            { riceVariety: 'Nadu', quantityKg: 4500, orderDate: new Date('2026-04-25') },
            { riceVariety: 'Nadu', quantityKg: 4750, orderDate: new Date('2026-05-19') },
            { riceVariety: 'Nadu', quantityKg: 5000, orderDate: new Date('2026-06-08') }
        ];

        await User.db.collection('groceryorders').insertMany(realisticOrders);
        console.log("🌾 SUCCESS: 6 Months of grain data loaded directly for the AI Core!");

        // -------------------------------------------------------------
        // PHASE 3: SEED SYSTEM CORE (GAZETTE, CROP POSTINGS & STOCKS)
        // -------------------------------------------------------------
        console.log("🧹 Clearing old gazette, listings, and stock data...");
        await GazettePrice.deleteMany({});
        await FarmerListing.deleteMany({});
        await Stock.deleteMany({});

        // 1. Seed State Gazette Prices
        await GazettePrice.insertMany([
            { itemType: "Paddy-Samba", controlledPricePerKg: 130 },
            { itemType: "Paddy-Nadu", controlledPricePerKg: 125 },
            { itemType: "Rice-Samba", controlledPricePerKg: 230 },
            { itemType: "Rice-Nadu", controlledPricePerKg: 220 }
        ]);
        console.log("🏛️ SUCCESS: Government Gazette controlled pricing models deployed!");

        // 2. Locate our newly generated farmer from Phase 1 to attach a marketplace post
        const seededFarmer = await User.findOne({ role: "farmer" });
        if (seededFarmer) {
            await FarmerListing.create({
                farmerId: seededFarmer._id,
                riceVariety: "Samba",
                availableQuantityKg: 4500,
                askingPricePerKg: 128,
                moistureLevel: 14 // Standard safe moisture baseline
            });
            console.log("🌾 SUCCESS: Live farmer crop postings published and linked!");
        }

        // 3. Initialize Mill Factory Default Stocks
        await Stock.insertMany([
            { riceVariety: "Samba", quantityKg: 15000, moisturePercentage: 13.5, status: "Ready" },
            { riceVariety: "Nadu", quantityKg: 8500, moisturePercentage: 17.2, status: "Drying" }
        ]);
        console.log("🏭 SUCCESS: Default Mill Warehouse stock parameters established!");

    } catch (err) {
        console.error("❌ Seeding went wrong:", err);
    } finally {
        mongoose.connection.close();
        console.log("🔌 Database connection cleanly disconnected.");
    }
}

runMasterSeed();