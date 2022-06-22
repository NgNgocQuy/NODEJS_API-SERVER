import mongoose from "mongoose"
const {Schema} = mongoose 


const accountSchema = new Schema({
    user: String,
    password: String,
    sessionKey: String,
    permission: String,
})
export default mongoose.model("accounts", accountSchema)
