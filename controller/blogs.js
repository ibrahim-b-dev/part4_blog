const blogsRouter = require("express").Router()
const Blog = require("../models/blog")
const User = require("../models/user")
const middleware = require("../utils/middleware")

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", {
    username: 1,
    name: 1,
    id: 1,
  })
  response.json(blogs)
})

blogsRouter.get("/:id", async (request, response) => {
  const blog = await Blog.findById(request.params.id).populate("user", {
    username: 1,
    name: 1,
    id: 1,
  })
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

blogsRouter.post("/", middleware.userExtractor, async (request, response) => {
  const body = request.body

  if (
    body.title === undefined ||
    body.author === undefined ||
    body.url === undefined
  ) {
    return response.status(400).json({
      error: "title, author and url are required",
    })
  }

  const user = await User.findById(request.user.id)

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id,
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.delete("/:id", middleware.userExtractor, async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404).json({ error: "blog not found" })
  }

  if (!request.token) {
    return response.status(401).json({ error: "token required" })
  }

  if (blog.user.toString() !== request.user.id) {
    return response
      .status(403)
      .json({ error: "not authorized to delete this blog" })
  }

  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogsRouter.put("/:id", async (request, response) => {
  const { likes } = request.body

  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    { likes },
    { new: true, runValidators: true }
  )

  if (updatedBlog) {
    response.json(updatedBlog)
  } else {
    response.status(404).json({ error: "Blog not found" })
  }
})

module.exports = blogsRouter
