//require('dotenv').config()
const userModel = require('../models/userModel')
const express = require('express')
const router = express.Router() 
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

router.get('/:id',async(req,resp,next)=>{
    try{
       let data = await userModel.findOne({_id:req.params.id})
       if(data) return resp.status(200).json({message:'User data',Data:data})
    }catch(err)
    {
        next(err)
    }
}) 



router.post('/auth',async(req,resp,next)=>{ //Check is user exists - if does return the user data and token
    const {Email,Password} = req.body
      try{
           let data = await userModel.findOne({Email})
           if(!data) 
             {
              return resp.status(200).json('User does not exist') 
             }
           //Compares the password that the client typed with the encryped one on the DB
           const isMatch = await bcrypt.compare(Password,data.Password) 
           if(!isMatch)
                {
                 return resp.status(200).json('Invalid password')
                } 
           const accessToken = jwt.sign(
               {id:data._id} ,
               process.env.ACCESS_SECRET_TOKEN
               ) 
            resp.status(200).json({accessToken,data})

    } catch(err)
       {
          next(new Error('Error', err))
       }
 })

router.post('/',async(req,resp,next)=>{ //Adding a new user
    const user = new userModel(req.body)
    try{
           const data = await user.save()
           return resp.status(200).json({message:'Added Successfully',Data:data})
    }catch(err)
    {
           next(new Error('Error', err))
    }
}) 

router.put('/:id',async(req,resp,next)=>{//Update all details except the password
    try{
        let data = await userModel.findByIdAndUpdate(req.params.id,req.body,{new:true})
        if(data) return resp.status(200).json({message:'Updated',Data:data})
  }catch(err){
    next(new Error('Error', err))
  }
})

router.patch('/:id',async(req,resp,next)=>{//Changing only the password
       //Crypt the changed password
       const salt = await bcrypt.genSalt(10)
       const passwordHash = await bcrypt.hash(req.body.Password,salt)
      //Update only the password
      try{  
              let data = await userModel.updateOne( { _id:req.params.id} , { $set: { Password:passwordHash } })
              if(data) return resp.status(200).json('Updated')
     }catch(err)
     {
           next(new Error('Error', err))
     }
})

module.exports = router