import React,{useState,useEffect} from 'react'
import './tasksTracking.css'
import {getUserData} from '../../utils/utils'


const TasksTracking = () => { 

    const userData = JSON.parse(localStorage.getItem('userData'))
    const [userDetails,setUserDetails]=useState(null)
    const [isError,setIsError]=useState(false) 

   const formatter = new Intl.DateTimeFormat("en-GB", {
      year: "2-digit",
      month: "2-digit",
      day: "2-digit"
    });
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
    <div className='taskTrackingMainDiv'>
         <h2>{userData.data.Name}'s past tasks</h2> <br /> 
         {userDetails&&userDetails.TasksCompleted.map((u,index)=>{
           return <div className='oneTask' key={index}>
            <h3>{u.Topic}</h3>
            <div>
              Completed on the  {formatter.format(Date.parse(u.createdAt))}
            </div>
            </div>
         })} <br />
         
    </div>
  )
}

export default TasksTracking