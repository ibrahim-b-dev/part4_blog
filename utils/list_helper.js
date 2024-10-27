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
    const result = current.likes >= prev.likes
      ? { ...current }
      : prev

    return result
  })
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
}
