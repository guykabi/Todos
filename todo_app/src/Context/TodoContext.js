import React,{ createContext,useReducer } from "react"; 


export const todoContext = createContext() 

export const todoReducer = (state,action)=>{
    switch (action.type){
        case 'GETDATA'://Get the tasks on the initial upload of the app
            return {...state,userTasks:action.payload}

        case 'ADDEDTASK'://Add new task to the exsits tasks array

            let newArr = [...state.userTasks]
            //Finds the task that needs to complete after than the new task
            let element;
            for(let i=0; i<newArr.length;i++)//Check the for the right position to insert the new task
            { 
             if(i != (newArr.length - 1))
             {
               if(newArr[i].Upto > action.payload.Upto > newArr[i+1].Upto)
               {
                  element = newArr[i+1] 
                  return
               }
             }   
            }
            //Finds the after task index
            let index = newArr.indexOf(element)
            //Insert the new task before the after task
            newArr.splice(index,0,action.payload)
            //Sets the context with new arrange array of tasks
            return {userTasks:newArr}
        
         case 'UPDATETASK':
           
            let Arr = [...state.userTasks]
            //Finds the task that has updated
            let task = Arr.find(task => task._id === action.payload._id)
            //Finds the task index
            let taskIndex = Arr.indexOf(task)
            //Replace the tasks with the updated one
            Arr[taskIndex]=action.payload
            //Sets the context with new arrange array of tasks
            return {userTasks:Arr}

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
   console.log("Tasks:" ,state)
   return(
    <todoContext.Provider value={{...state,dispatch}}>
       {children}
    </todoContext.Provider>
   )
}

