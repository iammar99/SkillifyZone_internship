const express = require("express")
const app = express()
const cors = require("cors")
// ----------- Packages -----------
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const cookieParser = require("cookie-parser")
// ----------- Models -----------
const user = require("./Models/userModel")
const product = require("./Models/productModel")
const order = require("./Models/orderModel")
// ----------- ENV -----------
require('dotenv').config();
// ----------- Config -----------
const upload = require("./config/multerConfig")
const req = require("express/lib/request")





// ----------- MiddleWare -----------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET, POST, PUT, DELETE"],
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


app.get("/admin/viewProducts", async (req, res) => {
    try {
        const products = await product.find({})
        const productsWithImage = products.map(product => {
            const imgBase64 = product.img.toString('base64');
            const imgSrc = `data:image/png;base64,${imgBase64}`;

            return {
                ...product._doc,
                img: imgSrc,
            };
        });
        res.json({
            success: true,
            data: productsWithImage
        })
    } catch (error) {
        res.json({
            success: false,
            message: "Some Error Occured"
        })
        console.log(error)
    }
})

// For Home Page

app.get("/home/viewProducts/:category", async (req, res) => {
    try {
        const products = await product.find({ category: req.params.category })
        const productsWithImage = products.map(product => {
            const imgBase64 = product.img.toString('base64');
            const imgSrc = `data:image/png;base64,${imgBase64}`;

            return {
                ...product._doc,
                img: imgSrc,
            };
        });
        res.json({
            success: true,
            data: productsWithImage
        })
    } catch (error) {
        res.json({
            success: false,
            message: "Some Error Occured"
        })
        console.log(error)
    }
})

// For Other  Page

app.get("/viewProducts/:category", async (req, res) => {
    try {
        const products = await product.find({ category: req.params.category })
        const productsWithImage = products.map(product => {
            const imgBase64 = product.img.toString('base64');
            const imgSrc = `data:image/png;base64,${imgBase64}`;

            return {
                ...product._doc,
                img: imgSrc,
            };
        });
        res.json({
            success: true,
            data: productsWithImage
        })
    } catch (error) {
        res.json({
            success: false,
            message: "Some Error Occured"
        })
        console.log(error)
    }
})



app.get("/cart/get/:id", async (req, res) => {
    try {
        const foundUser = await user.findById(req.params.id).populate('cart')
        const productsWithImage = foundUser.cart.map(product => {
            const imgBase64 = product.img.toString('base64');
            const imgSrc = `data:image/png;base64,${imgBase64}`;

            return {
                ...product._doc,
                img: imgSrc,
            };
        });
        res.json({
            message: "Data Sent Successfully",
            data: productsWithImage
        })
    } catch (error) {
        res.json({
            message: "Something went wrong"
        })
    }
})



app.get("/cart/:user/remove/:id", async (req, res) => {
    try {
        const userFound = await user.findById(req.params.user)
        userFound.cart.splice(userFound.cart.indexOf(req.params.id), 1);
        userFound.save()
        res.json({
            message: "Removed from cart"
        })
    } catch (error) {
        console.log(error)
        res.json({
            message: "Something went wrong"
        })
    }
})


app.get("/profile/user/:id", async (req, res) => { 
    try {
        const userFound = await user.findById(req.params.id)
            .populate({
                path: 'orders',
                populate: {
                    path: 'items.id',
                    model: 'Product' 
                }
            });
            
        let userImgSrc = null;
        if (userFound.profileImg) {
            const imgBase64 = userFound.profileImg.toString('base64'); 
            userImgSrc = `data:image/png;base64,${imgBase64}`; 
        }

        const ordersWithImages = userFound.orders.map(order => {
            const itemsWithImages = order.items.map(orderItem => {
                let itemImgSrc = null;
                
                if (orderItem.id && orderItem.id.img) {
                    const imgBase64 = orderItem.id.img.toString('base64');
                    itemImgSrc = `data:image/png;base64,${imgBase64}`;
                }

                return {
                    ...orderItem._doc,
                    id: orderItem.id ? {
                        ...orderItem.id._doc,
                        img: itemImgSrc
                    } : orderItem.id
                };
            });

            return {
                ...order._doc,
                items: itemsWithImages
            };
        });

        const processedUser = {
            ...userFound._doc,
            orders: ordersWithImages
        };
        
        res.json({ 
            data: processedUser, 
            img: userImgSrc, 
            success: true, 
            message: "Data fetched successfully" 
        });
    } catch (error) {
        console.error(error);
        res.json({ 
            success: false, 
            message: "Something went wrong" 
        });
    } 
});


