const mongoose = require("mongoose")


const reviewSchema = mongoose.Schema({
    user: String,
    date: {
        type: Date,
        default: Date.now
    },
    rating : Number,
    review : String
})

const reviewModel = mongoose.model("Review",reviewSchema)


module.exports = reviewModel