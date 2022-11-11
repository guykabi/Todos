import Login from "./Components/Login/Login";
import { AuthContextProvider } from "./Context/AuthContext";
import { TodoContextProvider } from "./Context/TodoContext";
import {  Routes, Route } from 'react-router-dom';
import React,{lazy,Suspense} from 'react'


//For lazy load
const Home = lazy(()=> import  ("./Components/Home/Home"))
const Tasks = lazy(()=> import  ("./Components/Tasks/Tasks"))

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
         </Route>
        </Routes>
        </Suspense>
       </TodoContextProvider>
      </AuthContextProvider>
    </div>
  );
}

export default App;
