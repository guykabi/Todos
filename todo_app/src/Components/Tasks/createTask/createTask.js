
import './createTask.css'
import moment from "moment";
import Modal from '../../../UI/Modal/Modal';
import React,{ useContext,useState,useEffect } from 'react';
import { todoContext } from '../../../Context/TodoContext';
import { addTask } from '../../../utils/utils';
import UpdateTask from '../updateTask/updateTask';


const CreateTask = () => {

 const [taskDetails,setTaskDetails]=useState({})//State that set the new task details 
 const ctx = useContext(todoContext)//TodoContext
 const userData = JSON.parse(localStorage.getItem('userData'))//LocalStorage
 const [isNewTask,setIsNewTask]=useState(false)//State that controls over the newTask form
 const [isError,setIsError]=useState(false)//State of the error message if form was unabled to submit
 const [showFinal,setShowFinal]=useState(false)//State that manage the popup-sum message
 const [isToEdit,setIsToEdit]=useState(false)//State that manage the appearance of the task to edit
 const today = moment().format('YYYY-MM-DD'); //Date of today for the date input


 useEffect(()=>{
  if(ctx.taskToEdit != null)//Load the requested task to edit
  {
    setIsToEdit(true)
  }
 },[ctx.taskToEdit])

 
const handleTask = (e)=> //Sets the task fields
{
  const {name,value} = e.target
  setTaskDetails({...taskDetails,[name]:value})
} 

const sendTask = (e)=>{//Trigger the modal with 'Confirm task' message and the task sum
  e.preventDefault()
  setShowFinal(true)
}

const switchOff =()=>{//Shut down the sum up and confirm pop-up message
  setShowFinal(false)
}

const switchToNewTask = ()=>{ //Open the new task form
  setIsNewTask(true)
}   

const confirmNewTask =async()=>{//Sets the new task to the user tasks on the DB
   
  //Adding extra necessary fields
  let obj = taskDetails
  obj.userId=userData.data._id
  obj.Complete=false

  try{
    const res = await addTask(obj) //Add the new task to the DB
        if(res._id)
        {
         //Update the new data to the context with the new task that just been added
          ctx.dispatch({type:'ADDEDTASK',payload:res})
          setShowFinal(false)//Remove the popup message
          setIsNewTask(false)//Switch the screen to the start task screen
        }
        else{
          setIsError(true)
          let timer = setTimeout(()=>{
           setIsError(false)
          },3000)
     
          return () => {//Clears the setTimeout
           clearTimeout(timer);
         };
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



const setNewTask = ()=>{
  setIsToEdit(false)
}

 if(isToEdit === true)
 { 
   return(<UpdateTask onClose={setNewTask} />)//The requested task form to edit
 } 

 const options = [null,'Education','Free time', 'Work', 'Household management'] 
 const selectField = options.map((o,index)=>{//Rendering options tags to the select input
    return  (<option key={index} value={o}>{o}</option>)  
  }) 

  return (
      <div className='mainDiv'>
        <br /><br />
        {!isNewTask&&<div>
                    <h3>Ok, lets beggin...</h3> <br />
                    <span onClick={switchToNewTask} className='plusSign' aria-labelledby="love" role="img">➕</span>
                    </div>}
        {isNewTask&&
        <div className='taskForm'>
          <h2>what do you up next?</h2>
          <br /> <br />
          <form onSubmit={sendTask}>
              <label className='selectTopicLabel' htmlFor="Topic">Select the topic:</label>
              <select required onChange={handleTask} id='Topic' name="Topic">
               {selectField}
              </select> <br /> <br />
              <textarea name="Task" 
               onChange={handleTask}
               style={{resize:"none",width:'70%'}} 
               className='textArea'
               cols="35" rows="4"
               placeholder='What is the task?'
               required
               /> <br /> <br />
              <span className='importanceLevel'>Choose importance level:</span>
              <span className='greenRadio'>gg</span>
              <span className='greenColorData'>
              <strong>Green</strong> means - task that is great to complete <br />
              and there is no pressure to finish!
              </span>
              <input onChange={handleTask} type='radio' value="Green" name="Importance" required /> &nbsp;&nbsp;
              <span className='yellowRadio'>gg</span>
              <span className='yellowColorData'>
              <strong>Yellow</strong> means - task that need to be completed <br />
               in the near future!
              </span>
              <input onChange={handleTask} type='radio' value="Yellow"  name="Importance"/>&nbsp;&nbsp;
              <span className='redRadio'>gg</span>
              <span className='redColorData'>
              <strong>Red</strong> means - task that is must be completed <br />
              as soon as possible!
              </span>
              <input onChange={handleTask} type='radio' value="Red"  name="Importance"/> <br /> <br />
              <label className='dateLable' htmlFor="date">Choose date to complete:</label> 
              <input type="date" onChange={handleTask} name="Upto"  id='date'  required/> <br /> <br />
              <button onClick={()=>{setIsNewTask(false)}}>Return</button>&nbsp;<button type='submit'>Send</button>
          </form>
        </div>} 
        {showFinal&&
        <Modal onClose={switchOff}>
                  <h2>Task details</h2> 
                  <div className='detailsDiv'>
                     <h3>{taskDetails.Topic}</h3>
                     <div>{taskDetails.Task}</div> <br />
                     <div className='dateimportance'>
                         <div>Level - <span style={{borderRadius:'8px',padding:'2px',backgroundColor:taskDetails.Importance.toLowerCase(),color:'black'}}>
                                      {taskDetails.Importance}
                                      </span>
                         </div> &nbsp;&nbsp;
                       <div>Up to - {taskDetails.Upto?taskDetails.Upto:today}</div> <br />
                       {isError&&<span><strong>Unable to add task</strong></span>} <br/><br/>
                       <button onClick={switchOff}>cancel</button>&nbsp;<button onClick={confirmNewTask}>Confirm</button>
                     </div>
                  </div>
          </Modal>}
        </div> 
  )
}

export default CreateTask