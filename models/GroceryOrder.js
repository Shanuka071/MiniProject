//create a json file for Grocery owners
//1.Import libraries
const mongoose=require('mongoose');

//2.Create a Grocery Owner Schema
const GroceryOrderSchema=new mongoose.Schema({
    groceryStoreId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'GroceryUser', 
        required: true 
    },
    riceVariety: { 
        type: String,
         enum: ['Samba', 'Nadu', 'Keeri Samba', 'Red Rice'],
          required: true 
        }, 
    orderedQuantityKg: {
         type: Number,
          required: true 
        },
    orderMonth: {
         type: String,
          required: true 
        }, 
    deliveryStatus: {
         type: String,
          enum: ['Pending', 'Completed'],
           default: 'Pending' 
        },
    dateOrdered: {
         type: Date,
          default: Date.now 
        }
});

//3.Create a model for Grocery Shcema
const GroceryOrder=mongoose.model('GroceryOrder',GroceryOrderSchema);

//Export that model
module.exports=GroceryOrder;