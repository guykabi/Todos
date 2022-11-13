import SideNav, { NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import { useNavigate } from 'react-router'
import React from 'react';


const Navbar = () => {
    const navigate = useNavigate()
    
    const toHome = ()=>{
        localStorage.clear()
        navigate('/Home/tasks')
      }

    const logout = ()=>{
      localStorage.clear()
      navigate('/')
    }

  return (
    <div>
        <SideNav
    onSelect={(selected) => {
        // Add your code here
    }}
>
    <SideNav.Toggle />
    <SideNav.Nav defaultSelected="home">
        <NavItem eventKey="home">
            <NavIcon>
                <i className="fa fa-fw fa-home" style={{ fontSize: '1.75em' }} />
            </NavIcon>
            <NavText onClick={navigate('tasks')}>
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
                <NavText>
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