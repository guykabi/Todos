import React,{useState,useEffect} from 'react'
import './tasksTracking.css'
import {Outlet,useNavigate} from 'react-router-dom'


const TasksTracking = () => { 
 
  return (
    <>
    <div className='taskTrackingMainDiv'>
         <Outlet/>
    </div>
    </>
  )
}

export default TasksTracking