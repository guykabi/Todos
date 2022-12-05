import "./Home.css";
import Navbar from "../../UI/Navbar/Navbar";
import { Outlet, useNavigate } from "react-router-dom";
import React, { useContext, useState } from "react";
import { todoContext } from "../../Context/TodoContext";
import { getAllUserTasks } from "../../utils/ApiUtils";
import {setItemToLocal,getItemFromLocal} from '../../utils/storageUtils'
import Button from "../../UI/Button/Button";
import {useQuery} from 'react-query'
import ClipLoader from "react-spinners/ClipLoader";


const Home = () => {
  const userData = getItemFromLocal("userData")
  const [isTokenValid, setIsTokenValid] = useState(false);
  const { dispatch } = useContext(todoContext);
  const navigate = useNavigate(); 


  const onSuccess = (data) =>{
    setItemToLocal("userTasks",data) 

    //Set the user tasks to the todo context
    dispatch({ type: "GETDATA", payload: data}); 
    
    navigate("tasks");       
  } 

  const onError = () =>{
     setIsTokenValid(true)
  }
  
  const {isLoading,data} = useQuery(
      'tasksUser',()=>getAllUserTasks(userData.data._id,userData.accessToken),
      {onSuccess,onError}) 

  const backToLogin = () =>{
        navigate('/')
      } 

  if (isTokenValid || !userData) {
    //When token was not provided
    return (
      <div className="tokenErrorMessage">
        <h2>Error - cannot load page</h2> <br /> <br />
        <Button click={backToLogin} title='Return' />
      </div>
    );
  } 

  if(isLoading)
  {
    return (
      <div className="tokenErrorMessage">
        <h2>Loading Home page...</h2> <br/>
        <ClipLoader color={"gray"} speedMultiplier="1" size={30} />
      </div>
    );
  } 

  return (
    <div className="mainHomeDiv">
      <div className="topNav">
        <h2>Start manage your tasks</h2>
      </div>
      <Navbar />
      <Outlet />
    </div>
  );
};

export default Home;
