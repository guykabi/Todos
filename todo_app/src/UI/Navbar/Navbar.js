import SideNav, { NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import { useNavigate } from 'react-router-dom'
import React, { useState } from 'react';


const Navbar = () => {
    const navigate = useNavigate()
    const [toggleState,setToggleState]=useState(false)
    
    const toHome = ()=>{
        //Set the sidebar close after clicking
        setToggleState(false)
        navigate('tasks')
       
      } 

      const toCompleteTasks = ()=>{
        setToggleState(false)
        navigate('taskstrack/completedTasks')
      }

      const toUnCompleteTasks = ()=>{
        setToggleState(false)
        navigate('taskstrack/unCompletedTasks')
      }


    const logout = ()=>{
      localStorage.clear()
      navigate('/')
    }

  return (
    <div>
        <SideNav 
         style={{'position':'fixed','backgroundColor':'rgb(228, 86, 86)'}}
         expanded={toggleState}
         onToggle={(toggleState) => {
            setToggleState(toggleState);
        }}>
       <SideNav.Toggle />
       <SideNav.Nav  defaultSelected="home">
        <NavItem eventKey="home">
            <NavIcon>
                <i className="fa fa-fw fa-home" style={{ fontSize: '1.75em'}} />
            </NavIcon>
            <NavText onClick={toHome}>
                Home
            </NavText>
        </NavItem>
        <NavItem eventKey="history">
            <NavIcon>
                <i className="fa fa-fw fa-line-chart" style={{ fontSize: '1.75em' }} />
            </NavIcon>
            <NavText>
                History
            </NavText>
            <NavItem eventKey="history/tasks completed">
                <NavText  onClick={toCompleteTasks}>
                    Tasks completed
                </NavText>
            </NavItem>
            <NavItem eventKey="history/tasks uncompleted">
                <NavText onClick={toUnCompleteTasks}>
                    Tasks uncompleted
                </NavText>
            </NavItem>
        </NavItem>
        <NavItem eventKey="logout">
            <NavIcon>
                <i className="fa fa-fw fa-line-chart" style={{ fontSize: '1.75em' }} />
            </NavIcon>
            <NavText onClick={logout}>
                Logout
            </NavText>
        </NavItem>
    </SideNav.Nav>
</SideNav>
    </div>
  )
}

export default Navbar