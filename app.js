import cors from 'cors'
import dotenv from "dotenv"
import morgan from "morgan"
import express from "express"
import mongoose from "mongoose"
import routes from './api/routes'
import bodyParser from 'body-parser'

dotenv.config()

const app = express()
const port = process.env.PORT || 3000

mongoose.connect(
    process.env.DATABASE_URL, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
)

app.use(morgan("dev"))

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

app.listen(port)