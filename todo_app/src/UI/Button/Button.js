import React from 'react'
import './Button.css'

const Button = (props) => {

  const clickEvent = ()=>{
    //Trigger only if there is onClick event passed in props
     if(props.click)
     {
       props.click()
     }
  } 

  return (
    <button className='globalBtn' onClick={clickEvent}>
        {props.title}
    </button>
  )
}

export default Button