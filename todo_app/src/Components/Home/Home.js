import "./Home.css";
import Navbar from "../../UI/Navbar/Navbar";
import { Outlet, useNavigate } from "react-router-dom";
import React, { useEffect, useContext, useState } from "react";
import { todoContext } from "../../Context/TodoContext";
import { getAllUserTasks } from "../../utils/ApiUtils";
import {setItemToLocal,getItemFromLocal} from '../../utils/storageUtils'

const Home = () => {
  const userData = getItemFromLocal("userData")
  const [isTokenValid, setIsTokenValid] = useState(false);
  const { dispatch } = useContext(todoContext);
  const navigate = useNavigate();

  useEffect(() => {
    const getUserTasks = async () => {
      //Check if there is token passed through the localStorgae
      if (!userData) return;

      try {
        let res = await getAllUserTasks(
          userData.data._id,
          userData.accessToken
        );
        if (!res) return;

        setItemToLocal("userTasks",res)  //Sets the user's tasks to the local stroage
        dispatch({ type: "GETDATA", payload: res }); //Set the user tasks to the todo context
        navigate("tasks");
      } catch (err) {
        setIsTokenValid(true); //Trigger the error that the token is'nt valid
      }
    };

    getUserTasks();
  }, []);

  if (isTokenValid || !userData) {
    //When token was not provided of right
    return (
      <div className="tokenErrorMessage">
        <h2>Error - cannot load page</h2> <br /> <br />
        <button onClick={() => navigate("/")}>Return</button>
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
