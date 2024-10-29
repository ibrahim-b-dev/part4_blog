const { describe, test, beforeEach, after } = require("node:test")
const assert = require("node:assert")
const mongoose = require("mongoose")
const app = require("../app")
const supertest = require("supertest")
const User = require("../models/user")
const helper = require("./test_helper")

const api = supertest(app)

describe("user", () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const userObjects = helper.initialUsers.map((user) => new User(user))
    const promiseArray = userObjects.map((user) => user.save())
    await Promise.all(promiseArray)
  })

  test("should create a new user successfully with valid username and password", async () => {
    const usersAtStart = await helper.usersInDb()

    const validUser = {
      username: "medo",
      name: "ahmed",
      password: "123",
    }

    await api
      .post("/api/users")
      .send(validUser)
      .expect(201)
      .expect("Content-Type", /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)
  })

  test("should return 400 and an error message if username is missing", async () => {
    const usersAtStart = await helper.usersInDb()

    const inValidUser = {
      name: "ahmed",
      password: "123",
    }

    const result = await api.post("/api/users").send(inValidUser).expect(400)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    assert(result.body.error.includes("username is required"))
  })

  test("should return 400 and an error message if password is missing", async () => {
    const usersAtStart = await helper.usersInDb()

    const inValidUser = {
      username: "medo",
      name: "ahmed",
    }

    const result = await api.post("/api/users").send(inValidUser).expect(400)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    assert(result.body.error.includes("password is required"))
  })

  test("should return 400 and an error message if username is less than 3 characters", async () => {
    const usersAtStart = await helper.usersInDb()

    const inValidUser = {
      username: "me",
      name: "ahmed",
      password: "123",
    }

    const result = await api.post("/api/users").send(inValidUser).expect(400)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    assert(
      result.body.error.includes("Username must be at least 3 characters long")
    )
  })

  test("should return 400 and an error message if password is less than 3 characters", async () => {
    const usersAtStart = await helper.usersInDb()

    const inValidUser = {
      username: "medo",
      name: "ahmed",
      password: "12",
    }

    const result = await api.post("/api/users").send(inValidUser).expect(400)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    assert(
      result.body.error.includes("password must be at least 3 characters long")
    )
  })

  test("should return 400 and an error message if username is not unique", async () => {
    const usersAtStart = await helper.usersInDb()
    const newUser = helper.initialUsers[0]

    const result = await api.post("/api/users").send(newUser).expect(400)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    assert(result.body.error.includes("expected `username` to be unique"))
  })
})

after(async () => {
  await mongoose.connection.close()
})
