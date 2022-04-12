const mongoose = require('mongoose');
const bcrypt = require('mongoose-bcrypt');
const AutoInc = require("mongoose-sequence")(mongoose);

const studentSchema = new mongoose.Schema({
    _id:Number,
    userName:{type:String,required:true},
    password:{type:String,required:true,bcrypt:true},
    email:{ type: String, required: true, unique: true }
})

studentSchema.plugin(bcrypt);
studentSchema.plugin(AutoInc,{
    id:'students counter',
    inc_field:'_id'
})

module.exports=mongoose.model('students',studentSchema);