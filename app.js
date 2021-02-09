const cors = require('cors')
const morgan = require("morgan")
const express = require("express")
const mongoose = require("mongoose")
const routes = require('./api/routes')
const bodyParser = require('body-parser')

const app = express()

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

app.use("/api", routes)

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