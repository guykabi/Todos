import React, { useEffect, useState } from "react";
import './completedTasks.css'
import { getUserData } from "../../../utils/ApiUtils";
import SingleCompleteTask from "../singleCompleteTask/singleCompleteTask";
import Button from "../../../UI/Button/Button";
import { getItemFromLocal } from "../../../utils/storageUtils";
import TasksGraph from "../tasksGraph/tasksGraph";
import { useQuery } from "react-query";
import ClipLoader from "react-spinners/ClipLoader";
import { useNavigate } from "react-router-dom";

const CompletedTasks = () => {
  const userData = getItemFromLocal("userData")
  const [userDetails, setUserDetails] = useState(null);
  const [isAllOrGraph, setIsAllOrGraph] = useState(true);
  const [numOfTasks,setNumOfTasks]=useState(4)
  const navigate = useNavigate()
  let showMoreAppearenceRule = null

   if(userDetails)
   {
    showMoreAppearenceRule = (userDetails.TasksCompleted.length > 4  &&  userDetails.TasksCompleted.length > numOfTasks)
   }
 

  const {isError,isLoading} =useQuery('userCompleted',
    ()=>getUserData(userData.data._id),{

        onSuccess:(data)=>{
          setUserDetails(data)
         }
       })


  const toAllCompletedTasks = () => {
    setIsAllOrGraph(true);
  };


  const toGraph = () => {
    setIsAllOrGraph(false);
  }; 



  if(isLoading)
   {
    return(
      <div className="loadingMessageCompleted">
        <br/><br/>
        <h2>Looking for your completed tasks...</h2> <br/>
        <ClipLoader color={"gray"} speedMultiplier="1" size={30} />
      </div>
    )
   }

   if(isError)
       {
         return(
              <div>
               <h2>Error loading data</h2> <br/>
               <Button title='return home' click={()=>navigate('/Home/tasks')}/>
               <Button title='return to login' click={()=>navigate('/')}/>
              </div>
            )
        } 

        if(userDetails&&userDetails.TasksCompleted.length === 0)
        {
          return(
            <div className="zeroCompletedMessage">
              <h2> You dont have any completed task!</h2>
            </div>
          )
        } 

  return (
    <>
      <div className="completedTasksMainDiv">
        <h2>{userData.data.Name}'s past tasks</h2> <br />
        <div>
          <Button title="All my tasks" click={toAllCompletedTasks} />
          &nbsp;
          <Button title="Graph" click={toGraph} />
        </div>&nbsp;
        <br />
        {isAllOrGraph ? (
          <div>
            {userDetails &&
             userDetails.TasksCompleted.slice(0,numOfTasks).map((u, index) => {
                return <SingleCompleteTask key={index} taskData={u} />;
              })}
            <br />
            {numOfTasks>4&&
            <button className="addTasksToShow" onClick={()=>setNumOfTasks(numOfTasks-4)}>Show less</button>}
            {showMoreAppearenceRule&&showMoreAppearenceRule&&
            <button className="addTasksToShow"  onClick={()=>setNumOfTasks(numOfTasks+4)}>Show more</button>
            }
          </div>
        ) : (
          <div>
            <TasksGraph taskData={userDetails.TasksCompleted}/>
          </div>
        )}
      </div>
    </>
  );
};

export default CompletedTasks;
