import React,{useContext, useState,useEffect} from 'react'
import { todoContext } from '../../../Context/TodoContext'
import SingleTask from '../singleTask/singleTask'
import './showTasks.css' 
import {customFilter} from '../../../utils/utils';


const ShowTasks = () => {
    const tasksCtx = useContext(todoContext)//User's tasks from the todo context
    let tasks = JSON.parse(localStorage.getItem('userTasks'))
    const [allUserTasks,setAllUserTasks]=useState(null)//All the tasks of the user that render into singleTask components
    const userData = JSON.parse(localStorage.getItem('userData'))
    const [countTasks,setCountTasks]=useState(0)

   useEffect(()=>{
       if(tasksCtx.userTasks != null) 
        {  
          //Updating the tasks on the localStorage with the new tasks
          localStorage.setItem('userTasks',JSON.stringify(tasksCtx.userTasks))
          setAllUserTasks(tasksCtx.userTasks)//Sets the new tasks array
          setCountTasks(tasksCtx.userTasks.length)//Counts the number of tasks
        }
   },[tasksCtx.userTasks])//Trigger when task added/updated/deleted
  

    const sortBy  = (e)=>{ //Sorting the tasks by colors of importance
      if(e.target.value === '')
      {
        setAllUserTasks(tasks)
      }
      else{
      let results = tasks.filter(t => t.Importance === e.target.value)  
      setAllUserTasks(results)
      }
    }  

    const serachTask  = (e)=>{ //Sorting the tasks by colors of importance
      if(e.target.value === '')
      {
        setAllUserTasks(tasks)
      }
      else{ 
        //Function that search any substring in the tasks
        const results = customFilter(tasks, e.target.value)
        setAllUserTasks(results)
      }
    } 

   
  return (
    <>
    <div className='showTaskMainDiv'>
        <h2>{userData.data.Name}'s  tasks   {`(${countTasks})`}</h2>
        <div>
          <input type="text" className='searchInput' placeholder='Search task...' onChange={serachTask}/>
        </div>
        <div className='sortedByDiv'>
          <label htmlFor="Importance" className='lables'>
          <h6>All</h6>
          <input onChange={sortBy} type='radio' value='' name='Importance'/>
          </label>
          <label htmlFor="Importance" className='lables'>
          <h6>Green</h6>
          <input onChange={sortBy} type='radio' value='Green' name='Importance'/>
          </label>
          <label htmlFor="Importance" className='lables'>
          <h6>Yellow</h6>
          <input onChange={sortBy} type='radio' value='Yellow' name='Importance'/>
          </label>
          <label htmlFor="Importance" className='lables'>
          <h6>Red</h6>
          <input onChange={sortBy} type='radio' value='Red' name='Importance'/>
          </label>
        </div>
        <div className='allTasks'>
          {allUserTasks&&allUserTasks.map((task,index)=>{ 
             return <SingleTask  key={index} {...task} />  
          })}
        </div>
    </div>
    </>
  )
}

export default ShowTasks