import React from 'react'
import './tasksTracking.css'
import {Outlet} from 'react-router-dom'


const TasksTracking = () => { 
 
  return (
    <div className='taskTrackingMainDiv'>
         <Outlet/>
    </div>
  )
}

export default TasksTracking