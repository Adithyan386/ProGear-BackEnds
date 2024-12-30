// const { verify } = require('jsonwebtoken')
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
        type:String
    },
    address:String,

    phone:String,

    gender:String,

    profilepic:String,

    role:{
        type:Number,
        default:0
    },

    otp:{
        type:String
    },

    otpexpries:{
        type:Date
    },

    idVerified:{
        required:true,
        type:Boolean,
        default:false
    }
})

const userModel = mongoose.model('userModel',userschema)

module.exports = userModel