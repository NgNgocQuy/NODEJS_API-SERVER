const mongoose = require("mongoose")
const mongooseDelete = require('mongoose-delete');
let categorySchema = mongoose.Schema({
    id: String,
    name: String,
    vn_name:String

})
//Add plugin
categorySchema.plugin(mongooseDelete,{
    deletedAt: true, 
    
  })

module.exports = mongoose.model("categories", categorySchema);   