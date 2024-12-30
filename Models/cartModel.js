const mongoose = require('mongoose')

const userCarts = new mongoose.Schema({
    userid:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'userModel'
    },

    product:[{
        productId:{
            type:mongoose.Schema.Types.ObjectId,
            required:true,
            ref:'productModel'
        },
        count:{
            type:Number,
            required:true
        }
    }]
})

const userCart = mongoose.model('userCart',userCarts)

module.exports = userCart