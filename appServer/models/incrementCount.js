const express = require("express")
const mongoose = require("mongoose")


const incrementCountSchema = new mongoose.Schema({
    collectionName: {type:String},
    count:{
        value:{type:String},
        some:{type:String}
    }
})

module.exports = mongoose.model("incrementCount",incrementCountSchema)