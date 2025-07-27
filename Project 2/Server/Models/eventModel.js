const mongoose = require("mongoose")
const userModel = require("./userModel")


const eventSchema = mongoose.Schema({
    name: String,
    description: String,
    date: Date,
    time: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    organizer: String,
    location : String
})

const eventModel = mongoose.model("Event",eventSchema)


module.exports = eventModel