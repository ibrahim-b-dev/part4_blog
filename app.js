// eslint-disable-next-line no-unused-vars
const config = require("./utils/config")
const express = require("express")
require("express-async-errors")
const cors = require("cors")

const connectToDatabase = require("./utils/database")
const loginRouter = require("./controller/login")
const usersRouter = require("./controller/users")
const blogsRouter = require("./controller/blogs")
const middleware = require("./utils/middleware")

// Initialize the app
const app = express()

// Database connection
connectToDatabase()

// Middleware and routes
app.use(cors())
app.use(express.static("dist"))
app.use(express.json())
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)

app.use("/api/login", loginRouter)
app.use("/api/users", usersRouter)
app.use("/api/blogs", blogsRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
