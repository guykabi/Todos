const mongoose = require('mongoose')
const {Schema} = mongoose 
const {hash} = require('bcryptjs')
const bcrypt = require('bcryptjs/dist/bcrypt')


const taskSchema =  new Schema({
    userId:String,
    Topic:String,
    Task:String,
    Importance:String,
    Upto:String,
    Complete:Boolean
},{timestamps:true})

let userSchema = new Schema({
    Name:String,
    Username:String,
    Password:String,
    Email:String,
    TasksCompleted:[taskSchema],
    TasksUnCompleted:[taskSchema]
},
{timestamps:true}
) 


//Crypt the new user password
userSchema.pre('save',async function (){
    if(this.isModified('Password')){
        this.Password = await bcrypt.hash(this.Password,12)
    }
})

module.exports = mongoose.model('users',userSchema)