const mongoose = require('mongoose');
const bcrypt = require('mongoose-bcrypt');

const speakerSchema = new mongoose.Schema({
   
    userName:{type:String,required:true},
    password:{type:String,required:true,bcrypt:true},
    email:{ type: String, required: true, unique: true },
    address:{
        city: String,
        street: String,
        building: Number,
    },
    role:{type:String,enum: ["speaker", "admin"]},
    image:String
})

speakerSchema.plugin(bcrypt);
module.exports=mongoose.model('speakers',speakerSchema);