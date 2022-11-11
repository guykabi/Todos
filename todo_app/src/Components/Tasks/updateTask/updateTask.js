import React,{useState,useContext,useEffect} from 'react'
import './updateTask.css'
import { todoContext } from '../../../Context/TodoContext';
import {updateTask } from '../../../utils/utils';


const UpdateTask = (props) => {

const ctx = useContext(todoContext)//TodoContext
const [isErrorUpdate,setIsErrorUpdate]=useState(false)//State of the error message if form was unabled to update
const [currentDetails,setCurrentDetails]=useState(null)//State that save the details of the task to edit - uses for fill the form fields with initial values!
const [updateDetails,setUpdateDetails]=useState(null)//The updated fiedls to update - only it!
const [enableBtn,setEnableBtn]=useState(false)//Control the submit button activeness

useEffect(()=>{
    if(ctx.taskToEdit != null)//Load the requested task to edit
    {
      setCurrentDetails(ctx.taskToEdit)
      setEnableBtn(false) 
      setUpdateDetails(null)
     
    }
   },[ctx.taskToEdit])
  

//Checking if any detail changed - if indeed changed 
//update the new updateDetails state which sends only the fields that has changed to the server
const isTheSame = (e)=>{
    const {name,value}=e.target
    setCurrentDetails({...currentDetails,[name]:value})//Update only the current data that present to the user
    if(ctx.taskToEdit[name] === value || !updateDetails )
    {
       setEnableBtn(false)//Unable the submit button
       if(updateDetails)
       {
         const newUpdateDetails = {...updateDetails}
         delete newUpdateDetails[name] //Deleting the field that return the same value as already exists
         setUpdateDetails(newUpdateDetails)
       }
    }
    if(ctx.taskToEdit[name] !== value){
     setUpdateDetails({...updateDetails,[name]:value}) 
     setEnableBtn(true)
    }
    
 } 
 
 const sendUpdate = async(e)=>{
   e.preventDefault() 
   try{

         let resp = await updateTask(ctx.taskToEdit._id,updateDetails)
       
        if(resp._id)
         {
          ctx.dispatch({type:'UPDATETASK',payload:resp})//Update the new data to the context with the new task that just been added
          props.onClose()//Switch to the start window
         }
       else
       {
           setIsErrorUpdate(true)//Error message

           let timer = setTimeout(()=>{
           setIsErrorUpdate(false)
          },3000)
 
          return () => {//Clears the setTimeout
           clearTimeout(timer);
           };
       }
       
   }catch(err)
   {
       setIsErrorUpdate(true)

       let timer = setTimeout(()=>{
        setIsErrorUpdate(false)
       },3000)

       return () => {//Clears the setTimeout
        clearTimeout(timer);
      };
   }
 }  
 
 
const options = ['Education','Free time', 'Work', 'Household management'] 
const selectField = options.map((o,index)=>{//Rendering options tags to the select input
    return  (<option key={index} value={o}>{o}</option>)  
  }) 


  return (
     <div className='taskToEdit'><br/>
     {currentDetails&&<form onSubmit={sendUpdate} className='editForm'>
        <label htmlFor="Topic">Topic: </label>
              <select required value={currentDetails.Topic} onChange={isTheSame} id='Topic' name="Topic">
                {selectField}
              </select> <br /><br />
        <label htmlFor="Task">Task: </label>
        <input type="text" required id='Task' onChange={isTheSame} name='Task' value={currentDetails.Task}   checked={true} /><br /><br />
        
        <span className='importanceLevel'>Choose importance level:</span>
              <span className='greenRadio'>gg</span>
              <span className='greenColorData'>
              <strong>Green</strong> means - task that is great to complete <br />
              and there is no pressure to finish!
              </span>
              <input  onChange={isTheSame} type='radio' value="Green"  checked={currentDetails.Importance === 'Green'} name="Importance" required /> &nbsp;&nbsp;
              <span className='yellowRadio'>gg</span>
              <span className='yellowColorData'>
              <strong>Yellow</strong> means - task that need to be completed <br />
               in the near future!
              </span>
              <input onChange={isTheSame} type='radio' value="Yellow"  name="Importance" checked={currentDetails.Importance === 'Yellow'}/>&nbsp;&nbsp;
              <span className='redRadio'>gg</span>
              <span className='redColorData'>
              <strong>Red</strong> means - task that is must be completed <br />
              as soon as possible!
              </span>
              <input onChange={isTheSame} type='radio' value="Red" checked={currentDetails.Importance === 'Red'}  name="Importance" /> <br /> <br />

        <label htmlFor="Upto">Up to: </label>
        <input type="date" required id='Upto' name='Upto' value={currentDetails.Upto} onChange={isTheSame}   /><br /> <br />

        <label>Complete: </label>
        <span>No</span>&nbsp;
        <input type="radio" required name='Complete' value={false}  onChange={isTheSame} checked={!JSON.parse(currentDetails.Complete)}   />
        <span>Yes</span>&nbsp;
        <input type="radio"  name='Complete' value={true} onChange={isTheSame} checked={JSON.parse(currentDetails.Complete)}  />
        <br /> <br />
        {isErrorUpdate&&<span><strong>Unable to update task</strong></span>}<br/><br/>
        <button type='submit' disabled={!enableBtn}>Update</button>&nbsp;
      <  button onClick={()=>props.onClose()}>New task</button>
      </form>}

    </div>
  )
}

export default UpdateTask