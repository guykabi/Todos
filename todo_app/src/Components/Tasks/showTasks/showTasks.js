import React,{useContext, useState,useEffect} from 'react'
import { todoContext } from '../../../Context/TodoContext'
import SingleTask from '../singleTask/singleTask'
import './showTasks.css' 
import { useRef } from 'react'
import {customFilter} from '../../../utils/utils';


const ShowTasks = () => {
    const tasksCtx = useContext(todoContext)//User's tasks from the todo context
    let tasks = JSON.parse(localStorage.getItem('userTasks'))
    const [allUserTasks,setAllUserTasks]=useState(null)//All the tasks of the user that render into singleTask components
    const scrollRef = useRef()
    const userData = JSON.parse(localStorage.getItem('userData'))

   useEffect(()=>{
       if(tasksCtx.userTasks != null) 
        {  
          //Updating the tasks on the localStorage with the new tasks
          localStorage.setItem('userTasks',JSON.stringify(tasksCtx.userTasks))
          setAllUserTasks(tasksCtx.userTasks)//Sets the new tasks array
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
        console.log(tasks);
        // let results = tasks.filter(t => Object.values(t).includes(e.target.value)) 
        const results = customFilter(tasks, e.target.value)
        setAllUserTasks(results)
      }
    } 

   
  return (
    <div className='showTaskMainDiv'>
        <h2>{userData.data.Name}'s  tasks</h2>
        <div>
          <input type="text" placeholder='Search task...' onChange={serachTask}/>
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
        <div className='allTasks' ref={scrollRef}>
          {allUserTasks&&allUserTasks.map((task,index)=>{
            return <SingleTask key={index} {...task} />
          })}
        </div>
    </div>
  )
}

export default ShowTasks