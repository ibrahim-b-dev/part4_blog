const mongoose = require("mongoose")

const args = process.argv.slice(2)

const url = (password) => "mongodb://127.0.0.1:27017/BlogApp"
// `mongodb+srv://ibrahimdev:${password}@datanode.ca6dc.mongodb.net/BlogListApp?retryWrites=true&w=majority&appName=DataNode`

mongoose.set("strictQuery", false)

// config
const config = {
  connectTimeoutMS: 20000,
  serverSelectionTimeoutMS: 20000,
}

// schema
const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
})

// model
const Blog = mongoose.model("Blog", blogSchema)

if (args.length === 4) {
  const [password, title, author, content] = args
  mongoose.connect(url(password), config)

  const blog = new Blog({
    title,
    author,
    content,
    url: `http://someurl.com/${title}`,
    likes: 5,
  })

  blog.save().then((result) => {
    console.log("blog saved")
    mongoose.connection.close()
  })
} else if (args.length === 1) {
  const [password] = args
  mongoose.connect(url(password), config)

  Blog.find({}).then((result) => {
    console.log("Blog List:")
    result.forEach((p) => {
      console.log(`${p.title} by ${p.id}`)
    })
    mongoose.connection.close()
  })
} else {
  console.log("Invalid number of arguments.")
  process.exit(1)
}
