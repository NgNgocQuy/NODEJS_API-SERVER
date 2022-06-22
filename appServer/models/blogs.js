const mongoose = require("mongoose")

let blogSchema = mongoose.Schema({
    image: String,
    dicription: String,
    title: String,
    dateUpdate: Date
})

module.exports = mongoose.model("blogs", blogSchema);   