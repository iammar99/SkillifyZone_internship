const express = require("express")
const app = express()
const path = require("path")
// ------------------ Models------------------
const user = require("./Models/UserModel")
const booking = require("./Models/booking")
// ------------------ Packages ------------------
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const cookieParser = require("cookie-parser")
// ------------------ env ------------------
require('dotenv').config();


// ------------------ Middlewares ------------------
app.set("view engine", "ejs")
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, "public")))
async function isLoggedIn(req, res, next) {
    let cookie = req.cookies.token
    if (!cookie) {
        return res.redirect("/login")
    }
    else {
        let data = jwt.verify(cookie, process.env.JWT_SECRET)
        req.user = data
        const findUser = await user.findById(data.id)
        req.user.role = findUser.role
    }
    next()
}


// ------------------ Get Routes------------------

app.get("/", async (req, res) => {
    let token = req.cookies.token;
    let role = "";

    try {
        if (token) {
            const data = jwt.verify(token, process.env.JWT_SECRET);
            const findUser = await user.findById(data.id);
            if (findUser) {
                role = findUser.role;
            }
        }
    } catch (err) {
        console.error("Token verification failed:", err.message);
    }

    res.render("index", { token, role });

})

app.get("/login", (req, res) => {
    res.render("login")
})


app.get("/register", (req, res) => {
    res.render("register")
})


app.get("/book", isLoggedIn, async (req, res) => {
    let token = req.cookies.token
    const findUser = await user.findById(req.user.id)
    res.render("book", { token, role: findUser.role })
})

app.get("/review", (req, res) => {
    res.send("review",)
})

app.get("/my-booking", isLoggedIn, async (req, res) => {
    let token = req.cookies.token
    const findUser = await user.findOne({ email: req.user.email }).populate("bookings")
    res.render("my-booking", { token, bookings: findUser.bookings, role: findUser.role })
})


app.get("/admin", isLoggedIn, async (req, res) => {
    let token = req.cookies.token
    let user = req.user
    let bookings = await booking.find().populate({ path: "guest", select: "username" })
    console.log(bookings)
    res.render("admin", { token, role: user.role, bookings })
})




app.get("/cancel/:id", async (req, res) => {
    const id = req.params.id
    const findBooking = await booking.findById(id).populate({ path: "guest" })
    const user = findBooking.guest
    const newBookings = user.bookings.filter((booking) => {
        return booking != id
    })
    user.bookings = newBookings
    user.save()
    const deletedBooking = await booking.findByIdAndDelete(id)
    res.redirect("/my-booking")
})


app.get("/logout", (req, res) => {
    res.clearCookie("token")
    res.redirect("/")
})

// ------------------ Post Routes ------------------

app.post("/login", async (req, res) => {
    console.log(req.body)
    const findUser = await user.findOne({ email: req.body.email })
    if (findUser) {
        bcrypt.compare(req.body.password, findUser.password, function (err, result) {
            if (result) {
                let token = jwt.sign({ email: findUser.email, id: findUser._id }, process.env.JWT_SECRET)
                res.cookie("token", token)
                res.json({
                    success: true,
                    message: "Logged In",
                    redirect: ""
                });
            }
            else {
                res.json({
                    success: false,
                    message: "Invalid Password",
                    redirect: "login"
                })
            }
        });
    }
    else {
        res.json({
            success: false,
            message: "No Email found",
            redirect: "register"
        });
    }
})

app.post("/register", async (req, res) => {
    console.log(req.body)
    const findUser = await user.findOne({ email: req.body.email })
    if (findUser) {
        console.log(findUser);
        res.json({
            success: false,
            message: "Already Registered! Login.",
            redirect: "login"
        });
    } else {
        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(req.body.password, salt, async function (err, hash) {
                const newUser = await user.create({
                    email: req.body.email,
                    username: req.body.username,
                    password: hash
                })
                console.log(hash)
                var token = jwt.sign({ email: newUser.email, id: newUser._id }, process.env.JWT_SECRET)
                res.cookie("token", token)
                res.json({
                    success: true,
                    message: "Registered successful!",
                    user: findUser,
                    redirect: ""
                });
            });
        });
    }
})


app.post("/book", async (req, res) => {
    console.log(req.body, "req")
    const tableNo = Math.floor(Math.random() * 50) + 1;
    let cookie = req.cookies.token
    let data = jwt.verify(cookie, process.env.JWT_SECRET)
    console.log(data)
    const newBooking = await booking.create({
        name: req.body.name,
        date: req.body.date,
        time: req.body.formattedTime,
        count: req.body.count,
        tableNo: tableNo,
        guest: data.id,
    })
    const foundUser = await user.findOne({ email: data.email })
    foundUser.bookings.push(newBooking._id)
    foundUser.save()
    res.json({
        success: true,
        message: "Table Reserved",
        redirect: "my-booking"
    });
    res.redirect("/book")
})


app.post("/edit/:id", async (req, res) => {
    console.log(req.body)
    const findBooking = await booking.findById(req.body.id)
    findBooking.name = req.body.name
    findBooking.date = req.body.date
    findBooking.time = req.body.formattedTime
    findBooking.count = req.body.count
    findBooking.save()
    res.json({
        success: true
    })
})



app.listen("3000")