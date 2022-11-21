import './Login.css'
import React,{ useState,useEffect } from 'react'
import { useNavigate } from 'react-router'
import useLogin from '../../hooks/useLogin'
import ClipLoader from 'react-spinners/ClipLoader';


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

   const handleLoginSubmit =async (e)=>{
   e.preventDefault() 

   //Use the login hook for checking user validity
   await login(credentials) 

   //If localStorage was set on that filed name - 
   //means success in login proccess and moving to the home page
   if(localStorage.getItem('userData'))
   {
    navigate('/Home')//Moves to the main page
   }

  }
  return (
    <div className='mainLoginDiv'>
     <div className="formDiv">
     <h2>Login</h2>
        <form onSubmit={handleLoginSubmit}>
         <input type="email"
            name='Email'
            placeholder='Email'
            required
            onChange={(e)=>setCredentials({...credentials,[e.target.name]:e.target.value})} />
            <br /> <br />
         <input type="password"
            name='Password'
            placeholder='Password'
            required
            onChange={(e)=>setCredentials({...credentials,[e.target.name]:e.target.value})} /> 
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