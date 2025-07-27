const express = require("express")
const app = express()
const cors = require("cors")
// ----------- Packages -----------
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const cookieParser = require("cookie-parser")
// ----------- Models -----------
const user = require("./Models/userModel")
const event = require("./Models/eventModel")
// ----------- ENV -----------
require('dotenv').config();




// ----------- MiddleWare -----------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));
app.use(cookieParser())

// ----------- Get -----------

app.get("/logout", async (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        sameSite: "Lax",
        secure: false,
        path: "/"
    });
    console.log(req.cookies.token)
    res.json({ message: "Logged out successfully", success: true })
})



app.get("/getEvents", async (req, res) => {
    const token = req.cookies.token
    const data = jwt.verify(token, process.env.JWT_SECRET)
    try {
        const events = await event.find({ user: data.id })
        res.json({
            success: true,
            data: events,
        })
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            data: [],
        })
    }
})


app.get("/getEvents-admin", async (req, res) => {
    const token = req.cookies.token
    const data = jwt.verify(token, process.env.JWT_SECRET)
    try {
        const events = await event.find()
        res.json({
            success: true,
            data: events,
        })
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            data: [],
        })
    }
})


app.get("/deleteEvent/:id", async (req, res) => {
    try {
        const deletedEvent = await event.findByIdAndDelete(req.params.id);
        const userFound = await user.findOne({ _id: deletedEvent.user })
        userFound.events.splice(userFound.events.indexOf(deletedEvent._id), 1);
        userFound.save()
        res.json({
            success: true,
            message: "Deleted Successfully"
        })
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: "Something went wrong"
        })
    }
})


// ----------- Post -----------


app.post("/login", async (req, res) => {
    const userFound = await user.findOne({ email: req.body.email })
    if (userFound) {
        bcrypt.compare(req.body.password, userFound.password, function (err, result) {
            if (result) {
                const token = jwt.sign({ email: userFound.email, id: userFound._id }, process.env.JWT_SECRET);
                res.cookie("token", token, {
                    httpOnly: true,
                    sameSite: "Lax",
                    secure: false,
                });

                res.json({
                    success: true,
                    message: "Logged In",
                    user: userFound
                })
            }
            else {
                res.json({
                    success: false,
                    message: "Wrong Password!"
                })
            }
        });
    }
    else {
        res.json({
            success: false,
            message: "No User Found with such User"
        })
    }
    console.log(userFound)
})




app.post("/register", async (req, res) => {
    const userFound = await user.findOne({ email: req.body.email })
    if (userFound) {
        res.json({
            success: false,
            message: "User Already Existed"
        })
        return
    }
    else {
        try {
            bcrypt.genSalt(10, function (err, salt) {
                bcrypt.hash(req.body.password, salt, async function (err, hash) {
                    const userCreated = await user.create({
                        email: req.body.email,
                        username: req.body.username,
                        password: hash,
                    })
                    const token = jwt.sign({ email: userCreated.email, id: userCreated._id }, process.env.JWT_SECRET);
                    res.cookie("token", token, {
                        httpOnly: true,
                        sameSite: "Lax",
                        secure: false,
                    });
                    res.json({
                        success: true,
                        message: "User Registered Successfully",
                        user: userCreated
                    })
                });
            });
        } catch (error) {
            res.json({
                success: false,
                message: "Something Went Wrong"
            })
        }
    }
})


app.post("/create", async (req, res) => {
    try {
        const token = req.cookies.token
        const data = jwt.verify(token, process.env.JWT_SECRET)
        const userFound = await user.findOne({ email: data.email })
        const createdEvent = await event.create({
            name: req.body.eventName,
            description: req.body.eventDescription,
            date: req.body.formattedDate,
            time: req.body.formattedTime,
            user: userFound._id,
            organizer: req.body.organizerName,
            location: req.body.eventLocation
        })
        userFound.events.push(createdEvent._id)
        userFound.save()
        res.json({
            success: true,
            message: "Event Successfully created"
        })
    } catch (error) {
        res.json({
            success: false,
            message: "Something Went Wrong"
        })
    }
})


app.post("/updateEvent/:id", async (req, res) => {

    try {
        const foundEvent = await event.findOne({_id:req.params.id})
        foundEvent.name = req.body.name
        foundEvent.description = req.body.description
        foundEvent.date = req.body.date
        foundEvent.time = req.body.time
        foundEvent.organizer = req.body.organizer
        foundEvent.location = req.body.location
        foundEvent.save()
        res.json({
            success: true,
            message: "Updated Successfully",
            data :foundEvent 
        })
    } catch (error) {
        res.json({
            success: false,
            message: "Something went wrong",
            data : {}
        })
    }
})



app.listen("8000")