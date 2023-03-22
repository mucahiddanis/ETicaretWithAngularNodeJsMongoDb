const express = require("express")
const router = express.Router()
const Category = require("../models/category")
const { v4: uuidv4 } = require("uuid")
const errorHandler = require("../services/error.service")
const Product = require("../models/product")

// Category List
router.get("/getAll", async (req, res) => {
    try {
        const categories = await Category.find({}).sort({ name: 1 })
        res.json(categories)
    } catch (error) {
        errorHandler(res, error)
    }
})

// Add Category
router.post("/add", async (req, res) => {
    try {
        const { name } = req.body
        let category = new Category({
            _id: uuidv4(),
            name: name.toLowerCase(),
            createdDate: new Date()
        })
        await category.save()
        res.json({ message: "category registration successful!" })
    } catch (error) {
        errorHandler(res, error)
    }
})

// Delete Category
router.post("/removeById", async (req, res) => {
    try {
        const { _id } = req.body
        const result = await Product.find({ categories: _id })
        if (result.length > 0) {
            res.status(500).json({
                message: "There are products registered in the category!"
            })
        } else {
            await Category.findByIdAndRemove(_id)
            res.json({ message: "Category has been deleted." })
        }
    } catch (error) {
        errorHandler(res, error)
    }
})

// Update Category
router.post("/update", async (req, res) => {
    try {
        const { _id, name } = req.body
        const category = await Category.findById(_id)
        category.name = name
        await Category.findByIdAndUpdate(_id, category)
        res.json({ message: "Category has been updated." })
    } catch (error) {

    }
})

module.exports = router