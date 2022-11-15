import SideNav, { NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import { useNavigate } from 'react-router'
import React, { useState } from 'react';


const Navbar = () => {
    const navigate = useNavigate()
    const [toggleState,setToggleState]=useState(false)
    
    const toHome = ()=>{
        navigate('tasks')
      } 

      const toCompleteTasks = ()=>{
        navigate('taskstrack')
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
        <NavItem eventKey="charts">
            <NavIcon>
                <i className="fa fa-fw fa-line-chart" style={{ fontSize: '1.75em' }} />
            </NavIcon>
            <NavText>
                History
            </NavText>
            <NavItem eventKey="charts/linechart">
                <NavText  onClick={toCompleteTasks}>
                    Tasks completed
                </NavText>
            </NavItem>
            <NavItem eventKey="charts/barchart">
                <NavText>
                    Tasks uncompleted
                </NavText>
            </NavItem>
        </NavItem>
        <NavItem eventKey="charts">
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