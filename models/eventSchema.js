const mongoose = require('mongoose');
const bcrypt = require('mongoose-bcrypt');

const eventSchema = new mongoose.Schema({
    
    _id:{type:Number,required:true},
    title:{type:String,required:true},
    date:{type:Date,required:true},
    mainSpeaker:{type:mongoose.Types.ObjectId,ref:'speakers',required:true},
    Speakers:[{type:mongoose.Types.ObjectId,ref:'speakers',required:true}],
    Students:[{type:Number,ref:'students',required:true}],
})

eventSchema.plugin(bcrypt);
module.exports=mongoose.model('events',eventSchema);