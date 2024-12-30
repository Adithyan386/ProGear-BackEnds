const { default: mongoose } = require("mongoose");

const paymentshcema = new mongoose.Schema({
    userID:{
        required:true,
        type:mongoose.Schema.Types.ObjectId,
        ref:'userModel'
    },

    productID:{
        required:true,
        type:mongoose.Schema.Types.ObjectId,
        ref:'productModel'
    },

    ShippingAddres:{
        required:true,
        type:String
    },

    City:{
        required:true,
        type:String
    },

    Status:{
        required:true,
        type:String,
        default:'pending'
    },

    Pincode:{
        required:true,
        type:String
    },

    State:{
        required:true,
        type:String
    },

    phone:{
        required:true,
        type:String
    },

    Amount:{
        required:true,
        type:Number
    },

    PaymentID:{
        required:true,
        type:String
    },

    date:{
        required:true,
        type:Date,
        default:Date.now(Number)
    }
}) 

const PaymentModel = mongoose.model('PaymentModel',paymentshcema)
module.exports = PaymentModel