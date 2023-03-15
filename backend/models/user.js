const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    _id: String,
    name: {
        type: String,
        required: true,
        minLength: [3, "It must be at least 3 characters."]
    },
    userName: {
        type: String,
        required: true,
        minLength: [3, "It must be at least 3 characters."],
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    imageUrl: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: true
    },
    mailConfirmCode: String,
    isMailConfirm: Boolean,
    createdDate: Date,
    updatedDate: Date,
    isAdmin: Boolean
})

const User = mongoose.model("User", userSchema)

module.exports = User;