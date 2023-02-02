import React, { useState } from 'react'
import {useFormik} from 'formik'
import * as yup from 'yup'
import { getItemFromLocal } from '../../utils/storageUtils'
import { updatePassword } from '../../utils/ApiUtils'
import {compare} from 'bcryptjs'
import Button from '../../UI/Button/Button'
import { useNavigate } from 'react-router-dom'
import './reset.css'
import { useMutation } from 'react-query'
import ClipLoader from "react-spinners/ClipLoader";


const Reset = () => {

 const passwordRules = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{5,}$/;

 //Encrypted code from email to comparison 
 const detailsFromEmail = getItemFromLocal('emailCode')
 const [isMatch,setIsMatch]=useState(false) 
 const [isUpdated,setIsUpdated]=useState(false)
 const [isError,setIsError]=useState(false)
 const [errorText,setErrorText]=useState(null)
 const navigate = useNavigate()

 
 const {handleChange,handleBlur,handleSubmit,values, touched,errors} = useFormik({
  initialValues: {
    Password: "",
    Confirmpassword:""
  },
  validationSchema: yup.object({

     Password: yup.string().min(6,'Must be at least 6 chars')
     .matches(passwordRules, { message: "Please create a stronger password" })
     .max(20,"Must be 16 chars or less").required("Require"),
     Confirmpassword: yup.string()
     .oneOf([yup.ref("Password"), null], "Passwords must match")
     .required("Required")
  }),
  onSubmit:(values)=>{
    let obj = {} 
    obj.id = detailsFromEmail.userId
    obj.body = values
    resetPassword(obj)
  }
 }) 


 const checkEqualToCode = async (e)=>{
  if(!detailsFromEmail) return
  //Compare the encrypted code with that the user type
  const equal = await compare(e.target.value,detailsFromEmail.code)  
  setIsMatch(equal)
} 

//Sends the new password that chosen to the server
const {mutate:resetPassword,isLoading} = useMutation(updatePassword,{
  onSuccess: (data)=>{
    if(data === 'Password already exists')
    {
       setIsError(true)
       setErrorText(data)
       setTimeout(()=>{
        setIsError(false)
       },3000)
     }
     else{
     setIsUpdated(true)
     setTimeout(()=>{
       setIsUpdated(false)
       navigate('/')
     },3000)
   }
  },
  onError: ()=>{
    setIsError(true)
    setErrorText("Unable to reset password, try again")
    setTimeout(()=>{
      setIsError(false)
      navigate('/')
    },3000)
  }
}) 


if(isUpdated)
{
  return(
    <div className='mainResetDiv'>
      <h2>Your password has changed!</h2>
    </div>
  )
}

  return (
    <div className='mainResetDiv'>
      <h2>Reset</h2>
      <div> 
       <form className='form-container' onSubmit={handleSubmit}>
        <div className='input-container'>
           <input 
           type="text" 
           disabled={isMatch}
           placeholder='Reset code'
           onChange={checkEqualToCode}/>
        </div> <br/>
        <div className='input-container'>
          <input    
          disabled={!isMatch}
          type="password" 
          name='Password'
          placeholder='Password' 
          value={values.Password}
          onChange={handleChange}
          onBlur={handleBlur}/>
          {touched.Password&&errors.Password ? <p>{errors.Password}</p> : null}
        </div>

        <div className='input-container'>
          <input 
          disabled={!isMatch} 
          type="password" 
          name='Confirmpassword'
          placeholder='Confirm password' 
          value={values.Confirmpassword}
          onChange={handleChange}
          onBlur={handleBlur}/>
          {touched.Confirmpassword&&errors.Confirmpassword 
          ?<p>{errors.Confirmpassword}</p> 
          : null}
        </div>

        {isLoading&&<ClipLoader color={"gray"} speedMultiplier="1" size={20}/>}
        {isError&&<span><strong>{errorText}</strong></span>} <br/>

        <Button title='return' click={()=>navigate('/')} />
        <Button title='Reset' type='submit'/>
        <br/> 
        
       </form>
      </div>
    </div>
  )
}

export default Reset