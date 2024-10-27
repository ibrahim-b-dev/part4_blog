const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sumOfLikes, blog) => {
    return sumOfLikes + blog.likes
  }

  return blogs.reduce(reducer, 0)
}

module.exports = {
  dummy,
  totalLikes
}
