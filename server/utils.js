const taskModel = require('./models/taskModel')
const userModel = require('./models/userModel')



const handleCompleteness =async (task,fieldName) =>{
  
  try{
    //Deletes the task first 
    const deleteTask = await taskModel.findByIdAndDelete(task._id)
    if(deleteTask)//If the delete succeeded
    { 
       //Than add the task to right field in the user document -
       // to completed tasks ot to uncompleted tasks
        const taskComplete = await userModel.updateOne({ _id:task.userId}, 
        {$push: {[fieldName]:task}})

        if(taskComplete) return 'Success'
    } 
  }catch(err)
  {  
    return err
  }
} 

module.exports = {handleCompleteness}