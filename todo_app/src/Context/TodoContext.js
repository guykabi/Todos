import React,{ createContext,useReducer } from "react"; 
import {insertNewTaskToPosition} from '../utils/utils'

export const todoContext = createContext() 

export const todoReducer = (state,action)=>{
    switch (action.type){
        case 'GETDATA'://Get the tasks on the initial upload of the app
            return {...state,userTasks:action.payload}

        case 'ADDEDTASK'://Add new task to the exsits tasks array

            let newArr = [...state.userTasks]
            //Function to set the task on the right index base on the final date
            let final = insertNewTaskToPosition(newArr,action.payload)
            return {userTasks:final}
            
        
         case 'UPDATETASK'://Update the user's tasks
           
            let Arr = [...state.userTasks]
            //Finds the task that has updated
            let task = Arr.find(task => task._id === action.payload._id)
            //Finds the task index
            let taskIndex = Arr.indexOf(task)
            //Remove the unupated task/previous one
            Arr.splice(taskIndex,1)
            //Function to set the task on the right index base on the final date
            let final2 = insertNewTaskToPosition(Arr,action.payload)
            //Sets the context with new arrange array of tasks
            return {userTasks:final2}

        case 'TASKTODELETE':       

        let deleteArr = [...state.userTasks]
        //Filter a new arr without the deleted task
        let afterDeleteArr = deleteArr.filter(task => task._id !== action.payload)
        //Sets the context with new arrange array of tasks
        return {userTasks:afterDeleteArr}

        case 'TASKTOEDIT': //Details of the tasks the user wants to edit
            return {...state,taskToEdit:action.payload}

        case 'JUSTADDED': //Details of the tasks the user wants to edit
            return {...state,taskJustAdded:action.payload}  

        default :
            return state
    }
}

export const TodoContextProvider = ({children})=>{
    const [state,dispatch]=useReducer(todoReducer,{
    userTasks:null,
    taskToEdit:null,
    taskJustAdded:null
   })
   
   return(
    <todoContext.Provider value={{...state,dispatch}}>
       {children}
    </todoContext.Provider>
   )
}

