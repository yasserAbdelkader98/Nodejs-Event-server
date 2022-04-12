const mongoose = require('mongoose');
const bcrypt = require('mongoose-bcrypt');
const AutoInc = require("mongoose-sequence")(mongoose);

const adminSchema = new mongoose.Schema({
    _id:Number,
    userName:{type:String,required:true},
    password:{type:String,required:true,bcrypt:true},
    email:{ type: String, required: true, unique: true }
})

adminSchema.plugin(bcrypt);
adminSchema.plugin(AutoInc,{
    id:'admin counter',
    inc_field:'_id'
})

module.exports=mongoose.model('admins',adminSchema);