const _ = require("lodash")

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  // prev, current
  const reducer = (sumOfLikes, blog) => {
    return sumOfLikes + blog.likes
  }

  return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  return blogs.reduce((prev, current) => {
    const result = current.likes >= prev.likes ? { ...current } : prev

    return result
  })
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null

  const blogsByAuthor = _.countBy(blogs, "author")
  const topAuthor = _.maxBy(
    Object.keys(blogsByAuthor),
    (author) => blogsByAuthor[author]
  )

  return {
    author: topAuthor,
    blogs: blogsByAuthor[topAuthor],
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
}
