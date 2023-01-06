import "./Login.css";
import React, { useState, useEffect,useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useMutation } from "react-query";
import useLogin from "../../hooks/useLogin";
import ClipLoader from "react-spinners/ClipLoader";
import SubmitButton from "../../UI/submitButton/submitButton";
import { emailCheck } from "../../utils/ApiUtils";
import {getItemFromLocal,setItemToLocal,clearLocal} from '../../utils/storageUtils'

const Login = () => {
  const [credentials, setCredentials] = useState({}); //Email and password that sends to the server for checking
  const { login, isLoading, error } = useLogin(); //Custome hook for checking user existence
  const [triggerEmailWindowToReset,setTriggerEmailWindowToReset]=useState(false)
  const [emailForReset,setEmailForReset]=useState(null)
  const [placeHolderText,setPlaceHolderText]=useState('Insert your email')
  const inputRef = useRef()
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
             //Error is already taken care in the login hook
             console.log('Error handled')
       }
   
  }  

  const {mutate:checkEmail} = useMutation(emailCheck,{
    onSuccess:async (data)=>{
      if(data === 'Email does not exist')
      {
        inputRef.current.value = ''
        setPlaceHolderText(data)
        setTimeout(()=>{
          setPlaceHolderText('Insert your email')
        },3000)
        return
      }  
       //Sets the encrypted code the user get via email
       setItemToLocal('emailCode',data) 
       navigate('reset')
    },
    onError: (error)=>{
       inputRef.current.value = ''
       setPlaceHolderText('Something went wrong...')
       setTimeout(()=>{
        setPlaceHolderText('Insert your email')
      },3000)
    },
  })

  const sendCodeToEmail = (e) =>
  { 
    e.preventDefault()
    let obj ={...emailForReset}
    obj.Email = emailForReset.Email
    obj.isSendEmail = true
    checkEmail(obj)
  } 

  
  return (
    <div className="mainLoginDiv">
      <div className="formDiv">
        <h2 className="loginTitle">Todos Login</h2> <br/>
        <form onSubmit={handleLoginSubmit}>
          <input
            id="slider-email" 
            class="slide-in-email"
            type="email"
            name="Email"
            placeholder="Email"
            required
            onChange={(e) =>
            setCredentials({
            ...credentials,[e.target.name]: e.target.value,})
            }
          />
          <br /> <br />
          <input
            id="slider-password" 
            class="slide-in-password"
            type="password"
            name="Password"
            placeholder="Password"
            required
            onChange={(e) =>
            setCredentials({
            ...credentials,[e.target.name]: e.target.value,})
            }
          /><br />
          {isLoading && (
            <>
             <ClipLoader color={"gray"} speedMultiplier="1" size={30} />
             <br/>
            </>
          )} 
          {error && <div>{error}</div>}
          <SubmitButton disable={isLoading} title='Login' type="submit"/>
          <br />
        </form> <br/>
        <span className="linkToReset" 
         onClick={()=>setTriggerEmailWindowToReset(!triggerEmailWindowToReset)}
         >Forgot password?
         </span>&nbsp;&nbsp;

         <span className="linkTo"><Link to={'signup'}>Create account</Link></span>
          <br/>
        {triggerEmailWindowToReset&&<div>
          <br/>
            <form onSubmit={sendCodeToEmail}>
              <input 
              className="slide-in-email"
              required
              ref={inputRef}
              type='email' 
              name="Email"
              placeholder={placeHolderText}
              onChange={(e)=>setEmailForReset({...emailForReset,[e.target.name]:e.target.value})}/>
              <button type="submit" className="toResetBtn">Send code</button>   
            </form> 
            <br/> <br/>    
          </div>}
      </div>
    </div>
  );
};

export default Login;
