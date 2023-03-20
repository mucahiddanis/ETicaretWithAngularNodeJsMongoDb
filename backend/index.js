const connection = require("./database/database")
const express = require("express")
const cors = require("cors")
const createAdminUser = require("./options/configurations")

// Routers
const authRouter = require("./routers/auth.router")
const categoryRouter = require("./routers/category.router")

// For API requests
const app = express()

// JSON for api requests
app.use(express.json())

// Cors policy
app.use(cors())

// Db Connection
connection()

// Add Admin User
createAdminUser()

// Auth Router
app.use("/api/auth/", authRouter)

// Category Router
app.use("/api/categories/", categoryRouter)

// Listen Port
const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Server is working.."))