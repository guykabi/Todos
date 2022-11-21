const {taskModel} = require('./models/taskModel')
const userModel = require('./models/userModel')



const handleCompleteness =async (task,fieldName) =>{
 

 //Adding origin create field to track later if the user will want to restore to task
 task.OriginCreate = task.createdAt 
 
  try{

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

const currentDayFormat = () =>{

const today = new Date();
const yyyy = today.getFullYear();
let mm = today.getMonth() + 1; // Months start at 0!
let dd = today.getDate();

if (dd < 10) dd = '0' + dd;
if (mm < 10) mm = '0' + mm;

let formattedToday = yyyy + '-' + mm + '-' + dd;
return formattedToday
}

module.exports = {handleCompleteness,currentDayFormat}