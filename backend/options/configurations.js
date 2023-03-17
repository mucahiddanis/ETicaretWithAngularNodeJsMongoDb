const User = require("../models/user")
const { v4: uuidv4 } = require("uuid")

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
            isAdmin: true,
            forgotPasswordCode: "000000",
            isForgotPasswordCodeActive: false
        })
        await newUser.save();
    }
}

module.exports = createAdminUser