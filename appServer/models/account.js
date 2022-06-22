const mongoose = require("mongoose")
const {Schema} = mongoose 


const accountSchema = new Schema({
    user: String,
    password: String,
    sessionKey: String,
    permission: String,
})
 module.exports =  mongoose.model("accounts", accountSchema)
