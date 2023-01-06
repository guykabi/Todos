import React,{useState,useContext,useRef, useEffect,memo} from 'react'
import './singleUnCompletedTask.css'
import moment from "moment";
import Button from '../../../UI/Button/Button'
import {useNavigate} from 'react-router-dom'
import { todoContext } from '../../../Context/TodoContext'
import {setItemToLocal, getItemFromLocal} from '../../../utils/storageUtils'
import { restoreTask } from '../../../utils/ApiUtils';
import { handleTimeLimit } from '../../../utils/utils';
import { useMutation } from 'react-query';

const SingleUnCompletedTask = (props) => {

  const ctx = useContext(todoContext)//Todo context
  const navigate = useNavigate()
  const [taskDetails,setTaskDetails]=useState(null)
  const [triggerDots,setTriggerDots]=useState(false)
  const [switchToSelectDate,setSwitchToSelectDate]=useState(true)
  const [isError,setIsError]=useState(false)
  const [maxDaysLimit,setMaxDaysLimit]=useState(null)
  const today = moment().format('YYYY-MM-DD'); //Date of today for the date input
  const dateInputRef = useRef()

    
    //Date format
    const formatter = new Intl.DateTimeFormat("en-GB", {
        year: "2-digit",
        month: "2-digit",
        day: "2-digit"
      });     

      
      //Limits the calendar range according to the color task used to have
      useEffect(()=>{ 
        
        let dateLimit =  handleTimeLimit(props.taskData.Importance,today)
     
        //Updates the max key on the date input
        setMaxDaysLimit(dateLimit)
      },[])

      const {mutate:restore} = useMutation(restoreTask,{
        onSuccess: (data)=>{ 
           //Adds the restored to the tasks context 
           ctx.dispatch({type:'ADDEDTASK',payload:data.restoreTask})

           let fromLocal =  getItemFromLocal('userData') 
           //Updating the local storage by deleting the task by its index
           fromLocal.data.TasksUnCompleted.splice([props.position],1)

           setItemToLocal('userData',fromLocal)
           navigate('/Home/tasks')
        }, 

        onError: (error)=>{
          setIsError(true)
          let timer = setTimeout(()=>{
           setIsError(false)
          },3000) 

           return () => {//Clears the setTimeout
           clearTimeout(timer);
          }
        }
     })
      
      //Switch screen to restore task
     const chooseNewDate = () =>{
      setTriggerDots(!triggerDots)
      setSwitchToSelectDate(false)
     }

      const switchBack = () =>{//Return to the task info
        setTaskDetails(null)
        setSwitchToSelectDate(true)
      }  

      const handleRestoreTask = (e) =>{//Set the new data for the restored task
         const {name,value} = e.target 
         if(name !== 'Importance') setTaskDetails({...taskDetails,[name]:value}) 
          
         if(name === 'Importance')
         {
           //Returns the max value the calendar will enable 
           //choosing dates - base on importance level
           let dateLimit =  handleTimeLimit(value,today)
     
           //Updates the max key on the date input
           setMaxDaysLimit(dateLimit)
         
           //Changes the value of the date input to the current date
           dateInputRef.current.value = today
     
           setTaskDetails({ ...taskDetails, Upto: today , [name]:value });
         }
      } 

      const restoringTask = (e) =>{//Sends the restored task to the server
        e.preventDefault()
        let obj = {...taskDetails}
        //Adds field that track if the task was already restored
        //Task has only one time to restored!
        obj.SecondChance = true 
        
        //Trigger the mutation 
        restore(obj)   
      } 

  return (
    <>
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
          <form onSubmit={restoringTask}>
           <h4>Select a new date and Importance level</h4> 
           <input 
            required
            className='greenRadioBtn' 
            type="radio" 
            value="Green" 
            name='Importance'
            onChange={handleRestoreTask} />

           <input 
            className='yellowRadioBtn'
            type="radio"
            value="Yellow" 
            name='Importance'
            onChange={handleRestoreTask}  /> 

           <input
            className='redRadioBtn'
            type="radio"
            value="Red"
            name='Importance'
            onChange={handleRestoreTask}  /> &nbsp;

           <input type="date"
            className='unCompletedDateInput'
            required
            name='Upto'
            ref={dateInputRef}
            min={today}
            max={maxDaysLimit}
            onChange={handleRestoreTask} /> <br />

           {isError&&<span>Error while sending!</span>} <br/>
           
           <Button type='submit' title='Restore task'/>
           <Button click={switchBack} title='Return'/>
           </form>
          </div>}
    </div>
    </>
  )
}

export default  memo(SingleUnCompletedTask)