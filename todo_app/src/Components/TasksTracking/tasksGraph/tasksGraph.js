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
       {completedTasks&& <BarChart width={800} height={400} margin={{left:260,bottom:40}} data={completedTasks}>
       <Bar dataKey="avgCompletionPrecentage" fill >
        <LabelList dataKey="avgCompletionPrecentage" fill='black' position="inside"/>
       </Bar>
       <Tooltip content={<CustomTooltip />} />
       <XAxis dataKey="Importance"> 
       <Label value="Importance level" offset={0} position="bottom" />
       </XAxis>
       <YAxis label={{ value: 'Avg completion precentage', angle: -90, position:"left" }} />
     </BarChart>}
    </div>
  )
}

export default TasksGraph