const { describe, test, beforeEach, after } = require("node:test")
const assert = require("node:assert")
const mongoose = require("mongoose")
const app = require("../app")
const supertest = require("supertest")
const Blog = require("../models/blog")
const helper = require("./test_helper")

const api = supertest(app)

describe("blogs", () => {
  beforeEach(async () => {
    await Blog.deleteMany({})

    const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog))
    const promiseArray = blogObjects.map((blog) => blog.save())
    await Promise.all(promiseArray)
  })

  test("are return as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/)
  })

  test("returns the correct amount of blog posts", async () => {
    const blogs = await helper.blogsInDb()

    assert.strictEqual(blogs.length, helper.initialBlogs.length)
  })

  test("should have a unique identifier property named 'id' instead of '_id'", async () => {
    const blogs = await helper.blogsInDb()

    assert.ok(blogs[0].id, "Expected 'id' property to be present")
    assert.strictEqual(blogs[0]._id, undefined)
  })
})

after(async () => {
  await mongoose.connection.close()
})
