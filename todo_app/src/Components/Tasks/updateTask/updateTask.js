import React, { useState, useContext, useEffect } from "react";
import "./updateTask.css";
import moment from "moment";
import { todoContext } from "../../../Context/TodoContext";
import { updateTask } from "../../../utils/ApiUtils";
import { handleTimeLimit } from "../../../utils/utils";
import { useMutation } from "react-query";

const UpdateTask = (props) => {
  const ctx = useContext(todoContext); //TodoContext
  const [isErrorUpdate, setIsErrorUpdate] = useState(false); //State of the error message if form was unabled to update
  const [currentDetails, setCurrentDetails] = useState(null); //State that save the details of the task to edit - uses for fill the form fields with initial values!
  const [updateDetails, setUpdateDetails] = useState(null); //The updated fiedls to update - only it!
  const [enableBtn, setEnableBtn] = useState(false); //Control the submit button activeness
  const [whenCompleteMark, setWhenCompleteMark] = useState(false);
  const [maxDaysLimit,setMaxDaysLimit]=useState(null)
  const today = moment().format("YYYY-MM-DD"); //Date of today for the date input


  useEffect(() => {
    if (ctx.taskToEdit != null) {

      //Load the requested task to edit
      setCurrentDetails(ctx.taskToEdit);
      setEnableBtn(false);
      setUpdateDetails(null);
    }
  }, [ctx.taskToEdit]); 


  useEffect(()=>{
    if(!currentDetails) return
      
      //Function that return the max date which the calendar
      // will enable choosing dates - based on task's importance level
      let dateLimit =  handleTimeLimit(currentDetails.Importance,today)

      //Sets the max date to enable on the date input
      setMaxDaysLimit(dateLimit)

      //Sets back the original date of the task
      setCurrentDetails({ ...currentDetails,Upto:ctx.taskToEdit.Upto});
      
      if(!updateDetails) return
      //Checks if there was any chanage made in the task edit form
      //if not, unable the submit button
      if(Object.keys(updateDetails).length === 1 && !Object.keys(updateDetails).includes('Importance') ) 
      {
        setEnableBtn(false)
      }

  },[currentDetails&&currentDetails.Importance])



  //Checking if any detail changed - if indeed changed
  //updates the new updateDetails state which sends only
  //the fields that has changed to the server
  const handleTaskChange = (e) => {
    
    const { name, value } = e.target;

    //Update only the current data that present to the user within the fields
    setCurrentDetails({ ...currentDetails, [name]: value });

    if (ctx.taskToEdit[name].toString() === value || !updateDetails) {

      if (updateDetails) {

        const newUpdateDetails = { ...updateDetails }

        //Deleting the field that return the same value as already exists
        delete newUpdateDetails[name]
        setUpdateDetails(newUpdateDetails);

        //When there is nothing changed again -
        //the state of updateDetails returned to be empty again
        if (Object.keys(updateDetails).length === 1) {
          setEnableBtn(false) //Unable the submit button
        }

        if (value === "false") {
          setUpdateDetails(null); //Clear the state when switch back to false
          setWhenCompleteMark(false); //Switch off the disabled on each field
          return setEnableBtn(false);
        }
      }
    }
    //If the user choose/change a value that isn't exsits yet
    if (ctx.taskToEdit[name] !== value) {
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
          //If task was updated but not completed
          ctx.dispatch({ type: "UPDATETASK", payload: data }); //Update the new data to the context with the new task that just been added
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
  const selectField = options.map((o, index) => {
    //Rendering options tags to the select input
    return (
      <option key={index} value={o}>
        {o}
      </option>
    );
  });

  return (
    <div className="taskToEdit">
      <br />
      {currentDetails && (
        <form onSubmit={sendUpdate} className="editForm">
          <label htmlFor="Topic">Topic: </label>
          <select
            required
            value={currentDetails.Topic}
            disabled={whenCompleteMark}
            onChange={handleTaskChange}
            id="Topic"
            name="Topic"
          >
            {selectField}
          </select>{" "}
          <br />
          <br />
          <label htmlFor="Task">Task: </label>
          <input
            type="text"
            required
            id="Task"
            disabled={whenCompleteMark}
            onChange={handleTaskChange}
            name="Task"
            value={currentDetails.Task}
            checked={true}
          />
          <br />
          <br />
          <span className="importanceLevel">Choose importance level:</span>
          <span className="greenRadio">gg</span>
          <span className="greenColorData">
            <strong>Green</strong> means - task that is great to complete <br />
            and there is no pressure to finish!
          </span>
          <input
            onChange={handleTaskChange}
            type="radio"
            disabled={whenCompleteMark}
            value="Green"
            checked={currentDetails.Importance === "Green"}
            name="Importance"
            required
          />{" "}
          &nbsp;&nbsp;
          <span className="yellowRadio">gg</span>
          <span className="yellowColorData">
            <strong>Yellow</strong> means - task that need to be completed{" "}
            <br />
            in the near future!
          </span>
          <input
            onChange={handleTaskChange}
            type="radio"
            disabled={whenCompleteMark}
            value="Yellow"
            name="Importance"
            checked={currentDetails.Importance === "Yellow"}
          />
          &nbsp;&nbsp;
          <span className="redRadio">gg</span>
          <span className="redColorData">
            <strong>Red</strong> means - task that is must be completed <br />
            as soon as possible!
          </span>
          <input
            onChange={handleTaskChange}
            type="radio"
            disabled={whenCompleteMark}
            value="Red"
            checked={currentDetails.Importance === "Red"}
            name="Importance"
          />{" "}
          <br /> <br />
          <label htmlFor="Upto">Up to: </label>
          <input
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
          <br />
          <br />
          <button type="submit" disabled={!enableBtn}>
            Update
          </button>
          &nbsp;
          <button onClick={() => props.onClose()}>New task</button>
        </form>
      )}
    </div>
  );
};

export default UpdateTask;
