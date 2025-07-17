const mongoose = require("mongoose")


const bookingSchema = mongoose.Schema({
    name:String,
    time: String,
    tableNo: Number,
    date: String,
    count: Number,
    guest: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
})


const bookingModel = mongoose.model("Booking", bookingSchema)

module.exports = bookingModel