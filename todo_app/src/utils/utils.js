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
      return `${minuts} minuts`
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


export {customFilter,insertNewTaskToPosition,timePassed,timeRemainTask}