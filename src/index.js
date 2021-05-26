const express = require('express')
const app =express()
require('./db/mongoose')
const User =require('./model/user')
const userRouter = require('./routers/user_router')
const port = process.env.PORT || 3000
app.use(express.json())

app.use(userRouter)

app.listen(port,()=>{
    console.log('server is running on port '+port)
})

