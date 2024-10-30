const https = require("node:https")
const fs = require("node:fs")
const app = require("./app") // The Express app
const config = require("./utils/config")
const logger = require("./utils/logger")

const options = {
  key: fs.readFileSync("./cert/key.pem"),
  cert: fs.readFileSync("./cert/cert.pem"),
}

https.createServer(options, app).listen(config.PORT, () => {
  logger.info(`Server running securely on port ${config.PORT}`)
})
