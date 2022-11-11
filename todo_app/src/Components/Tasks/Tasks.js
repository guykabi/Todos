import React from 'react'
import CreateTask from './createTask/createTask'
import ShowTasks from './showTasks/showTasks'
import './Tasks.css'
const Tasks = () => {
  return (
    <div className='TasksDiv'>
         <div className='mainDivCreateTask'>
           <CreateTask/>
         </div> 
         <div className='showTasks'>
           <ShowTasks/>
        </div>
    </div>
  )
}

export default Tasks