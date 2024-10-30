const { describe, test, beforeEach, after } = require("node:test")
const assert = require("node:assert")
const mongoose = require("mongoose")
const app = require("../app")
const supertest = require("supertest")
const Blog = require("../models/blog")
const User = require("../models/user")
const helper = require("./test_helper")

const api = supertest(app)

describe("blogs", () => {
  let token

  beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    const newUser = {
      username: "testuser",
      name: "Test User",
      password: "123",
    }

    const createdUser = await api.post("/api/users").send(newUser)

    const response = await api
      .post("/api/login")
      .send({ username: newUser.username, password: newUser.password })

    token = response.body.token

    const blogObjects = helper.initialBlogs.map((blog) => {
      return new Blog({
        ...blog,
        user: createdUser.body.id,
      })
    })

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

  test("should be saved correctly to the database", async () => {
    const newBlog = {
      title: "Learn Express.js",
      author: "Ibrahim Dev",
      url: "https://localhost.com/learn_express",
      likes: 7,
    }

    const blogs = await helper.blogsInDb()

    const response = await api
      .post("/api/blogs")
      .set({ Authorization: `Bearer ${token}` })
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/)

    const updatedBlogs = await helper.blogsInDb()
    assert.strictEqual(updatedBlogs.length, blogs.length + 1)
    const authors = updatedBlogs.map((b) => b.author)
    assert(authors.includes("Ibrahim Dev"))

    assert.strictEqual(response.body.title, newBlog.title)
  })

  test("should default 'likes' to 0 if the property is missing from the request", async () => {
    const blog = {
      title: "Learn Express.js",
      author: "Ibrahim Dev",
      url: "https://localhost.com/learn_express",
    }

    const blogsAtStart = await helper.blogsInDb()

    await api
      .post("/api/blogs")
      .set({ Authorization: `Bearer ${token}` })
      .send(blog)
      .expect(201)
      .expect("Content-Type", /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtStart.length + 1, blogsAtEnd.length)

    const createdBlog = blogsAtEnd.filter((b) => blog.author === b.author)[0]
    assert.strictEqual(blog.author, createdBlog.author)
    assert.strictEqual(blog.likes, undefined)
    assert.strictEqual(createdBlog.likes, 0)
    assert.notEqual(blog.likes, createdBlog.likes)
  })

  test("should respond with 400 Bad Request if 'title' is missing from the request", async () => {
    const blog = {
      author: "Ibrahim Dev",
      url: "https://localhost.com/learn_express",
    }

    await api
      .post("/api/blogs")
      .set({ Authorization: `Bearer ${token}` })
      .send(blog)
      .expect(400)
  })

  test("should respond with 400 Bad Request if 'url' is missing from the request", async () => {
    const blog = {
      title: "Learn Express.js",
      author: "Ibrahim Dev",
    }

    await api
      .post("/api/blogs")
      .set({ Authorization: `Bearer ${token}` })
      .send(blog)
      .expect(400)
  })

  test("should be deleted with status code 204 ", async () => {
    const blogsAtStart = await helper.blogsInDb()
    const deletedBlog = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${deletedBlog.id}`)
      .set({ Authorization: `Bearer ${token}` })
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)

    const blog = blogsAtEnd.find((b) => b.id === deletedBlog.id)
    assert.strictEqual(blog, undefined)
  })

  test("should update the number of likes for a blog post if authorized", async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const updatedLikes = blogToUpdate.likes + 1

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ likes: updatedLikes })
      .expect(200)

    assert.strictEqual(response.body.likes, updatedLikes)

    const blogsAtEnd = await helper.blogsInDb()
    const updatedBlog = blogsAtEnd.find((b) => b.id === blogToUpdate.id)

    assert.strictEqual(updatedBlog.likes, updatedLikes)
  })

  test("should fail with 401 Unauthorized if no token is provided", async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const updatedLikes = blogToUpdate.likes + 1

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send({ likes: updatedLikes })
      .expect(401)
  })

  test("create blog fails with status code 401 Unauthorized if token is missing", async function () {
    const newBlog = {
      title: "Unauthorized Blog",
      author: "Test Author",
      url: "http://example.com",
      likes: 5,
    }

    const response = await api.post("/api/blogs").send(newBlog).expect(401)

    assert.strictEqual(response.body.error, "token invalid")
  })
})

after(async () => {
  await mongoose.connection.close()
})
