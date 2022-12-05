import React,{useState} from 'react'
import './unCompletedTasks.css'
import { getUserData } from '../../../utils/ApiUtils'
import SingleUnCompletedTask from '../singleUnCompletedTask/singleUnCompletedTask'
import { getItemFromLocal } from '../../../utils/storageUtils'
import {useQuery} from 'react-query'
import { useNavigate } from 'react-router-dom'
import Button from '../../../UI/Button/Button'
import ClipLoader from "react-spinners/ClipLoader";



const UnCompletedTasks = () => {

    const userData = getItemFromLocal("userData")
    const [userDetails,setUserDetails]=useState(null)
    const navigate = useNavigate()
   
   const {isError,isLoading} =useQuery('userUncompleted',()=>getUserData(userData.data._id),
   {
    onSuccess:(data)=>{
      setUserDetails(data)
    }
   })

   if(isLoading)
   {
    return(
      <div className='loadingMessageUnCompleted'> 
        <h2>Looking for your unCompleted tasks...</h2> <br/>
        <ClipLoader color={"gray"} speedMultiplier="1" size={30} />
      </div>
    )
   }

   if(isError)//If cant fetch data from the server from any reason
       {
         return(
              <div>
               <h2>Error loading data</h2> <br/>
               <Button title='return home' click={()=>navigate('/Home/tasks')}/>
               <Button title='return to login' click={()=>navigate('/')}/>
              </div>
            )
        } 

        if(userDetails&&userDetails.TasksUnCompleted.length === 0)
        {
          return(
            <div className="zeroUnCompletedMessage">
              <h2> You dont have any unCompleted task!</h2>
            </div>
          )
        }

  return (
    <>
    <div className='unCompletedTasksMainDiv'>
      <h2>{userDetails&&userDetails.Name}'s UnCompleted Tasks</h2> <br />
      {userDetails&&userDetails.TasksUnCompleted.map((u,index)=>{
           return <SingleUnCompletedTask key={index}  position={index} taskData={u}/>
         })}
    </div>
    </>
  )
}

export default UnCompletedTasks