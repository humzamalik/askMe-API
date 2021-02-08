const cors = require('cors')
const morgan = require("morgan")
const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require('body-parser')
const routes = require('./api/routes/index')

const app = express()

const questionRoutes = require("./api/routes/questions")
const answerRoutes = require("./api/routes/answers")
const userRoutes = require("./api/routes/user")

mongoose.connect(
    "mongodb+srv://askme:askme@cluster0.seskr.mongodb.net/main?retryWrites=true&w=majority", {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
)

// app.use(morgan("dev"))

app.use("/media", express.static("media"))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(cors())

app.use("/", routes)

app.use((req, res, next) => {
    const err = new Error("Not Found")
    err.status = 404
    next(err)
})

app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        message: err.message,
        code: err.status
    })
})

module.exports = app