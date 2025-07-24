const express = require("express")
const app = express()
const cors = require("cors")
// ----------- Packages -----------
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const cookieParser = require("cookie-parser")
// ----------- Models -----------
const user = require("./Models/userModel")
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
        path:"/"
    });
    console.log(req.cookies.token)
    res.json({ message: "Logged out successfully", success: true })
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
                    username: userFound.username,
                    id: userFound._id
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



app.listen("8000")