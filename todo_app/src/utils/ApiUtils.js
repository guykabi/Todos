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

export {getAllUserTasks,getUserData,addTask,updateTask,taskToDelete}