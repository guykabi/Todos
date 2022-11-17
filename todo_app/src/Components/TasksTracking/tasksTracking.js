import React,{useState,useEffect} from 'react'
import './tasksTracking.css'
import {getUserData} from '../../utils/utils'
import SingleCompleteTask from './singleCompleteTask/singleCompleteTask'


const TasksTracking = () => { 

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

   
 
  if(isError)
  {
    return(
        <h2>Error loading data</h2>
    )
  }

  return (
    <>
    <div className='taskTrackingMainDiv'>
         <h2>{userData.data.Name}'s past tasks</h2> <br /> 
         {userDetails&&userDetails.TasksCompleted.map((u,index)=>{
           return <SingleCompleteTask key={index} props={u}/>
         })} <br />
         
    </div>
    </>
  )
}

export default TasksTracking