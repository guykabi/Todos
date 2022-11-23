import React,{useState} from 'react'
import './singleUnCompletedTask.css'
import moment from "moment";
import Button from '../../../UI/Button/Button'
import { useContext } from 'react'
import {useNavigate} from 'react-router-dom'
import { todoContext } from '../../../Context/TodoContext'
import {setItemToLocal, getItemFromLocal} from '../../../utils/storageUtils'
import axios from 'axios'

const SingleUnCompletedTask = (props) => {

  const ctx = useContext(todoContext)//Todo context
  const navigate = useNavigate()
  const [taskDetails,setTaskDetails]=useState(props.taskData)
  const [triggerDots,setTriggerDots]=useState(false)
  const [switchToSelectDate,setSwitchToSelectDate]=useState(true)
  const [isError,setIsError]=useState(false)
  const today = moment().format('YYYY-MM-DD'); //Date of today for the date input


  

    const formatter = new Intl.DateTimeFormat("en-GB", {
        year: "2-digit",
        month: "2-digit",
        day: "2-digit"
      });  
      
     const chooseNewDate = () =>{//Choose new date for the restored task
      setTriggerDots(!triggerDots)
      setSwitchToSelectDate(false)
     }

      const switchBack = () =>{//Return to the task info
        setSwitchToSelectDate(true)
      }  

      const handleRestoreTask = (e) =>{//Set the new date choosen
         const {name,value} = e.target 
         setTaskDetails({...taskDetails,[name]:value})
      } 

      const restoreTask = async() =>{//Sends the restored task to the server
        let obj = {...taskDetails}
        //Adds field that track if the task was already restored
        //Task has only one time to restored!
        obj.SecondChance = true 
        
        try{
            const {data:res} = await axios.post('/tasks/restoretask',obj)
            if(res.restoreTask)
            { 
              //Adds the restored to the tasks context 
               ctx.dispatch({type:'ADDEDTASK',payload:res.restoreTask})
               let fromLocal =  getItemFromLocal('userData') 
               //Updating the local storage by deleting the task by its index
               fromLocal.data.TasksUnCompleted.splice([props.position],1)
               setItemToLocal('userData',fromLocal)
               navigate('/Home/tasks')
            }
        }catch(err)
        {
           setIsError(true)
           let timer = setTimeout(()=>{
            setIsError(false)
           },3000) 

           return () => {//Clears the setTimeout
            clearTimeout(timer);
            };
        }
      }

  return (
    <div className='oneUnTask'>
      {switchToSelectDate?<div className='showtask'>
           {!props.taskData.SecondChance&&<span className='editDotsUn' onClick={()=>{setTriggerDots(!triggerDots)}}></span>}
           {triggerDots&&<div className='restoreDiv'>
             <div onClick={chooseNewDate}>Restore Task</div>
           </div>}
           <h3>{props.taskData.Topic}</h3> 
            <h4>{props.taskData.Task}</h4>
              <div>
                Origin date to complete:  {formatter.format(Date.parse(props.taskData.Upto))} <br />  
              </div>
        </div>:<div className='showtask'>
           <h3>Select new date to finish task</h3> 
           <input type="date" name='Upto' min={today} onChange={handleRestoreTask} /> <br />
           {isError&&<span>Error while sending!</span>}
           <Button click={restoreTask} title='Restore task'/>
           <Button click={switchBack} title='Return'/>
          </div>}
    </div>
  )
}

export default SingleUnCompletedTask