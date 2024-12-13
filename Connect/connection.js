const mongoose = require('mongoose')

const connectstring = process.env.DATABASE

mongoose.connect(connectstring).then(()=>{
    console.log('MongoDB Atlas Connected');
}).catch((err)=>{
    console.log('MongoDB Connection Error',err);
})