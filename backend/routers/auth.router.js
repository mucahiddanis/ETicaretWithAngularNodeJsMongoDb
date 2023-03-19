const express = require("express")
const router = express.Router()
const { v4: uuidv4 } = require("uuid")
const User = require("../models/user")

const upload = require("../services/file.service")
const token = require("../services/token.service")
const sendMail = require("../services/mail.service")
const MailOptions = require("../dtos/mail")

// Register
router.post("/register", async (req, res) => {
    const newUser = new User(req.body)
    
    newUser.createdDate = Date.now()
    newUser._id = uuidv4()
    newUser.isMailConfirm = false
    try {
        let mailConfirmCode = Math.floor(Math.random() * 1000000)
        let checkMailConfirmCode = await User.find({ mailConfirmCode: mailConfirmCode })
        while (checkMailConfirmCode.length > 0) {
            mailConfirmCode = Math.floor(Math.random() * 1000000);
            checkMailConfirmCode = await User.find({ mailConfirmCode: mailConfirmCode })
        }
        newUser.mailConfirmCode = mailConfirmCode
        await newUser.save()
        sendConfirmMail(newUser)
        res.json({ message: "User registration created successfully. Your confirmation email has been sent." })
    } catch (error) {
        if (error.code == "11000") {
            res.status(400).json({ message: "email or username is invalid!" })
        } else {
            res.status(400).json({ message: error.message })
        }
    }
})

// send confirm mail function
sendConfirmMail = (user) => {
    let mailOptions = new MailOptions(
        user.email,
        "Mail Onayı",
        `<div style="border: 1px solid #5e5b5b88; padding: 30px;">
            <h1 style="text-align: center; border-bottom: 1px solid #0dcaf0; padding-bottom: 20px; font-family: cursive; font-weight: 400;">OVK COMMERCE</h1>
            <h2>Congrulations!</h2>
            <h3>Welcome to OVK COMMERCE</h3>
            <p style="font-size: 20px; margin-bottom: 40px;">To complete your sign up, you are simply click on the button provided in this
                email. Our application is completely free of charge and we hope you enjoy using it. </p>
            <a
            href="http://localhost:4200/confirmMail/${user.mailConfirmCode}"
            style="border-style: none; background: #0dcaf0; color: #fff; padding: 10px; border-radius: 5px; box-shadow: 1px 1px 5px #a19999c0; text-decoration: none; font-size: 20px; text-align: center;">
                Mail Adresimi Onayla
            </a>
            <h4 style="text-align: center;"><i>Enjoy your shopping </i>😊</h4>
        </div>`
    )
    sendMail(mailOptions)
}

// Email Confirm
router.post("/confirm-mail", async (req, res) => {
    const { code } = req.body

    try {
        const user = await User.findOne({ mailConfirmCode: code })
        if (user == null) {
            res.status(400).json({ "message": "User is not defined!" })
        } else {
            if (user.isMailConfirm) {
                res.status(400).json({ "message": "User is already valid!" })
            } else {
                user.isMailConfirm = true;
                const result = await User.findOneAndUpdate(user)
                res.json({ message: "Email address has been successfully confirmed" })
            }
        }
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

// Login
router.post("/login", async (req, res) => {
    try {
        const { emailOrUserName, password } = req.body
        var user = await User.find({ email: emailOrUserName })
        if (user.length == 0) {
            var user = await User.find({ userName: emailOrUserName })
            if (user.length == 0) {
                res.status(401).json({ message: "User is not found." })
            } else {
                if (user[0].password == password) {
                    if (user[0].isMailConfirm) {
                        const payload = { user: user[0] }
                        res.json({ token: token(payload), user: user[0] })
                    } else {
                        res.status(401).json({ message: "Email is not confirm! Confirm your mail for login." })
                    }
                } else {
                    res.status(401).json({ message: "Password is wrong!" })
                }
            }
        } else {
            if (user[0].password == password) {
                if (user[0].isMailConfirm) {
                    const payload = { user: user[0] }
                    res.json({ token: token(payload), user: user[0] })
                } else {
                    res.status(401).json({ message: "Email is not confirm! Confirm your mail for login." })
                }
            } else {
                res.status(401).json({ message: "Password is wrong!" })
            }
        }
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

// Send Confirm Email
router.post("/sendConfirmMail", async (req, res) => {
    try {
        const { emailOrUserName } = req.body

        let users = await User.find({ email: emailOrUserName })
        if (users.length == 0) {
            users = await User.find({ userName: emailOrUserName })
            if (users.length == 0) {
                res.status(400).json({ "message": "User is not defined!" })
            } else {
                if (users[0].isMailConfirm) {
                    res.status(400).json({ "message": "Email is already confirm!" })
                } else {
                    sendConfirmMail(users[0])
                    res.json({ message: "Your confirmation email has been successfully sent!" })
                }
            }
        } else {
            if (users[0].isMailConfirm) {
                res.status(400).json({ "message": "Email is already confirm!" })
            } else {
                sendConfirmMail(users[0])
                res.json({ message: "Your confirmation email has been successfully sent!" })
            }
        }
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

module.exports = router