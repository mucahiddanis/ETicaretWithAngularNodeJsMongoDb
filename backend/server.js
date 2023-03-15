const connection = require("./database/database")
const express = require("express")
const cors = require("cors")
const { v4: uuidv4 } = require("uuid")
const User = require("./models/user")

// Routers
const authRouter = require("./routers/auth.router")

// For API requests
const app = express()

// JSON for api requests
app.use(express.json())

// Cors policy
app.use(cors())

// Db Connection
connection()

// Add Admin User
const createAdminUser = async () => {
    let userCount = await User.find({}).count()
    if (userCount == 0) {
        let newUser = new User({
            _id: uuidv4(),
            name: "Özge Vural Koca",
            userName: "ozgevuralkoca",
            email: "ozgevuralkoca@gmail.com",
            password: "1",
            mailConfirmCode: "000000",
            isMailConfirm: true,
            createdDate: Date.now(),
            isAdmin: true
        })
        await newUser.save();
    }
}
createAdminUser()

// Auth Router
app.use("/auth/", authRouter)

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Server is working.."))