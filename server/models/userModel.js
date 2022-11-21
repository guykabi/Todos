const mongoose = require('mongoose')
const {Schema} = mongoose 
const bcrypt = require('bcryptjs/dist/bcrypt')
const {taskSchema} = require('./taskModel')

//Unique schema for completed and uncompleted tasks only


const userSchema = new Schema({
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