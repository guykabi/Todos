import "./createTask.css";
import moment from "moment";
import Modal from "../../../UI/Modal/Modal";
import React, { useContext, useState,useRef } from "react";
import { todoContext } from "../../../Context/TodoContext";
import { addTask } from "../../../utils/ApiUtils";
import { getItemFromLocal } from "../../../utils/storageUtils";
import {handleTimeLimit} from '../../../utils/utils'
import UpdateTask from "../updateTask/updateTask";
import {useMutation} from "react-query";
import Button from '../../../UI/Button/Button'

const CreateTask = () => {
  const [taskDetails, setTaskDetails] = useState({}); //State that set the new task details
  const ctx = useContext(todoContext); //TodoContext
  const userData = getItemFromLocal("userData"); //LocalStorage
  const [isNewTask, setIsNewTask] = useState(false); //State that controls over the newTask form
  const [isError, setIsError] = useState(false); //State of the error message if form was unabled to submit
  const [showFinal, setShowFinal] = useState(false); //State that manage the popup-sum message
  const [maxDaysLimit,setMaxDaysLimit]=useState(null)
  const today = moment().format("YYYY-MM-DD"); //Date of today for the date input
  const dateInputRef = useRef()
  
  

  //Sets the task fields
  const handleTask = (e) => {
    const { name, value } = e.target;
    if(name !== 'Importance')  setTaskDetails({ ...taskDetails, [name]: value });

    
    if(name === 'Importance')
    {
      //Returns the max value the calendar will enable 
      //choosing dates - base on importance level
      let dateLimit = handleTimeLimit(value,today)

      //Updates the max key on the date input
      setMaxDaysLimit(dateLimit)
    
      //Changes the value of the date input to the current date
      dateInputRef.current.value = null

      setTaskDetails({ ...taskDetails, Upto: today , [name]:value });
    }

  };

  const sendTask = (e) => {
  
    e.preventDefault();

    //Trigger the modal with 'Confirm task' message and the task sum
    setShowFinal(true);
  };

  const switchOff = () => {
    //Shut down the sum up and confirm pop-up message
    setShowFinal(false);
  };

  const switchToNewTask = () => {
    //Open the new task form
    setIsNewTask(true);
  }; 

  const {mutate:newTask} = useMutation(addTask,{
      onSuccess: (data)=>{
        //Update the new data to the context with the new task that just been added
        ctx.dispatch({ type: "ADDEDTASK", payload: data });
        setShowFinal(false); //Remove the popup message
        setIsNewTask(false); //Switch the screen to the start task screen
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

  //Sets the new task to the user tasks on the DB
  const confirmNewTask = () => {
    
    //Adding extra necessary fields
    let obj = { ...taskDetails };
    obj.userId = userData.data._id;
    obj.Complete = false; 
    
    //Trigger the mutation
    newTask(obj) 

  };

  const setNewTask = () => {
    ctx.dispatch({ type: "TASKTOEDIT", payload: null });
  };

  //The form to edit the requested task
  if (ctx.taskToEdit) {
    return <UpdateTask onClose={setNewTask} /> 
  }

  const options = [null,"Education","Free time","Work", "Household management"];
  const selectField = options.map((o, index) => {
    //Rendering options tags to the select input
    return (
      <option key={index} value={o}>
        {o}
      </option>
    );
  });

  return (
    <div className="mainDiv">
      <br /><br />
      {!isNewTask && (
        <div>
          <h3>Ok, lets beggin...</h3> <br />
          <span
            onClick={switchToNewTask}
            className="plusSign"
            aria-labelledby="love"
            role="img"
          >
            ➕
          </span>
        </div>
      )}
      {isNewTask && (
        <div className="taskForm">
          <h2 className="createTaskTitle">What do you up next?</h2>
          <br /> <br />

          <form onSubmit={sendTask}>

            <label className="selectTopicLabel" htmlFor="Topic">
              Select the topic:
            </label>
            <select required className="createSelectInput" onChange={handleTask} id="Topic" name="Topic">
              {selectField}
            </select>&nbsp; <br /> <br />

            <textarea
              name="Task"
              onChange={handleTask}
              style={{ resize: "none", width: "70%" }}
              className="textArea"
              cols="35"
              rows="4"
              placeholder="What is the task?"
              required
            />&nbsp; <br /> <br />

            <span className="importanceLevel">Importance level:</span>
            <span className="greenRadio">gg</span>
            <span className="greenColorData">
              <strong>Green</strong> means - task with 30 days time limit<br />
            </span>
            <input
              onChange={handleTask}
              type="radio"
              value="Green"
              name="Importance"
              required
            />&nbsp;&nbsp;

            <span className="yellowRadio">gg</span>
            <span className="yellowColorData">
              <strong>Yellow</strong> means - task that need to be completed<br />
                      up to 14 days
            </span>
            <input
              onChange={handleTask}
              type="radio"
              value="Yellow"
              name="Importance"
            />&nbsp;&nbsp;

            <span className="redRadio">gg</span>
            <span className="redColorData">
              <strong>Red</strong> means - task that need to be completed<br />
                      up to 7 days
            </span>
            <input
              onChange={handleTask}
              type="radio"
              value="Red"
              name="Importance"
            />&nbsp;<br /> <br />

            <label className="dateLable" htmlFor="date">
             Date to complete:
            </label>
            <input
              type="date"
              onChange={handleTask}
              className='createDateInput'
              name="Upto"
              id="date"
              ref={dateInputRef}
              min={today}
              max={maxDaysLimit}
              required
            />&nbsp; <br /> <br />

            <Button title='Return' click={() => {setIsNewTask(false)}}/>&nbsp;
            <Button title='Make me task' type="submit"/>

          </form>
        </div>
      )}
      {showFinal && (
        <Modal onClose={switchOff}>
          <h2>Task details</h2>
          <div className="detailsDiv">
            <h3>{taskDetails.Topic}</h3>
            <div>{taskDetails.Task}</div> <br />
            <div className="dateimportance">
              <div>
                Importance -
                <span
                  style={{
                    borderRadius: "8px",
                    padding: "2px",
                    backgroundColor: taskDetails.Importance.toLowerCase(),
                    color: "black",
                  }}
                >
                  {taskDetails.Importance}
                </span>
              </div>&nbsp;&nbsp;&nbsp;
              <div>
                Up to - {taskDetails.Upto ? taskDetails.Upto : today}
              </div>&nbsp;<br />
              {isError && (
                <span>
                  <strong>Unable to add task</strong>
                </span>
              )}&nbsp;<br />
              <Button title='cancel' click={switchOff}/>&nbsp;
              <Button title='Confirm' click={confirmNewTask}/>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default CreateTask;
