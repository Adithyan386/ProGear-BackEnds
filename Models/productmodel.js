const mongoose = require('mongoose')

const productschema = new mongoose.Schema({
    productname:{
        required:true,
        type:String
    },

    producttype:{
        required:true,
        type:String
    },

    price:{
        required:true,
        type:Number
    },

    description :{
        required:true,
        type:String
    },

    image:{
        required:true,
        type:String
    },

    reviews:[
        {
            review:{
                type:String
            },
            username:{
                type:String
            }
        }
    ]
})

const productModel = mongoose.model('productModel',productschema)

module.exports = productModel