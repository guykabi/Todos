import {useState} from "react";
import axios from 'axios'

const useLogin = ()=>{
    const [error,setError]=useState(null)
    const [isLoading,setIsLoading]=useState(false)
   
    const login = async (credentials)=>{
         setIsLoading(true)
         setError(null)//Zero the error state if there was any before
         try{
          const {data:res} = await axios.post('/users/auth/',credentials)
            //If email or password wrong
            if(res === 'User does not exist' || res === 'Invalid password')
            {
                setIsLoading(false)
                setError(res)
                let timer1 =  setTimeout(()=>{
                  setError(null)
                },3000)  

                return () => { //Clears the setTimeout
                  clearTimeout(timer1);
                };

            }
            if(res.data.Name){
              //Load to local storage 
              localStorage.setItem('userData',JSON.stringify(res))
              setIsLoading(false)
            }

        }catch(err)
        {
          setIsLoading(false)
          setError('Network error')
           let timer = setTimeout(()=>{
            setError(null)
        },3000) 

        return () => { //Clears the setTimeout
          clearTimeout(timer);
        };
        }
    }
    
   
    return {login,isLoading,error}

}
export default useLogin