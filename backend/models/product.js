const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
    _id: String,
    name: String,
    description: String,
    imageUrls: Array,
    stock: Number,
    categories: [{type: String, ref: 'Category'}],
    price: Number,
    createdDate: Date,
    updatedDate: Date,
    isActive: Boolean
})

const Product = mongoose.model("Product", productSchema)

module.exports = Product