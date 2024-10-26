const mongoose = require("mongoose")
const config = require("./config")
const logger = require("./logger")

const options = {
  connectTimeoutMS: 20000,
  serverSelectionTimeoutMS: 20000,
}

mongoose.set("strictQuery", false)
const connectToDatabase = async () => {
  try {
    logger.info("connecting to", config.MONGODB_URL)
    await mongoose.connect(config.MONGODB_URL, options)
    logger.info("connected to", config.MONGODB_URL)
  } catch (error) {
    logger.error("error connecting to MongoDB:", error.message)
  }
}

module.exports = connectToDatabase
