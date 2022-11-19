const taskModel = require('./models/taskModel')
const userModel = require('./models/userModel')



const handleCompleteness =async (task,fieldName) =>{
 //let newTask = {...task}

 //Adding origin create field to track later if the user will want to restore to task
 task.OriginCreate = task.createdAt 
 
 
  try{
       //Deletes the task first 
       await taskModel.findByIdAndDelete(task._id)
    
       //Than add the task to right field in the user document -r
       // to completed tasks ot to uncompleted tasks
        const taskComplete = await userModel.updateOne({ _id:task.userId}, 
        {$push: {[fieldName]:task}})

        if(taskComplete) return 'Success'
    
  }catch(err)
  {  
    return err
  }
} 

module.exports = {handleCompleteness}