const mongoose = require("mongoose")

mongoose.connect("mongodb://localhost:27017/Eventora")


const userSchema = mongoose.Schema({
    email: String,
    username: String,
    password: String,
    events: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event"
    }],
    role: {
        type: String,
        default: "user"
    }
})


const userModel = mongoose.model("User", userSchema)


module.exports = userModel