const bcrypt = require("bcrypt")
const usersRouter = require("express").Router()
const User = require("../models/user")

usersRouter.get("/", async (request, response) => {
  const users = await User.find({})
  response.json(users)
})

usersRouter.get("/:id", async (request, response) => {
  const user = await User.findById(request.params.id)
  if (user) {
    response.json(user)
  } else {
    response.status(404).end()
  }
})

usersRouter.post("/", async (request, response) => {
  const { username, name, password } = request.body

  if (!password) {
    return response.status(400).json({ error: "password is required" })
  }

  if (password.length < 3) {
    return response.status(400).json({
      error: "password must be at least 3 characters long",
    })
  }

  const passwordHash = await bcrypt.hash(password, 10)

  const user = new User({
    username,
    name: name || "",
    passwordHash,
  })

  const savedUser = await user.save()
  response.status(201).json(savedUser)
})

module.exports = usersRouter