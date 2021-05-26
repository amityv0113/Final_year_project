const mongoose = require('mongoose')
const validator = require('validator')

const { stringify } = require('querystring')
const { threadId } = require('worker_threads')

// const connectionUrl = 'mongodb://127.0.0.1:27017/project-db'
// const databaseName = 'project'

mongoose.connect(process.env.MONGODB_URL ,{
    useNewUrlParser:true,
    useCreateIndex:true,
})



