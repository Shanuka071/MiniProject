//Create this to train the model
const mongoose = require('mongoose');

// Connect to your local database
mongoose.connect('mongodb://localhost:27017/paddy_management_db')
    .then(() => console.log("🔌 Connected to database for seeding..."))
    .catch(err => console.error(err));

// Create a quick schema matching your grocery orders collection
const OrderSchema = new mongoose.Schema({
    riceVariety: String,
    quantityKg: Number,
    orderDate: { type: Date, default: Date.now }
});

const GroceryOrder = mongoose.model('GroceryOrder', OrderSchema, 'groceryorders');

async function seedData() {
    // Clear any old data first
    await GroceryOrder.deleteMany({});
    
    // Create 3 months of mock historical sales data for the AI to analyze
    const mockOrders = [
        { riceVariety: 'Samba', quantityKg: 1200, orderDate: new Date('2026-03-15') },
        { riceVariety: 'Samba', quantityKg: 1450, orderDate: new Date('2026-04-10') },
        { riceVariety: 'Samba', quantityKg: 1800, orderDate: new Date('2026-05-01') },
        { riceVariety: 'Samba', quantityKg: 2100, orderDate: new Date('2026-05-20') },
        { riceVariety: 'Keeri Samba', quantityKg: 3000, orderDate: new Date('2026-05-15') }
    ];

    await GroceryOrder.insertMany(mockOrders);
    console.log("🌾 SUCCESS: Historical Paddy Data successfully injected!");
    mongoose.connection.close();
}

seedData();
