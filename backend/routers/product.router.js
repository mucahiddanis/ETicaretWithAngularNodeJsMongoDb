const express = require("express")
const router = express.Router()
const Product = require("../models/product")
const upload = require("../services/file.service")
const errorHandler = require("../services/error.service")
const { v4: uuidv4 } = require("uuid")

// Add Product
router.post("/add", upload.array("image"), async (req,res) => {
    try {
        const {name, description, stock, price, categories} = req.body
        const productId = uuidv4()
        let product = new Product ({
            _id: productId,
            name: name,
            description: description,
            stock: stock,
            price: price,
            imageUrls: req.files,
            categories: categories
        })
        await product.save()
        res.json({message: "Product registration completed successfully!"})
    } catch (error) {
        errorHandler(res, error)
    }
})

module.exports = router