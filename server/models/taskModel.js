const mongoose = require('mongoose')
const {Schema} = mongoose 


let taskSchema = new Schema({
    userId:String,
    Topic:String,
    Task:String,
    Importance:String,
    Upto:String,
    Complete:Boolean
},
{timestamps:true}
) 


module.exports = mongoose.model('tasks',taskSchema)