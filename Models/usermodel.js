const mongoose = require('mongoose')

const userschema = new mongoose.Schema({
    firstname:{
        required:true,
        type:String
    },
    secondname:{
        required:true,
        type:String
    },
    email:{
        required:true,
        type:String
    },
    password:{
        required:true,
        type:String
    },
    address:String,

    phone:String,

    gender:String,

    profilepic:String,

    role:{
        type:Number,
        default:0
    }
})

const userModel = mongoose.model('userModel',userschema)

module.exports = userModel