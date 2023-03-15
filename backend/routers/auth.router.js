const express = require("express")
const router = express.Router()
const { v4: uuidv4 } = require("uuid")
const User = require("../models/user")

const upload = require("../services/file.service")
const token = require("../services/token.service")
const sendMail = require("../services/mail.service")
const MailOptions = require("../dtos/mail")

// Register
router.post("/register", upload.single("image"), async (req, res) => {
    const newUser = new User(req.body)
    newUser.createdDate = Date.now()
    newUser._id = uuidv4()
    newUser.imageUrl = req.file.path
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
        `<h1 style="text-align: center; color: #ec3d08;">-ÖVK COMMERCE-</h1>
            <div style="border: 1px solid #5e5b5b88; padding: 30px;">
            <h3>Congrulations!</h3>
            <h3>Welcome the ÖVK Commerce</h3>
            <p style="font-size: 20px;">To complete your sign up, you are simply click on the link provided in this email. Our application is completely free of charge and we hope you enjoy using it. </p>
            <a href="http://localhost:4200/auth/confirmMail/${user.mailConfirmCode}" style="border-style: none; background: #ec3d08; color: #fff; padding: 10px; border-radius: 5px; box-shadow: 1px 1px 3px #a19999c0;">Mail Adresimi Onayla</a>
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
                res.status(400).json({ "message": "User is valid!" })
            } else {
                user.isMailConfirm = true;
                const result = await User.findOneAndUpdate(user)
                res.json({ result: result })
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
router.post("/send-confirm-mail", async (req, res) => {
    try {
        const { email } = req.body
        let user = await User.find({ email: email })
        if (user[0].length == 0) {
            res.status(400).json({ "message": "User is not defined!" })
        } else {
            if (user[0].isMailConfirm) {
                res.status(400).json({ "message": "Email is already confirm!" })
            } else {
                sendConfirmMail(user[0])
                res.json({ message: "Your confirmation email has been successfully sent!" })
            }
        }
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

module.exports = router