import {useState} from "react";
import {setItemToLocal} from '../utils/storageUtils'
import { checkUserCredentials } from "../utils/ApiUtils";

const useLogin = ()=>{
    const [error,setError]=useState(null)
    const [isLoading,setIsLoading]=useState(false)
   
    const login = async (credentials)=>{

         setIsLoading(true)
         setError(null)//Zero the error state if there was any before
         try{
          const res = await checkUserCredentials(credentials)
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
              
              //Load user details + token to local storage 
              setItemToLocal('userData',res)

              //Turn off the loading wheel
              setIsLoading(false)
            }

        }catch(err)
        {
          //Turn on the error message
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