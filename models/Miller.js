//Create Miller Registration
//1.import Librariess
const mongoose=require('mongoose');

//2.Create Schema 
const MillerUserSchema= new mongoose.Schema({
    millName: {
         type: String, 
         required: true 
        },
    ownerName: {
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
    millAddress: {
         type: String, 
         required: true 
        },
    millingCapacityTonsPerDay: {
         type: Number,
          required: true
         },
    dateRegistered: {
         type: Date,
          default: Date.now 
        }
});

//3.Create a model 
const MillerUser=mongoose.model('MillerUser',MillerUserSchema);
//Export the model
module.exports=MillerUser;