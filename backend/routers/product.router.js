const express = require("express")
const router = express.Router()
const Product = require("../models/product")
const upload = require("../services/file.service")
const errorHandler = require("../services/error.service")
const { v4: uuidv4 } = require("uuid")
const fs = require("fs")

// Add Product
router.post("/add", upload.array("images"), async (req, res) => {
    try {
        const { name, description, stock, price, categories } = req.body
        const productId = uuidv4()
        let product = new Product({
            _id: productId,
            name: name.toLowerCase(),
            description: description,
            stock: stock,
            price: price,
            imageUrls: req.files,
            categories: categories,
            isActive: true,
            createdDate: new Date()
        })
        await product.save()
        res.json({ message: "Product registration completed successfully!" })
    } catch (error) {
        errorHandler(res, error)
    }
})

// Get Product List
router.get("/", async (req, res) => {
    try {
        let products = await Product.find().sort({ name: 1 }).populate("categories")
        res.json(products)
    } catch (error) {
        errorHandler(res, error)
    }
})

// Delete Product
router.post("/removeById", async (req, res) => {
    try {
        const { _id } = req.body
        const product = await Product.findById(_id)
        for (const image of product.imageUrls) {
            fs.unlink(image.path, () => {

            })
        }
        await Product.findByIdAndRemove(_id)
        res.json({ message: "Product has been successfully deleted!" })
    } catch (error) {
        errorHandler(res, error)
    }
})

// Change Active
router.post("/changeActive", async (req, res) => {
    try {
        const {_id} = req.body
        let product = await Product.findById(_id)
        product.isActive = !product.isActive
        await Product.findByIdAndUpdate(_id, product)
        res.json({message: "Changed product active state."})
    } catch (error) {
        errorHandler(res, error)
    }
})

module.exports = router