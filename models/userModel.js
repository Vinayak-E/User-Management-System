const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({

   name:{
      type:String,
      
   },
     email:{
        type:String,
        
     },
      password:{
        type:String,
        
     },

     mobile:{
      type:String,
      
   },
     is_admin:{
        type:Number,
        
     }
        
});

module.exports=mongoose.model("User",userSchema) 