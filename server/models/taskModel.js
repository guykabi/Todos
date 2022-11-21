const mongoose = require('mongoose')
const {Schema} = mongoose 


const taskSchema = new Schema({
    userId:String,
    Topic:String,
    Task:String,
    Importance:String,
    Upto:String,
    Complete:Boolean,
    OriginCreate:Date,
    SecondChance:Boolean 
},
{timestamps:true}
) 
let taskModel =  mongoose.model('tasks',taskSchema)
module.exports = {taskSchema,taskModel}
