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
            fs.unlink(image.path, () => { })
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
        const { _id } = req.body
        let product = await Product.findById(_id)
        product.isActive = !product.isActive
        await Product.findByIdAndUpdate(_id, product)
        res.json({ message: "Changed product active state." })
    } catch (error) {
        errorHandler(res, error)
    }
})

//Get Product with Id
router.post("/getById", async (req, res) => {
    try {
        const { _id } = req.body;
        let product = await Product.findById(_id);
        res.json(product);
    } catch (error) {
        errorHandler(res, error)
    }
});

// Update Product
router.post("/update", upload.array("images"), async (req, res) => {
    try {
        const { _id, name, description, stock, price, categories } = req.body
        let product = await Product.findById(_id)
        for (const image of product.imageUrls) {
            fs.unlink(image.path, () => { })
        }
        let imageUrls = [...product.imageUrls, ...req.files]
        product = {
            name: name.toLowerCase(),
            description: description,
            stock: stock,
            price: price,
            imageUrls: imageUrls,
            categories: categories,
            updatedDate: new Date()
        }
        await Product.findByIdAndUpdate(_id, product)
        res.json({ message: "Product updated successfully!" })
    } catch (error) {
        errorHandler(res, error)
    }
})

// Delete Product Image
router.post("/removeImageByProductIdAndIndex", async (req, res) => {
    try {
        const { _id, index } = req.body;
        let product = await Product.findById(_id);
        if (product.imageUrls.length == 1) {
            res.status(500).json({message: "Last product image cannot be deleted!"})
        } else {
            let image = product.imageUrls[index]
            product.imageUrls.splice(index, 1)
            await Product.findByIdAndUpdate(_id, product)
            fs.unlink(image.path, () => { })
            res.json({message: "Picture was deleted successfully"})
        }
    } catch (error) {
        errorHandler(res, error)
    }
});

module.exports = router