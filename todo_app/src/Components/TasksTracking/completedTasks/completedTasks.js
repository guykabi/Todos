import React, { useState, useEffect } from "react";
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
  const navigate = useNavigate()

  

  const {isError,isLoading} =useQuery('userCompleted',()=>getUserData(userData.data._id),{
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

  return (
    <>
      <div className="completedTasksMainDiv">
        <h2>{userData.data.Name}'s past tasks</h2> <br />
        <div>
          <Button title="All" click={toAllCompletedTasks} />
          &nbsp;
          <Button title="Graph" click={toGraph} />
        </div>{" "}
        <br />
        {isAllOrGraph ? (
          <div>
            {userDetails &&
              userDetails.TasksCompleted.map((u, index) => {
                return <SingleCompleteTask key={index} taskData={u} />;
              })}{" "}
            <br />
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
