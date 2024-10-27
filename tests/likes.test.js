const { test, describe } = require("node:test")
const assert = require("assert")

const listHelper = require("../utils/list_helper")

const listWithOneBlog = [
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
    likes: 5,
    __v: 0,
  },
]

const bigBlogList = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0,
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0,
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0,
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "use node testing framework",
    author: "ibraim",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 10,
    __v: 0,
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0,
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0,
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0,
  },
]

describe("total likes", () => {
  test("of empty list is zero", () => {
    const result = listHelper.totalLikes([])
    assert.strictEqual(result, 0)
  })

  test("when list has only one blog, equals the likes of that", () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })

  test("of a bigger list is calculated right", () => {
    const result = listHelper.totalLikes(bigBlogList)
    assert.strictEqual(result, 46)
  })
})

describe("favoriteBlog", () => {
  test("returns the blog with the most likes", () => {
    const result = listHelper.favoriteBlog(bigBlogList)
    const currentItem = bigBlogList[2]

    assert(
      result.likes >= currentItem.likes,
      `Expected ${result.likes} to be equal or greater than ${currentItem.likes}`
    )
  })
})

describe("mostBlogs", () => {
  test("should return null for an empty array", () => {
    const blogs = []
    const result = listHelper.mostBlogs(blogs)
    assert.strictEqual(result, null)
  })

  test("should return the author with the most blogs from a list", () => {
    const result = listHelper.mostBlogs(bigBlogList)
    assert.deepStrictEqual(result, { author: "Robert C. Martin", blogs: 3 })
  })
})

describe("mostLikes", () => {
  test("should return null for an empty array", () => {
    const result = listHelper.mostLikes([])
    assert.strictEqual(result, null)
  })

  test("should return the only author if there is only one blog", () => {
    const blogs = [
      {
        author: "Edsger W. Dijkstra",
        title: "A Discipline of Programming",
        likes: 15,
      },
    ]
    const result = listHelper.mostLikes(blogs)
    assert.deepStrictEqual(result, { author: "Edsger W. Dijkstra", likes: 15 })
  })

  test("should return the author with the most likes when multiple authors have blogs", () => {
    const blogs = [
      {
        author: "Edsger W. Dijkstra",
        title: "A Discipline of Programming",
        likes: 15,
      },
      { author: "Robert C. Martin", title: "Clean Code", likes: 10 },
      { author: "Robert C. Martin", title: "Agile Principles", likes: 8 },
      {
        author: "Edsger W. Dijkstra",
        title: "Go To Statement Considered Harmful",
        likes: 5,
      },
      { author: "Michael Chan", title: "React Patterns", likes: 7 },
    ]
    const result = listHelper.mostLikes(blogs)
    assert.deepStrictEqual(result, { author: "Edsger W. Dijkstra", likes: 20 })
  })

  test("should return any one of the top authors if multiple authors have the same total likes", () => {
    const blogs = [
      {
        author: "Edsger W. Dijkstra",
        title: "A Discipline of Programming",
        likes: 10,
      },
      { author: "Robert C. Martin", title: "Clean Code", likes: 10 },
    ]
    const result = listHelper.mostLikes(blogs)
    const validResults = [
      { author: "Edsger W. Dijkstra", likes: 10 },
      { author: "Robert C. Martin", likes: 10 },
    ]

    assert.ok(
      validResults.some(
        (validResult) =>
          validResult.author === result.author &&
          validResult.likes === result.likes
      )
    )
  })
})
