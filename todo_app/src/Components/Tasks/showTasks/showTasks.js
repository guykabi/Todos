import React, { useContext, useState, useEffect,useCallback } from "react";
import { todoContext } from "../../../Context/TodoContext";
import SingleTask from "../singleTask/singleTask";
import "./showTasks.css";
import { customFilter } from "../../../utils/utils";
import {setItemToLocal,getItemFromLocal} from '../../../utils/storageUtils'


const ShowTasks = () => {
  const tasksCtx = useContext(todoContext); //User's tasks from the todo context
  let tasks = getItemFromLocal("userTasks")
  const [allUserTasks, setAllUserTasks] = useState(null); //All the tasks of the user that render into singleTask components
  const userData = getItemFromLocal("userData")
  const [countTasks, setCountTasks] = useState(0);
  const [isOpenWindow,setIsOpenWindow]=useState(null)


  
  useEffect(() => {
    if (tasksCtx.userTasks === null) return
      //Updating the tasks on the localStorage with the new tasks
      setItemToLocal("userTasks",tasksCtx.userTasks)
      setAllUserTasks(tasksCtx.userTasks); //Sets the new tasks array
      setCountTasks(tasksCtx.userTasks.length); //Counts the number of tasks
    
  }, [tasksCtx.userTasks]); //Trigger when task added/updated/deleted

  const sortBy = (e) => {
    //Sorting the tasks by colors of importance
    if (e.target.value === "") {
      setAllUserTasks(tasks);
    } else {
      let results = tasks.filter((t) => t.Importance === e.target.value);
      setAllUserTasks(results);
    }
  };  

  const handleOpenDotsTask = useCallback((e) =>{
    if(!e) return setIsOpenWindow(null)
    setIsOpenWindow(e)
  },[isOpenWindow])

  const serachTask = (e) => {
    //Sorting the tasks by colors of importance
    if (e.target.value === "") {
      setAllUserTasks(tasks);
    } else {
      //Function that search any substring in the tasks
      const results = customFilter(tasks, e.target.value);
      setAllUserTasks(results);
    }
  };

  return (
    <>
      <div className="showTaskMainDiv"  data="red">
        <h2>
          {userData.data.Name}'s tasks {`(${countTasks})`}
        </h2>
        <div>
          <input
            type="text"
            className="searchInput"
            placeholder="Search task..."
            onChange={serachTask}
          />
        </div>
        <div className="sortedByDiv">
          <label htmlFor="Importance" className="lables">
            <h6>All</h6>
            <input onChange={sortBy} type="radio" value="" name="Importance" />
          </label>
          <label htmlFor="Importance" className="lables">
            <h6>Green</h6>
            <input
              onChange={sortBy}
              type="radio"
              value="Green"
              name="Importance"
            />
          </label>
          <label htmlFor="Importance" className="lables">
            <h6>Yellow</h6>
            <input
              onChange={sortBy}
              type="radio"
              value="Yellow"
              name="Importance"
            />
          </label>
          <label htmlFor="Importance" className="lables">
            <h6>Red</h6>
            <input
              onChange={sortBy}
              type="radio"
              value="Red"
              name="Importance"
            />
          </label>
        </div>
        <div className="allTasks">
          {allUserTasks &&
            allUserTasks.map((task, index) => {
              return <SingleTask key={index} window={handleOpenDotsTask} openWindow={isOpenWindow} {...task} />;
            })}
        </div>
      </div>
    </>
  );
};

export default ShowTasks;
