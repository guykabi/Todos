import axios from "axios"

const getAllUserTasks =async (id,token)=>{
    try{
        const {data:res} = await axios.get('/tasks/'+id,{
         headers: {
           'x-access-token': token
           }
        }) 
        if(res)
        {
          return res
        }
     }catch(err)
     {   
        return err.message
   }
}    

const getUserData = async (id) =>{
   try{
        const {data:res} = await axios.get('/users/'+id) 
        if(res.message === 'User data')
        {
         return res.Data
        }
   }catch(err)
   {
        return err.message
   }
}

const addTask =async (body)=>{
   try{
      const {data:res} = await axios.post('/tasks',body)
      if(res.message === 'Added Successfully') 
      {
        return res.Data
      } 
   }catch(err)
   {
      return err.message
   }
}

const updateTask = async (id,body)=>{
    try{
       const {data:res} = await axios.patch('/tasks/'+id,body)
       if(res.message === 'Updated') 
       {
         return res.Data
       } 
       if(res === 'Completed task added and deleted')
       {
         return res 
       }
    }catch(err)
    {
       return err.message
    }
}

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


const taskToDeletete = async (id)=> {
     try{
         const {data:res} =await axios.delete('/tasks/'+id)
         if(res === 'Delete')
         {
            return res
         }
     }catch(err)
     {
         return err.message
     }
} 




const checkPosition = (arr,task) =>{
   console.log(arr)
   for(let i=0; i<arr.length;i++)//Check the for the right position to insert the new task
   { 
      if(i !== (arr.length-1))
       {       
        
        if(arr[i].Upto < task.Upto && task.Upto < arr[i+1].Upto)
        { 
           
         //Finds the after task index
         let index = arr.indexOf(arr[i+1])
         //Insert the new task before the after task
         arr.splice(index,0,task)
         //Sets the context with new arrange array of tasks
         return arr
       }  

     }   
    if(i === (arr.length-1)){ 
        //Insert the new task at the end
         arr.push(task)
        //Sets the context with new arrange array of tasks    
         return arr
     }
   } 
}

export {getAllUserTasks,getUserData,addTask,
   updateTask, customFilter,
   taskToDeletete,checkPosition}