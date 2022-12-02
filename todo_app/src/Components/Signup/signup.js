import React, { useState } from 'react'
import './signup.css'
import {useFormik} from 'formik'
import * as yup from 'yup'
import { useMutation } from 'react-query'
import { signUpUser } from '../../utils/ApiUtils'
import SubmitButton from '../../UI/submitButton/submitButton'
import {useNavigate} from 'react-router-dom'

const Signup = () => {  

 const passwordRules = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{5,}$/; 
 const [isUserAdded,setIsUserAdded]=useState(false)
 const [isError,setIsError]=useState(false)
 const navigate = useNavigate()

 
 const {mutate:addUser,error} = useMutation(signUpUser,{
  onSuccess:(data)=>{
     setIsUserAdded(true)
     setTimeout(()=>{
       setIsUserAdded(false)
       navigate('/')
     },3000)
  },
  onError:()=>{
    setIsError(true)
    setTimeout(()=>{
      setIsError(false)
    },3000)
  }
})

 const {handleSubmit
       ,handleBlur
       ,handleChange
       ,values
       ,touched
       ,errors
      } = useFormik({
 initialValues:{
    Name:"",
    Username:"",
    Password:"",
    Confirmpassword:"",
    Email:""
  },
  validationSchema: yup.object({
    Name: yup.string().max(15,'Must be 15 chars or less').required("Require"),

    Username: yup.string().min(6,'Must be at least 6 chars')
    .max(20,"Must be 12 chars or less").required("Require"),

    Password: yup.string().min(6,'Must be at least 6 chars')
    .matches(passwordRules, { message: "Please create a stronger password" })
    .max(20,"Must be 16 chars or less").required("Require"),

    Confirmpassword: yup.string()
    .oneOf([yup.ref("Password"), null], "Passwords must match")
    .required("Required"),
     Email: yup.string().email('Invalid email').required('Required'),
  }),

  onSubmit:(values)=>{
    addUser(values)
  }
 }) 
  
 if(isUserAdded)
 {
  return(
    <div className='succesSignupMessage'>
      <h1>Congrats, your application made!</h1>
    </div>
  )
 } 


  return (
    <>
    <div className='mainSignupDiv'>
      <form className='form-container' onSubmit={handleSubmit}>
        <div className='input-container'>
          <input 
          name='Name'
           ype="text"
           placeholder='Name'
           value={values.Name}
           onChange={handleChange} 
           onBlur={handleBlur}/>
           {touched.Name&&errors.Name ? <p>{errors.Name}</p> : null}
        </div> 
        <div className='input-container'>
          <input 
          name='Username'
          type="text" 
          placeholder='Username'
          value={values.Username}
          onChange={handleChange}
          onBlur={handleBlur} />
          {touched.Username&&errors.Username ? <p>{errors.Username}</p> : null}
        </div>
        <div className='input-container'>
          <input    
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
          type="password" 
          name='Confirmpassword'
          placeholder='Confirm password' 
          value={values.Confirmpassword}
          onChange={handleChange}
          onBlur={handleBlur}/>
          {touched.Confirmpassword&&errors.Confirmpassword ? <p>{errors.Confirmpassword}</p> : null}
        </div>
        <div className='input-container'>
          <input 
          name='Email'
          type="email" 
          placeholder='Email'
          value={values.Email}
          onChange={handleChange}
          onBlur={handleBlur} />
          {touched.Email&&errors.Email ? <p>{errors.Email}</p> : null}
        </div>
        {isError&& <p style={{color:'red'}}>Unable to create user, try again</p>}
        <SubmitButton type='submit' title='submit'/>
      </form>
      </div>
    </>
  )
}

export default Signup