import axios from "axios"


const checkUserCredentials = async (credentials) =>{
   try{
      const {data:res} = await axios.post('/users/auth/',credentials)
      return res
   }catch(err)
   {
      return err.message
   }
}

const getAllUserTasks =async (id,token)=>{

        const {data:res} = await axios.get('/tasks/'+id,{
         headers: {
           'x-access-token': token
           }
        }) 
        return res
}    

const getUserData = async (id) =>{
   
    const {data:res} = await axios.get('/users/'+id)    
         return res.Data
}

const addTask =async (body)=>{

      const {data:res} = await axios.post('/tasks',body)  
        return res.Data
}

const updateTask = async (task)=>{
   
       const {data:res} = await axios.patch('/tasks/'+task._id,task)
       if(res.message === 'Updated') 
       { 
         return res.Data
       } 
       if(res === 'Completed task added and deleted')
       {
         return res 
       }
    
}

const taskToDelete = async (id)=> {
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

const restoreTask =async (obj) =>{
   const {data:res} = await axios.post('/tasks/restoretask',obj) 
   console.log(res)
    return res 
}

export {checkUserCredentials,getAllUserTasks,
        getUserData,addTask,
        updateTask,taskToDelete,restoreTask}