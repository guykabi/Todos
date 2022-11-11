import './Login.css'
import React,{ useState } from 'react'
import { useNavigate } from 'react-router'
import useLogin from '../../hooks/useLogin'
import ClipLoader from 'react-spinners/ClipLoader';
import { useEffect } from 'react';

const Login = () => {
  const [credentials,setCredentials]= useState({})//Email and password that sends to the server for checking
  const navigate = useNavigate() 
  const {login,isLoading,error} = useLogin() //Custome hook for checking user existence

  useEffect(()=>{
    if(localStorage.getItem('userData'))//Checks if there is any user data on the localStorage
    {
      //Clear the user data when user coming back to the login page - backup to the logout from Home page
      localStorage.clear()
    }
  },[]) 

  const handleUserDetails = (e)=>{
    const {name,value} = e.target
    setCredentials({...credentials,[name]:value})
  }

   const checkUser =async (e)=>{
   e.preventDefault() 
   await login(credentials) //Checks if the user exists 
   if(localStorage.getItem('userData'))//Sign for success of the authentication
   {
    navigate('/Home')//Moves to the main page
   }

  }
  return (
    <div className='mainLoginDiv'>
     <div className="formDiv">
     <h2>Login</h2>
        <form onSubmit={checkUser}>
         <input type="email"
            name='Email'
            placeholder='Email'
            required
            onChange={handleUserDetails} />
            <br /> <br />
         <input type="password"
            name='Password'
            placeholder='Password'
            required
            onChange={handleUserDetails} /> 
            <br /> <br />  
              {isLoading&&<ClipLoader
               color={'gray'}
               speedMultiplier='1'
               size={30}/>}
              {error && <div>{error}</div>}
               <br /> 
         <button disabled={isLoading} type='submit'>Login</button> <br />
        </form>
     </div>
    </div>
  )
}

export default Login