import "./Login.css";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useLogin from "../../hooks/useLogin";
import ClipLoader from "react-spinners/ClipLoader";
import Button from "../../UI/Button/Button";
import {getItemFromLocal,clearLocal} from '../../utils/storageUtils'

const Login = () => {
  const [credentials, setCredentials] = useState({}); //Email and password that sends to the server for checking
  const { login, isLoading, error } = useLogin(); //Custome hook for checking user existence
  const navigate = useNavigate();

  useEffect(() => {

    //Checks if there is any user data on the localStorage
    if (!getItemFromLocal("userData")) return
      
      //Clear the user data when user coming back to the login page - backup to the logout from Home page
      clearLocal()
    
  }, []);

  

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
 
    try{
       //Use the login hook for checking user validity
        await login(credentials);

      //If localStorage was set on that field name -
      //means success in login proccess and moving to the home page
         if (!getItemFromLocal("userData")) return

              navigate("/Home")
            
     }catch(err)
       {     
             //Error taking care in the login hook
             console.log('Error handled')
       }
   
  };
  return (
    <div className="mainLoginDiv">
      <div className="formDiv">
        <h2>Login</h2>
        <form onSubmit={handleLoginSubmit}>
          <input
            type="email"
            name="Email"
            placeholder="Email"
            required
            onChange={(e) =>
              setCredentials({
                ...credentials,
                [e.target.name]: e.target.value,
              })
            }
          />
          <br /> <br />
          <input
            type="password"
            name="Password"
            placeholder="Password"
            required
            onChange={(e) =>
              setCredentials({
                ...credentials,
                [e.target.name]: e.target.value,
              })
            }
          />
          <br /> <br />
          {isLoading && (
            <ClipLoader color={"gray"} speedMultiplier="1" size={30} />
          )}
          {error && <div>{error}</div>}
          <br />
          <Button disable={isLoading} title='Login' type="submit"/>
          <br />
        </form>
      </div>
    </div>
  );
};

export default Login;
