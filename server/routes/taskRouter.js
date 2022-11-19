const taskModel = require('../models/taskModel')
const userModel = require('../models/userModel')
const {handleCompleteness} = require('../utils')
const express = require('express')
const router = express.Router()  
const jwt = require('jsonwebtoken')
require('dotenv').config()  

//Creates the current day foramt to compare which task is still valid
const today = new Date();
const yyyy = today.getFullYear();
let mm = today.getMonth() + 1; // Months start at 0!
let dd = today.getDate();

if (dd < 10) dd = '0' + dd;
if (mm < 10) mm = '0' + mm;

const formattedToday = yyyy + '-' + mm + '-' + dd;
 


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
                
                //All tasks that are still valid
                let validTasks = tasks.filter(t=> t.Upto >= formattedToday)

                //All tasks that are not valid and yet to be complete
                let invalidTasks = tasks.filter(t=> t.Upto < formattedToday)

                if(invalidTasks.length > 0)//If there are any invalid tasks
                {          
                    
                    for await (const task of invalidTasks) {
                     //Rearrange the task before update before inserted to the DB
                      let newTask = task._doc
                      newTask._id = task._id.toString()
                      try{
                        //Sends the invalid task in its turn to handling function
                         await handleCompleteness(newTask,'TasksUnCompleted')
                      }catch(err)
                      {
                         next(err)
                      }                   
                    }
                 }

               return resp.status(200).json(validTasks)
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
           return resp.status(200).json({message:'Added Successfully',Data:data})
    }catch(err)
    {
       next(err)
    }
})  


router.patch('/:id',async(req,resp,next)=>{//Updates task
  //If task completed - deletes it from the tasks 
  //and finally add it to the completed tasks of the user
  if(req.body.Complete === true)
  {
    try{   
          //Sends the completed task to handling function
          let res = await handleCompleteness(req.body,'TasksCompleted')
          if(res === 'Success') return resp.status(200).json('Completed task added and deleted')
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
       await taskModel.findByIdAndDelete(req.params.id)
       return resp.status(200).json('Delete') 
  }catch(err)
  {
    next(err)
  }
}) 



module.exports = router