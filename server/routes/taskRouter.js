//require('dotenv').config()  
const {taskModel} = require('../models/taskModel')
const userModel = require('../models/userModel')
const {handleCompleteness} = require('../utils')
const express = require('express')
const router = express.Router()  
const jwt = require('jsonwebtoken')
const {currentDayFormat} = require('../utils')

//Get the current date of the day with format of yyyy-mm-dd
const today = currentDayFormat()



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
                let validTasks = tasks.filter(t=> t.Upto >= today )
               
                //All tasks that are not valid and yet to be complete
                let invalidTasks = tasks.filter(t=> t.Upto < today)
                
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



router.post('/restoretask',async(req,resp,next)=>{ //Adding a new user
   const {body} = req
   if(body.OriginCreate)//Extra measure of checking if this indeed restored task
   {

      try{ 
            let deleteUnCompletedTask = await userModel.updateOne(
               {_id:body.userId},
               {$pull : {TasksUnCompleted : {_id:body._id}}},{new:true}
            ) 
            if(!deleteUnCompletedTask) return next(new Error('Unable to delete'))
            
            const task = new taskModel(req.body)
            try{
               const data = await task.save()
               return resp.status(200).json({message:'Added Successfully',restoreTask:data,dataOfUser:deleteUnCompletedTask})
            }catch(err)
            {
               next(err)
            }
     }catch(err)
     {
      next(err)
     }
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