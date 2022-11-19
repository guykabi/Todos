import React,{useState} from 'react'
import './singleUnCompletedTask.css'

const SingleUnCompletedTask = (props) => {

  const [triggerDots,setTriggerDots]=useState()

    const formatter = new Intl.DateTimeFormat("en-GB", {
        year: "2-digit",
        month: "2-digit",
        day: "2-digit"
      }); 

  return (
    <div className='oneUnTask'>
      <span className='editDotsUn' onClick={()=>{setTriggerDots(!triggerDots)}}></span>
      {triggerDots&&<div className='restoreDiv'>
        <div>Restore Task</div>
      </div>}
         <h3>{props.taskData.Topic}</h3> 
            <h4>{props.taskData.Task}</h4>
              <div>
                Origin date to complete:  {formatter.format(Date.parse(props.taskData.createdAt))} <br />  
              </div>
    </div>
  )
}

export default SingleUnCompletedTask