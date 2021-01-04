const mongoose = require("mongoose")

const questionSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    query: String,
    askedBy: String,
    // i'll add timestamp and other things later
})

module.exports = mongoose.model("Question", questionSchema)