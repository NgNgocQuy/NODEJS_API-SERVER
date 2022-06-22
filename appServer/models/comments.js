const mongoose = require("mongoose")

let commentSchema = mongoose.Schema({
    name: String,
    email: String,
    status: String,
    comment: String,
    id_product: String
})

module.exports = mongoose.model("comments", commentSchema);   