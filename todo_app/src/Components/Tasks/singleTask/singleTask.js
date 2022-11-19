import './singleTask.css'
 import React, { useState,useContext,useEffect } from 'react'
 import { taskToDeletete } from '../../../utils/utils'
 import { todoContext } from '../../../Context/TodoContext'
 import Modal from '../../../UI/Modal/Modal'
import moment from "moment"
 
 
 const SingleTask = (props) => {
  const [triggerDots,setTriggerDots]=useState(false)
  const [triggerSureToDelete,setTriggerSureToDelete]=useState(false)
  const [isThreeDots,setIsThreeDots]=useState(true)
  const [isError,setIsError]=useState(true)
  const ctx = useContext(todoContext)
  const timeLeft =moment(props.Upto, "YYYYMMDD").fromNow(); //Calculate the remain time for the task
  

  useEffect(()=>{
    if(ctx.taskToEdit != null)
    {
      if(ctx.taskToEdit._id === props._id)
       {
        setIsThreeDots(false)
      }
      else{
        setIsThreeDots(true)
      }
    }
    if(ctx.taskToEdit == null)
    {
        setIsThreeDots(true)
    }
  },[ctx.taskToEdit])

  const toEdit = ()=>{ 
     setTriggerDots(false)
     ctx.dispatch({type:'TASKTOEDIT',payload:props})//Sets the details of the choosen task to the context
  }
 
  const switchOff = () =>{
    setTriggerDots(false)
    setTriggerSureToDelete(false)
  } 

  const deleteTask = async()=>{
    try{
       let resp = await taskToDeletete(props._id)
       if(resp === 'Delete')
       {
        ctx.dispatch({type:'TASKTODELETE',payload:props._id})
        switchOff()
       }
       else{
          setIsError(false)
          let timer = setTimeout(()=>{
            setIsError(true)
          },3000)

          return () => {//Clears the setTimeout
            clearTimeout(timer);
          }
      }
    }catch(err)
    {
      setIsError(false)
      let timer = setTimeout(()=>{
        setIsError(true)
      },3000)

      return () => {//Clears the setTimeout
        clearTimeout(timer);
      }
    }
  }

   return (
     <div className='mainSingleTask'   style={{backgroundColor:`${props.Importance.toLowerCase()}`,cursor:'pointer'}}>
      {isThreeDots&&<span className='editDots' onClick={()=>{setTriggerDots(!triggerDots)}}></span>}
      {triggerDots&&<div className='editOrDeleteDiv'>
        <div onClick={toEdit}>Edit</div>
        <div onClick={()=>setTriggerSureToDelete(true)}>Delete</div>
      </div>}
        <h3>{props.Topic}</h3>
        <div>
            <div>{props.Task}</div> 
            Importance: <span>{props.Importance}</span> <br />
            {!props.Complete&&<span>To complete {timeLeft}</span>} <br /> 
            <span>Complete: {props.Complete.toString()}</span>
        </div> 
           {triggerSureToDelete&&<Modal onClose={switchOff}>
              {isError?<div>
                <h3>Are you sure to delete?</h3> <br/> 
                <button onClick={switchOff}>No</button>
                &nbsp;&nbsp;
                <button onClick={deleteTask}>Yes</button>

              </div>:<div>
                 <h3>There was an error to delete the task!</h3> <br/>
                </div>}
           </Modal>}
     </div>
   )
 }
 
 export default SingleTask
 