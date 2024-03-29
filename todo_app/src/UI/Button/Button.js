import React from 'react'
import './Button.css'

const Button = (props) => {
  
  const clickEvent = ()=>{
    //Trigger only if there is onClick event passed via props
     if(props.click)
     {
       props.click()
     }
  } 

  return (
    <button className={props.disable?'whenDisable':'globalBtn'} 
    type={props.type&&props.type} 
    disabled={props.disable} 
    onClick={clickEvent}>
    {props.title}
    </button>
  )
}

export default Button