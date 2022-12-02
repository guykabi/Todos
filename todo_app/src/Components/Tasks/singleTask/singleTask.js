import "./singleTask.css";
import React, { useState, useContext, useEffect } from "react";
import { timeRemainTask } from "../../../utils/utils";
import { taskToDelete } from "../../../utils/ApiUtils";
import { todoContext } from "../../../Context/TodoContext";
import Modal from "../../../UI/Modal/Modal";
import { useMutation } from "react-query";

const SingleTask = (props) => {
  const [triggerDots, setTriggerDots] = useState(false);
  const [triggerSureToDelete, setTriggerSureToDelete] = useState(false);
  const [isThreeDots, setIsThreeDots] = useState(true);
  const [isError, setIsError] = useState(true);
  const ctx = useContext(todoContext);
  //Giving the exact time that remain to the task
  let timeRemain = timeRemainTask(props.Upto);

  useEffect(() => {
    if (ctx.taskToEdit != null) {
      if (ctx.taskToEdit._id === props._id) {
        setIsThreeDots(false);
      } else {
        setIsThreeDots(true);
      }
    }
    if (ctx.taskToEdit == null) {
      setIsThreeDots(true);
    }
  }, [ctx.taskToEdit]);


  const toEdit = () => {
    setTriggerDots(false);

    //Sets the details of the choosen task to the context
    ctx.dispatch({ type: "TASKTOEDIT", payload: props })
  };


  const switchOff = () => {
    setTriggerDots(false);
    setTriggerSureToDelete(false);
  }; 


  const {mutate:toDelete} = useMutation(taskToDelete,{
    onSuccess:(data)=>{
      ctx.dispatch({ type: "TASKTODELETE", payload: props._id });
      switchOff();
    }, 
    onError:(error)=>{
      setIsError(false);
      let timer = setTimeout(() => {
        setIsError(true);
      }, 3000);

      return () => {
        clearTimeout(timer);
      };
    }
  })

  const deleteTask = () => { 
   toDelete(props._id)
  };

  return (
    <div
      className="mainSingleTask"
      style={{
        backgroundColor: `${props.Importance.toLowerCase()}`,
        cursor: "pointer",
      }}
    >
      {isThreeDots && (
        <span
          className="editDots"
          onClick={() => {
            setTriggerDots(!triggerDots);
          }}
        ></span>
      )}
      {triggerDots && (
        <div className="editOrDeleteDiv">
          <div onClick={toEdit}>Edit</div>
          <div onClick={() => setTriggerSureToDelete(true)}>Delete</div>
        </div>
      )}
      <h3>{props.Topic}</h3>
      <div>
        <div>{props.Task}</div>
        Importance: <span>{props.Importance}</span> <br />
        {!props.Complete && <span>To complete {timeRemain}</span>} <br />
        <span>Complete: {props.Complete.toString()}</span>
      </div>
      {triggerSureToDelete && (
        <Modal onClose={switchOff}>
          {isError ? (
            <div>
              <h3>Are you sure to delete?</h3> <br />
              <button onClick={switchOff}>No</button>
              &nbsp;&nbsp;
              <button onClick={deleteTask}>Yes</button>
            </div>
          ) : (
            <div>
              <h3>There was an error to delete the task!</h3> <br />
            </div>
          )}
        </Modal>
      )}
    </div>
  );
};

export default SingleTask;