app.get("/navImage/user/:id", async (req, res) => {
    const userFound = await user.findById(req.params.id)
    const imgBase64 = userFound.profileImg.toString('base64');
    const imgSrc = `data:image/png;base64,${imgBase64}`;
    try {
        res.json({
            img: imgSrc,
            success: true,
            message: "Nothing went wrong"
        })
    } catch (error) {
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
            message: "No User Found with such Email Address"
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



app.post('/add-products', upload.single('img'), async (req, res) => {
    try {
        const { name, category, price, oldPrice, bg, panelBg, description } = req.body;
        const imgBuffer = req.file.buffer;

        console.log(req.file.buffer);
        const newProduct = await product.create({
            name,
            description,
            category,
            price,
            oldPrice: oldPrice || null,
            bg,
            panelBg,
            img: imgBuffer,
        });


        res.json({ success: true, message: 'Product added successfully', productId: newProduct._id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to upload product' });
    }
});


app.post("/add-to-cart", async (req, res) => {
    try {
        const foundUser = await user.findById(req.body.userid);
        foundUser.cart.push(req.body.productId)
        foundUser.save()
        res.json({
            message: "Added to cart"
        })
    } catch (error) {
        res.json({
            message: "Something went wrong"
        })
    }
})


app.post("/orders/create", async (req, res) => {
    try {
        const userNewData = req.body.billingInfo
        const orderCreated = await order.create(req.body)
        const userFound = await user.findById(req.body.userId)
        userFound.orders.push(orderCreated._id)
        userFound.firstName = userNewData.firstName
        userFound.lastName = userNewData.lastName
        userFound.contact = userNewData.phone
        userFound.address.address = userNewData.address
        userFound.address.city = userNewData.city
        userFound.address.state = userNewData.state
        userFound.address.zipCode = userNewData.zipCode
        userFound.address.country = userNewData.country
        userFound.cart = []
        userFound.save()
        res.json({
            success: true,
            message: "Order Done"
        })
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: "Something Went wrong"
        })
    }
})


app.post("/profile/:id/img", upload.single("profile"), async (req, res) => {
    try {
        // const imgBuffer = req.file.buffer;
        const userFound = await user.findById(req.params.id)
        userFound.profileImg = req.file.buffer
        userFound.save()
        res.json({
            success: true,
            message: "Nothing Went Wrong"
        })
    } catch (error) {
        console.error(error)
        res.json({
            success: false,
            message: "Something Went Wrong"
        })
    }
})


app.post("/profile/update/:id", async (req, res) => {
    try {
        const userFound = await user.findById(req.params.id)
        userFound.firstName = req.body.firstName,
            userFound.lastName = req.body.lastName,
            userFound.contact = req.body.contact,
            userFound.email = req.body.email
        userFound.save()
        res.json({
            success: true,
            message: "Profile Updated"
        })
    } catch (error) {
        res.json({
            success: false,
            message: "Somthing went wrong"
        })
    }
})


app.post("/profile/updatePassword/:id", async (req, res) => {
    try {
        const userFound = await user.findById(req.params.id)
        bcrypt.compare(req.body.oldPassword, userFound.password, function (err, result) {
            if (!result) {
                res.json({
                    success: false,
                    message: "Wrong old password"
                })
            } else {
                bcrypt.hash(req.body.newPassword, 10, function (err, hash) {
                    userFound.password = hash
                    userFound.save()
                });
                res.json({
                    success: true,
                    message: "Updated Password"
                })
            }
        });
    } catch (error) {
        res.json({
            success: false,
            message: "Something went Wrong"
        })
        console.log(error)
    }
})

app.listen("8000")