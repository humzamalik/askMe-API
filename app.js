const express = require("express")
const morgan = require("morgan")
const bodyParser = require('body-parser')
const mongoose = require("mongoose")

const app = express()

const questionRoutes = require("./api/routes/questions")
const answerRoutes = require("./api/routes/answers")

mongoose.connect(
    "mongodb+srv://askme:askme@cluster0.seskr.mongodb.net/main?retryWrites=true&w=majority", {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
)

// app.use(morgan("dev"))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
    if (req.method === 'OPTIONS') {
        res.header(
            "Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET"
        )
        return res.status(200).json({})
    }
    next()
})

app.use("/questions", questionRoutes)
app.use("/answers", answerRoutes)

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