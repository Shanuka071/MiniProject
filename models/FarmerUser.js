//Farmer Registratio Form
//1.Import libraries
const mongoose=require('mongoose');

//2.Create the Model
const FarmerUserSchema=new mongoose.Schema({
    fullName: { 
        type: String, 
        required: true 
    },
    email: {
         type: String,
          required: true, 
          unique: true 
        },
    password: {
         type: String, 
         required: true 
        }, 
    phoneNumber: {
         type: String, 
         required: true 
        },
    district: {
         type: String, 
         required: true 
        }, 
    latitude: {
         type: Number, 
         required: true 
        },  
    longitude: {
         type: Number,
          required: true 
        }, 
    dateRegistered: {
         type: Date, 
         default: Date.now 
        }
});
//3.Create the models 
const FarmerUser=mongoose.model('mongoose',FarmerUserSchema);
//4.Export model
module.exports=FarmerUser;