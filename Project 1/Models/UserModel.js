const mongoose = require("mongoose")


mongoose.connect("mongodb://localhost:27017/TableTime")

const userSchema = mongoose.Schema({
    email: String,
    username: String,
    password: String,
    bookings: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking"
    }],
    role: {
        type: String,
        default: "user"
    }
})


const userModel = mongoose.model("User", userSchema)

module.exports = userModel