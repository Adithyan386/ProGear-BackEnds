require('dotenv').config()

const express = require('express')
const cors = require('cors')
const router = require('./Routes/route')
require('./Connect/connection')

const server = express()

server.use(cors())
server.use(express.json())
server.use(router)
server.use('/uploads',express.static('uploads'))

const port = 4000 || process.env.port

server.listen(port,()=>{
    console.log(`Express Server is Running on ${port} and Wait For Client Repones`);
})

server.get('/',(req,res)=>{
    res.send(`<h1>Server is Running</h1>`)
})