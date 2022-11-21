import React,{useEffect,useState} from 'react'
import './unCompletedTasks.css'
import { getUserData } from '../../../utils/ApiUtils'
import SingleUnCompletedTask from '../singleUnCompletedTask/singleUnCompletedTask'
const UnCompletedTasks = () => {

    const userData = JSON.parse(localStorage.getItem('userData'))
    const [userDetails,setUserDetails]=useState(null)
    const [isError,setIsError]=useState(false) 

  useEffect(()=>{
    const dataOfUser =async () => {
        try{
           let resp = await getUserData(userData.data._id) 
           if(resp._id)
           {
                setUserDetails(resp)
           }
        }catch(err)
        {
          setIsError(true)
        }
    }
    dataOfUser()
   },[])   

   if(isError)//If cant fetch data from the server from any reason
       {
         return(
              <h2>Error loading data</h2>
            )
        }


  return (
    <>
    <div className='unCompletedTasksMainDiv'>
      <h2>UnCompletedTasks</h2> <br />
      {userDetails&&userDetails.TasksUnCompleted.map((u,index)=>{
           return <SingleUnCompletedTask key={index} position={index} taskData={u}/>
         })}
    </div>

    </>
  )
}

export default UnCompletedTasks