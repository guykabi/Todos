import React,{useState,useEffect} from 'react'
import {getUserData} from '../../../utils/ApiUtils'
import SingleCompleteTask from '../singleCompleteTask/singleCompleteTask'
import Button from '../../../UI/Button/Button'

const CompletedTasks = () => {

    const userData = JSON.parse(localStorage.getItem('userData'))
    const [userDetails,setUserDetails]=useState(null)
    const [isError,setIsError]=useState(false) 
    const [isAllOrGraph,setIsAllOrGraph]=useState(true)

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


       const toAllCompletedTasks = ()=>{
        setIsAllOrGraph(true)
      } 

      const toGraph = ()=>{
        setIsAllOrGraph(false)
      } 


       if(isError)//If cant fetch data from the server from any reason
       {
         return(
              <h2>Error loading data</h2>
            )
        }

  return (
    <>
    <div className='completedTasksMainDiv'>
         <h2>{userData.data.Name}'s past tasks</h2> <br /> 
         <div>
          <Button title='All' click={toAllCompletedTasks}/>
          &nbsp; 
          <Button title='Graph' click={toGraph} />
        </div> <br/>
        {isAllOrGraph?<div>
         {userDetails&&userDetails.TasksCompleted.map((u,index)=>{
           return <SingleCompleteTask key={index} taskData={u}/>
         })} <br />
         </div>:<div>
          <h2>Graph</h2>
          </div>}
    </div>
    </>
  )
}

export default CompletedTasks