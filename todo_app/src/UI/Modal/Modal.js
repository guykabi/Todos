import './Modal.css'
import React,{Fragment} from 'react'
import ReactDOM from 'react-dom'
const Backdrop = (props)=>{
    return(
        <div className='backdrop' onClick={props.onClose} />
    )
}

const ModalOverlay = (props)=>{
  console.log('inside modal')
    return(
        <div className='modal'>
                 <div className='content'>{props.children}</div>
          </div>
    )
}

const portalElement = document.getElementById('overlays')
const Modal = (props)=>{
    return(
      <Fragment>
         {ReactDOM.createPortal(<Backdrop onClose={props.onClose}/>,portalElement)}
         {ReactDOM.createPortal(<ModalOverlay>{props.children}</ModalOverlay>,portalElement)}
      </Fragment>
    )
}
export default Modal




/*import React from 'react'
import './Modal.css'

const Modal = ({props}) => {
    console.log(props.Topic)
  return (
    <div className='backGroundBlack'>
     <div className='modalMainDiv'>
       <h2>Task details</h2> 
       <div className='detailsDiv'>
         <h3>{props.Topic}</h3> <br />
         <div>{props.task}</div>
         <div className='dateimportance'>
            <div>Level - <span style={{padding:'4px',backgroundColor:props.importance,color:'black'}}>
                {props.importance}
                </span></div> &nbsp;&nbsp;
            <div>Up to - {props.Date}</div>
         </div>
       </div>
    </div>
    </div>
  )
}

export default Modal*/