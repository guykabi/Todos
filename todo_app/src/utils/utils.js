import moment from "moment"


//Search for any substring or text in all of the tasks fields
function customFilter(objList, text){
   if(undefined === text || text === '' ) return objList;
   return objList.filter(product => {
       let flag;
       for(let prop in product){
           flag = false;
           flag = product[prop].toString().toLowerCase().indexOf(text.toLowerCase()) > -1;
           if(flag)
           break;
       }
   return flag;
   });
}; 


const insertNewTaskToPosition = (arr,task) =>{
   
   for(let i=0; i<arr.length;i++){

      //If its not the last element
      if(i !== (arr.length-1))
       {       

         //If its the first element
         if(i === 0 && arr[i].Upto > task.Upto )
         { 
            //Push to the beginning
            arr.unshift(task)
            return arr
         } 
         
         //If the new task complete date equal to the current task in the loop
         //And less than the next one
         if(arr[i].Upto === task.Upto && task.Upto < arr[i+1].Upto)
         {
            arr.splice(i+1,0,task)
            return arr
         }
        
         //If the new task complete date is less than the current
         // task and bigger than the next one
        if(arr[i].Upto < task.Upto && task.Upto < arr[i+1].Upto)
        { 
           
         //Insert the new task before the after task
         arr.splice(i+1,0,task)
         //Sets the context with new arrange array of tasks
         return arr
       }  

     }   
     //If its the last element of the array
    if(i === (arr.length-1)){ 
        //Insert the new task at the end
         arr.push(task)
        //Sets the context with new arrange array of tasks    
         return arr
     }
   } 
} 
 
//Calculates the time between the creation and the complete of the task
const timePassed = (start,end) =>{
   //Subtracts the dates
   let diff = Date.parse(end) - Date.parse(start)
   let time;

   if(( diff /  3600000  ) < 1)//If the time is less than a hour
   {
       time =  ( diff /  3600000 )
   }
   if(( diff /  3600000  ) > 1)//Greater than a hour
   {
      time = Math.floor(diff / 3600000)
   }
   
   if(time > 24)
   {     

       let days = Math.floor(time/24)
       return `${days} days`
   }
   if(1 < time && time < 24)
   {    
      return `${time} hours`
   }
   
   if(time < 1)
   {      
      
       let minuts = Math.floor(time*60)
      return `${minuts} minutes`
   }
   
} 

const timeRemainTask = (date) =>{
  let today = new Date();
  let tomorrow = new Date(); 

  //Sets the time from tomorrow becuase to the user
  //has the whole day, until midnight to complete the task
  tomorrow.setDate(today.getDate()-1);
  return  moment(date, "YYYYMMDD").from(tomorrow);
} 


//Function to 
const addDays = (today,days) =>{
   let date = new Date(today);
   date.setDate(date.getDate() + days);
   return date
} 

const handleTimeLimit = (importance,today) =>{
      
   if(importance === 'Green')
   {
       //Sends the current date and the value 30 -  to limit the calendar
       let addingDays = addDays(today,30)
     
     //Limits the calendar max field to 30 days from now
     return moment(addingDays).format("YYYY-MM-DD")
   }
   
   //When task is yellow - up to 14 days to complete it
   if(importance === 'Yellow')
   {
     //Sends the current date and the value 14 -  to limit the calendar
     let addingDays = addDays(today,14)
     
     //Limits the calendar max field to 14 days from now
     return moment(addingDays).format("YYYY-MM-DD")
   } 
   
   //When task is yellow - up to 14 days to complete it
   if(importance === 'Red')
   {
     //Sends the current date and the value 7 -  to limit the calendar
     let addingDays = addDays(today,7)

     //Limits the calendar max field to 7 days from now
     return moment(addingDays).format("YYYY-MM-DD")
   } 

}


const taskCompletePrecent = (timeCompleted,importance) =>{
   
   switch(importance)
   {
      case 'Green':
         let greenPrecentage = (100 * timeCompleted) / 30
         return greenPrecentage

      case 'Yellow':
         let yellowPrecentage = (100 * timeCompleted) / 14
         return yellowPrecentage 

      case 'Red':
         let redPrecentage = (100 * timeCompleted) / 7
         return redPrecentage 

         default : 
         return null
   }
     
} 

const overAllAvgPrecentage = (tasks) =>{

   let graphData = []
   let greenAvg = [], yellowAvg = [], redAvg = [] 

   if(!tasks) return []

   tasks.forEach(task=>{
     
     //Calculates the time that the task was completed
     let timeResult = timePassed(task.OriginCreate,task.createdAt)
      
     //Extracts only the digits from the timeResult
     let numbersOfDays =  timeResult.replace(/[a-z]/g,'') 
     
     //Converting minutes and hours values to suitable ratio vs day (24 hours)
     if(timeResult.includes('hours')) numbersOfDays = numbersOfDays / 24 
     if(timeResult.includes('minutes')) numbersOfDays = numbersOfDays / (24*60)

     //Calculates the precenatage of the completion time from the alocated time to the task
     let precentageFromAlocate = taskCompletePrecent(numbersOfDays,task.Importance)
      

     if(task.Importance === 'Green') greenAvg.push(precentageFromAlocate)
     if(task.Importance === 'Yellow') yellowAvg.push(precentageFromAlocate)
     if(task.Importance === 'Red') redAvg.push(precentageFromAlocate)

   })    

     let colors = ["Green","Yellow","Red"] 

     colors.map(color =>{ 
       let obj = {}
       //Calculates the overall precentage of all the tasks according to its color     
       if(color === 'Green') obj.avgCompletionPrecentage = Math.floor(greenAvg.reduce((a, b) => a + b, 0) / greenAvg.length)
       if(color === 'Yellow') obj.avgCompletionPrecentage =Math.floor(yellowAvg.reduce((a, b) => a + b, 0) / yellowAvg.length)
       if(color === 'Red') obj.avgCompletionPrecentage = Math.floor(redAvg.reduce((a, b) => a + b, 0) / redAvg.length)

        obj.Importance = color
        obj.fill = color 

        graphData.push(obj)
    })
        return graphData
}


export {customFilter,insertNewTaskToPosition,
        timePassed,timeRemainTask,
        addDays,handleTimeLimit,
        taskCompletePrecent,overAllAvgPrecentage}