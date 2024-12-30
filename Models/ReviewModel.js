const { default: mongoose } = require("mongoose");

const reviewSchema = new mongoose.Schema({
    review:{
        type:String
    },
    username:{
        type:String
    },
    email:{
        type:String
    }
})

const ReviewModel = mongoose.model('ReviewModel',reviewSchema)
module.exports = ReviewModel