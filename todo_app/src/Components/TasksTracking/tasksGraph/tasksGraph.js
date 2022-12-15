import React, { useEffect, useState } from 'react'
import {BarChart,Bar,Tooltip, XAxis, YAxis, Label,LabelList} from 'recharts'
import {overAllAvgPrecentage } from '../../../utils/utils'

const TasksGraph = (props) => { 
   
  const [completedTasks,setCompletedTasks]=useState(null)
  
  useEffect(()=>{
     let avg = overAllAvgPrecentage(props.taskData)   
     setCompletedTasks(avg)
  },[])  
   

    const CustomTooltip = () => {  
      // Message when hover above each grpah column 
        return (
          <div className="custom-tooltip">
            <p style={{fontSize:'small'}}>
             Overall Average of completion <br/> time by precentage
            </p>
          </div>
        );
    };

  return (
    <div className='mainGraphDiv'>
       {completedTasks&& <BarChart width={800} height={400} margin={{left:360,bottom:40}} fontWeight="bold" data={completedTasks}>
       <Bar dataKey="avgCompletionPrecentage" fill >
        <LabelList dataKey="avgCompletionPrecentage" fill='black' position="inside"/>
       </Bar>
       <Tooltip content={<CustomTooltip />} cursor={{fill: 'none'}} />
       <XAxis dataKey="Importance"> 
       <Label value="Importance level" offset={0} position="bottom" />
       </XAxis>
       <YAxis domain={[0, 100]}>
       <Label value="Avg time percentage to complete" angle={-90} position='insideBottomLeft' />
       </YAxis>
     </BarChart>}
    </div>
  )
}

export default TasksGraph