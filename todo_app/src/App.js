import Login from "./Components/Login/Login";
import { AuthContextProvider } from "./Context/AuthContext";
import { TodoContextProvider } from "./Context/TodoContext";
import CompletedTasks from "./Components/TasksTracking/completedTasks/completedTasks";
import UnCompletedTasks from "./Components/TasksTracking/unCompletedTasks/unCompletedTasks";
import {  Routes, Route } from 'react-router-dom';
import React,{lazy,Suspense} from 'react'


//For lazy load
const Home = lazy(()=> import  ("./Components/Home/Home"))
const Tasks = lazy(()=> import  ("./Components/Tasks/Tasks"))
const TasksTracking = lazy(()=> import ("./Components/TasksTracking/tasksTracking"))

function App() {
  return (
    <div className="App">
      <AuthContextProvider>
       <TodoContextProvider>
        <Suspense fallback={<h1>Loading</h1>}>
         <Routes>
         <Route path="/" element={<Login/>}/>
         <Route path="/Home" element={<Home/>}>
           <Route path="tasks" element={<Tasks/>}/>
           <Route path="taskstrack" element={<TasksTracking/>}>
               <Route path="completedTasks" element={<CompletedTasks/>}/>
               <Route path="unCompletedTasks" element={<UnCompletedTasks/>}/>
           </Route>
         </Route>
        </Routes>
        </Suspense>
       </TodoContextProvider>
      </AuthContextProvider>
    </div>
  );
}

export default App;
