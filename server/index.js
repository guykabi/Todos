const express = require('express')
const cors = require('cors') 
const userRouter = require('./routes/userRouter')
const taskRouter = require('./routes/taskRouter')
const errorHandler = require('./middleware/errorHandler')
require('./configs/database')


const app = express() 
app.use(cors()) 
app.use(express.json()); 
const port = process.env.PORT || 8000  


app.use('/users',userRouter) 
app.use('/tasks',taskRouter)
app.use(errorHandler)//Middleware for handling errors globaly

app.listen(port,()=>{
    console.log(`Listenning on port ${port}`)
}) 