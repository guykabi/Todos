import axios from "axios"
import emailjs from '@emailjs/browser'

const signUpUser =async (user) =>{
   const {data:res} = await axios.post('/users',user)
   return res.Data
} 


const checkUserCredentials = async (credentials) =>{
   try{
      const {data:res} = await axios.post('/users/auth',credentials)
      return res
   }catch(err)
   {
      return err.message
   }
}
  

const emailCheck =async (email) =>{
   const {data:res} = await axios.post('/users/email-check',email)
   return res
} 

const updatePassword = async (details) => {
   
   const {data:res} = await axios.patch('/users/'+details.id,details.body)
   return res
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
         const {data:res} =await axios.delete('/tasks/'+id)    
            return res    
}  

const restoreTask =async (obj) =>{
   const {data:res} = await axios.post('/tasks/restoretask',obj) 
    return res 
} 



export {signUpUser,emailCheck,checkUserCredentials,updatePassword,
       getAllUserTasks,getUserData,addTask,
       updateTask,taskToDelete,restoreTask}