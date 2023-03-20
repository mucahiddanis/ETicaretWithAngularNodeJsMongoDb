const express = require("express")
const router = express.Router()
const { v4: uuidv4 } = require("uuid")
const User = require("../models/user")
const errorHandler = require("../services/error.service")

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
        let mailConfirmCode = createSixDigitCode()
        let checkMailConfirmCode = await User.find({ mailConfirmCode: mailConfirmCode })
        while (checkMailConfirmCode.length > 0) {
            mailConfirmCode = createSixDigitCode()
            checkMailConfirmCode = await User.find({ mailConfirmCode: mailConfirmCode })
        }
        newUser.mailConfirmCode = mailConfirmCode
        await newUser.save()
        sendConfirmMail(newUser)
        res.json({ message: "User registration created successfully. Your confirmation email has been sent." })
    } catch (error) {
        if (error.code == "11000") {
            errorHandler(res, { message: "email or username is invalid!" })
        } else {
            errorHandler(res, error)
        }
    }
})

// SixDigitCode
createSixDigitCode = () => {
    return Math.floor(Math.random() * 1000000);
}

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
                Valid the email.
            </a>
            <h4 style="text-align: center;"><i>Enjoy your shopping </i>😊</h4>
        </div>`
    )
    sendMail(mailOptions)
}

// Send Forgot Password Mail Function
sendForgotPasswordMail = (user) => {
    let mailOptions = new MailOptions(
        user.email,
        "Forgot Password Code",
        `<div style="border: 1px solid #5e5b5b88; padding: 30px;">
            <h1 style="text-align: center; border-bottom: 1px solid #0dcaf0; padding-bottom: 20px; font-family: cursive; font-weight: 400;">OVK COMMERCE</h1>
            <h2>To Reset Your Password:</h2>
            <h3>Welcome to OVK COMMERCE</h3>
            <p style="font-size: 20px; margin-bottom: 40px;">Please enter the code from the email into the corresponding field on the page that opens. Are you experiencing any problems? You can access the page by clicking on the 'Go to the Page' link.</p>
            <h2>Code: <span style="color:#0dcaf0">${user.forgotPasswordCode}</span></h2>
            <a href="http://localhost:4200/forgot-password/${user._id}/${user.forgotPasswordCode}" style="border-style: none; background: #0dcaf0; color: #fff; padding: 10px; border-radius: 5px; box-shadow: 1px 1px 5px #a19999c0; text-decoration: none; font-size: 20px; text-align: center;">
                Go to the page
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
            errorHandler(res, { "message": "User is not defined!" })
        } else {
            if (user.isMailConfirm) {
                errorHandler(res, { "message": "User is already valid!" })
            } else {
                user.isMailConfirm = true;
                const result = await User.findByIdAndUpdate(user._id, user)
                res.json({ message: "Email address has been successfully confirmed" })
            }
        }
    } catch (error) {
        errorHandler(res, error)
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
                errorHandler(res, { message: "User is not found." })
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
        errorHandler(res, error)
    }
})

// Login with Google
router.post("/googleLogin", async (req, res) => {
    try {
        const { email, id, name, photoUrl } = req.body
        let users = await User.find({ email: email })
        let mailConfirmCode = createSixDigitCode()
        let checkMailConfirmCode = await User.find({ mailConfirmCode: mailConfirmCode })
        while (checkMailConfirmCode.length > 0) {
            mailConfirmCode = createSixDigitCode()
            checkMailConfirmCode = await User.find({ mailConfirmCode: mailConfirmCode })
        }
        if (users.length == 0) {
            let user = new User({
                _id: uuidv4(),
                email: email,
                name: name,
                password: id,
                userName: email,
                createdDate: new Date(),
                imageUrl: photoUrl,
                isAdmin: false,
                isMailConfirm: true,
                mailConfirmCode: mailConfirmCode
            })

            await user.save()
            const payload = { user: user }
            res.json({ token: token(payload), user: user })

        } else {
            const payload = { user: users[0] }
            res.json({ token: token(payload), user: users[0] })
        }
    } catch (error) {
        errorHandler(res, error)
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
                res.status(401).json({ "message": "User is not defined!" })
            } else {
                if (users[0].isMailConfirm) {
                    res.status(401).json({ "message": "Email is already confirm!" })
                } else {
                    sendConfirmMail(users[0])
                    res.json({ message: "Your confirmation email has been successfully sent!" })
                }
            }
        } else {
            if (users[0].isMailConfirm) {
                res.status(401).json({ "message": "Email is already confirm!" })
            } else {
                sendConfirmMail(users[0])
                res.json({ message: "Your confirmation email has been successfully sent!" })
            }
        }
    } catch (error) {
        errorHandler(res, error)
    }
})

// Forgot Password
router.post("/forgotPassword", async (req, res) => {
    try {
        const { emailOrUserName } = req.body
        var users = await User.find({ email: emailOrUserName })
        if (users.length == 0) {
            users = await User.find({ userName: emailOrUserName })
            if (users.length == 0) {
                res.status(401).json({ "message": "User is not defined!" })
            } else {
                users[0].forgotPasswordCode = createSixDigitCode()
                users[0].isForgotPasswordCodeActive = true
                await User.findByIdAndUpdate(users[0]._id, users[0])
                sendForgotPasswordMail(users[0])
                res.json({ _id: users[0]._id })
            }
        } else {
            users[0].forgotPasswordCode = createSixDigitCode()
            users[0].isForgotPasswordCodeActive = true
            await User.findByIdAndUpdate(users[0]._id, users[0])
            sendForgotPasswordMail(users[0])
            res.json({ _id: users[0]._id })
        }
    } catch (error) {
        errorHandler(res, error)
    }
})

// Refresh Password
router.post("/refreshPassword", async (req, res) => {
    try {
        const { _id, code, newPassword } = req.body
        let users = await User.find({ _id: _id, forgotPasswordCode: code })
        if (users.length == 0) {
            res.status(401).json({ "message": "User is not defined!" })
        } else {
            if (!users[0].isForgotPasswordCodeActive) {
                res.status(401).json({ "message": "Invalid code!" })
            } else {
                users[0].password = newPassword
                users[0].isForgotPasswordCodeActive = false
                await User.findByIdAndUpdate(_id, users[0])
                res.json({ message: "Your password has been successfully changed." })
            }
        }
    } catch (error) {
        errorHandler(res, error)
    }
})

module.exports = router