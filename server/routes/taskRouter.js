const taskModel = require('../models/taskModel')
const userModel = require('../models/userModel')
const express = require('express')
const router = express.Router()  
const jwt = require('jsonwebtoken')
require('dotenv').config() 

router.get('/:id',async(req,resp,next)=>{
   
    //Checks if there is access token to verifies the user
    const token = req?.headers?.['x-access-token']
    if (!token) {
          return next(new Error('No Token Provided'))
      }
     //Compares the token provided with the saved token in the env file
     jwt.verify(token, process.env.ACCESS_SECRET_TOKEN,async (err, data)  => {
       if (err) {
          return next(new Error('Failed to authenticate token'))
        }

       else{
          try{  
                //Gets all the specific user tasks
                const tasks = await taskModel.find({userId:req.params.id}).sort({Upto:1})
                resp.status(200).json(tasks)
          }catch(err)
            {
               next(err)
            }
        }
     })

  })  


router.post('/',async(req,resp,next)=>{ //Adding a new user
    const task = new taskModel(req.body)
    try{
           const data = await task.save()
           resp.status(200).json({message:'Added Successfully',Data:data})
    }catch(err)
    {
       next(err)
    }
})  


router.patch('/:id',async(req,resp,next)=>{//Updates task
  //If task completed - add it to the completed tasks of the user
  //and finally deletes it from the tasks
  if(req.body.Complete === true)
  {
    try{   
          const deleteTask = await taskModel.findByIdAndDelete(req.params.id)
          if(deleteTask)//If the delete succeeded
          { 
             const taskComplete = await userModel.updateOne({ _id: req.body.userId}, 
              {$push: {TasksCompleted:req.body}})
            console.log(taskComplete)
             if(taskComplete) return resp.status(200).json('Completed task added and deleted') 
          } 
    }catch(err)
    {
       next(err)
    }
  }
  else{

     try{
        let data = await taskModel.findByIdAndUpdate(req.params.id,req.body,{new:true})
        if(data) return resp.status(200).json({message:'Updated',Data:data})
        if(!data) return resp.status(404).json("Such user don't found")
     }catch(err)
       {
        next(err)
       }

   }
})  


router.delete('/:id',async(req,resp,next)=>{
  
  try{  //Delets task by its id
       let data = await taskModel.findByIdAndDelete(req.params.id)
       return resp.status(200).json('Delete') 
  }catch(err)
  {
    next(err)
  }
}) 



module.exports = router