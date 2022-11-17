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
        if(props.props.OriginCreate)
        {   
          //Sends the start and end dates to calc function
          let timeresult = timePassed(props.props.OriginCreate,props.props.createdAt)
          setTimeTaskPassed(timeresult)
        }
      },[])

  return (
    <div className='oneTask'>
            <h3>{props.props.Topic}</h3> 
            <h4>{props.props.Task}</h4>
              <div>
                Completed on the  {formatter.format(Date.parse(props.props.createdAt))} <br />
                Task completed in: {timeTaskPassed&&timeTaskPassed}
              </div>
            </div>
  )
}

export default SingleCompleteTask