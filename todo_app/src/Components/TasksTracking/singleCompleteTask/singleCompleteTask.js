import React, { useEffect, useState } from 'react'
import './singleCompleteTask.css'
import { timePassed } from '../../../utils/utils'

const SingleCompleteTask = (props) => {
   
   const [timeTaskPassed,setTimeTaskPassed]=useState(null)

    const formatter = new Intl.DateTimeFormat("en-GB", {
        year: "2-digit",
        month: "2-digit",
        day: "2-digit"
      }); 
      

      useEffect(()=>{
        if(props.taskData.OriginCreate)
        {   
          //Sends the start and end dates to calc function
          let timeresult = timePassed(props.taskData.OriginCreate,props.taskData.createdAt)
          setTimeTaskPassed(timeresult)
        }
      },[])

  return (
    <div className='oneTask'>
            <h3>{props.taskData.Topic}</h3> 
            <h4>{props.taskData.Task}</h4>
              <div>
                Completed on the  {formatter.format(Date.parse(props.taskData.createdAt))} <br />
                Completed in: {timeTaskPassed&&timeTaskPassed}
              </div>
            </div>
  )
}

export default SingleCompleteTask