import React, { useState, useContext, useEffect } from "react";
import "./updateTask.css";
import moment from "moment";
import { todoContext } from "../../../Context/TodoContext";
import { updateTask } from "../../../utils/ApiUtils";
import { handleTimeLimit } from "../../../utils/utils";
import { useMutation } from "react-query";
import Button from "../../../UI/Button/Button";

const UpdateTask = (props) => {
  const ctx = useContext(todoContext); //TodoContext
  const [isErrorUpdate, setIsErrorUpdate] = useState(false); //State of the error message if form was unabled to update
  const [currentDetails, setCurrentDetails] = useState(null); //State that save the details of the task to edit - uses for fill the form fields with initial values!
  const [updateDetails, setUpdateDetails] = useState(null); //The updated fiedls to update - only it!
  const [enableBtn, setEnableBtn] = useState(false); //Control the submit button activeness
  const [whenCompleteMark, setWhenCompleteMark] = useState(false);
  const [maxDaysLimit,setMaxDaysLimit]=useState(null)
  const [triggerTitleText,setTriggerTitleText]=useState(false)
  const today = moment().format("YYYY-MM-DD"); //Date of today for the date input


  useEffect(() => {
    if (ctx.taskToEdit != null) {

      //Load the requested task to edit
      setCurrentDetails(ctx.taskToEdit);
      setEnableBtn(false);
      //Zeroing the state if there was any data from previous task edited
      setUpdateDetails(null);
    }
  }, [ctx.taskToEdit]); 



  useEffect(()=>{
    if(!currentDetails) return
      
      //Function that return the max date which the calendar
      // will enable choosing dates - based on task's importance level
      let dateLimit = handleTimeLimit(currentDetails.Importance,today)

      //Sets the max date to enable on the date input
      setMaxDaysLimit(dateLimit)

      //Sets back the original date of the task
      setCurrentDetails({ ...currentDetails,Upto:ctx.taskToEdit.Upto});
      
      
      if(!updateDetails) return
      //Checks if there was any change made in the task edit form
      //if not, unable the submit button
      if(Object.keys(updateDetails).length === 1 && !Object.keys(updateDetails).includes('Importance') ) 
      {
        setUpdateDetails({ ...updateDetails,Upto:ctx.taskToEdit.Upto});
        
        setEnableBtn(false)
      }

  },[currentDetails&&currentDetails.Importance])



  //Checking if any detail changed - if indeed changed
  //updates the new updateDetails state which sends only
  //the fields that has changed to the server
  const handleTaskChange = (e) => {
    
    const { name, value } = e.target;
    
    //Change the form headline if there was any change
    if(triggerTitleText === false) setTriggerTitleText(true)

    //Update only the current data that present to the user within the fields
    setCurrentDetails({ ...currentDetails, [name]: value });

    if (ctx.taskToEdit[name].toString() === value) {

      if (updateDetails) {

        const newUpdateDetails = { ...updateDetails }

        //Deleting the field that return the same value as already exists
        delete newUpdateDetails[name]
        setUpdateDetails(newUpdateDetails);

        //When there is nothing changed again -
        //Unable the submit button
        if (Object.keys(updateDetails).length === 1) {
          setTriggerTitleText(false)
          return setEnableBtn(false) //Unable the submit button
        }

        if (value === "false") {
          setUpdateDetails(null) //Clears the updateDetails state when switch back to false
          setCurrentDetails(ctx.taskToEdit) //Showing back the origin task's details
          setWhenCompleteMark(false) //Switch on the disabled mode on each field
          setTriggerTitleText(false)
          return setEnableBtn(false)
        }
      }
    }

    //If the user choose/change to a value that does not exsits yet
    if (ctx.taskToEdit[name] !== value && !value.endsWith(" ")) {
      if (value === "true") {

         //Prepare the new object to send to the server
         let obj = { ...currentDetails };
         obj.Complete = true;

         //Task date of creation field
         obj.OriginCreate = currentDetails.createdAt;

         setUpdateDetails(obj);
         setWhenCompleteMark(true); //Unable all the form fields
         setEnableBtn(true); //enable the submit button

      } else {
         setUpdateDetails({ ...updateDetails, [name]: value });
         setEnableBtn(true);
      }
    }
  }; 



  const {mutate:update} = useMutation(updateTask,{
    onSuccess: (data)=>{
      if (data._id)
      {
          //If task was updated but not completed,
          //updates the exsisting data with the new edited task
          ctx.dispatch({ type: "UPDATETASK", payload: data }); 
          props.onClose(); //Switch to the start window
      } 
      if(data === "Completed task added and deleted")
      {
          //When task completed, deleting the task that completed
          ctx.dispatch({ type: "TASKTODELETE", payload: updateDetails._id }); 
          props.onClose(); //Switch to the start window
      }
    }, 

    onError: () =>{
      setIsErrorUpdate(true)
      let timer = setTimeout(() => {
        setIsErrorUpdate(false);
      }, 3000);

      return () => {
        //Clears the setTimeout
        clearTimeout(timer);
      };
    }
  })

  const sendUpdate = async (e) => {
    e.preventDefault(); 
    let obj = {...updateDetails}
    obj._id = ctx.taskToEdit._id
    
    //Trigger the mutation
    update(obj)
  };  

  

  const options = ["Education", "Free time", "Work", "Household management"];
  //Rendering options tags to the select input
  const selectField = options.map((o, index) => {
    return (
      <option key={index}  value={o}>
        {o}
      </option>
    );
  });

  return (
    <div className="taskToEdit">
      <br />
      {currentDetails && (
        <form onSubmit={sendUpdate} className="editForm">

          <h2 className="updateTaskTitle">{triggerTitleText?'Seems like yes...':'Any change to make ?'}</h2><br/>

          <label htmlFor="Topic">Topic: </label>
          <select
            className="updateSelectInput"
            required
            value={currentDetails.Topic}
            disabled={whenCompleteMark}
            onChange={handleTaskChange}
            id="Topic"
            name="Topic"
          >
            {selectField}
          </select>&nbsp;<br /><br />

          <label htmlFor="Task" className="taskTitle">Task: </label> <br/>
          <textarea
          className="textAreaUpdate"
            style={{ resize: "none", width: "50%" }}
            required
            placeholder="What is the task?"
            id="Task"
            disabled={whenCompleteMark}
            onChange={handleTaskChange}
            name="Task"
            value={currentDetails.Task}
            checked={true}
          /><br /><br />
          <span className="importanceLevel">Importance level:</span>
          <span className="greenRadio">gg</span>
          <span className="greenColorData">
            <strong>Green</strong> means - task with 30 days time limit<br />
          </span>
          <input
            onChange={handleTaskChange}
            className='greenOne'
            type="radio"
            disabled={whenCompleteMark}
            value="Green"
            checked={currentDetails.Importance === "Green"}
            name="Importance"
            required
          />&nbsp;&nbsp;
          <span className="yellowRadio">gg</span>
          <span className="yellowColorData">
              <strong>Yellow</strong> means - task that need to be completed<br />
              up to 14 days
          </span>
          <input
            onChange={handleTaskChange}
            type="radio"
            disabled={whenCompleteMark}
            value="Yellow"
            name="Importance"
            checked={currentDetails.Importance === "Yellow"}
          />&nbsp;&nbsp;
          <span className="redRadio">gg</span>
          <span className="redColorData">
              <strong>Red</strong> means - task that need to be completed<br />
              up to 7 days
          </span>
          <input
            onChange={handleTaskChange}
            type="radio"
            disabled={whenCompleteMark}
            value="Red"
            checked={currentDetails.Importance === "Red"}
            name="Importance"
          />&nbsp;
          <br /> <br />
          <label htmlFor="Upto">Up to: </label>
          <input
            className="updateDateInput"
            type="date"
            required
            id="Upto"
            disabled={whenCompleteMark}
            min={today}
            max={maxDaysLimit}
            name="Upto"
            value={currentDetails.Upto}
            onChange={handleTaskChange}
          />
          <br /> <br />
          <label>Complete: </label>
          <span>No</span>&nbsp;
          <input
            type="radio"
            required
            name="Complete"
            value="false"
            onChange={handleTaskChange}
            checked={!JSON.parse(currentDetails.Complete)}
          />
          <span>Yes</span>&nbsp;
          <input
            type="radio"
            name="Complete"
            value="true"
            onChange={handleTaskChange}
            checked={JSON.parse(currentDetails.Complete)}
          />
          <br /> <br />
          {isErrorUpdate && (
            <span>
              <strong>Unable to update task</strong>
            </span>
          )}
          <br /><br />
          <Button type="submit" title='Update' disable={!enableBtn}/>
          &nbsp;
          <Button title='New task' click={() => props.onClose()}/>
        </form>
      )}
    </div>
  );
};

export default UpdateTask;
