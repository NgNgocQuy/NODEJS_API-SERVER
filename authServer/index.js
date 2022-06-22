import express from "express"
import mongoose from "mongoose"
import dotenv from 'dotenv'

import accounts from './models/Account.js'

import {generateToken,
      refreshToken,
      verifyRefreshToken,
    } from './Token.js'
dotenv.config()

const port =process.env.PORT || '3001'
const db_connect = process.env.DB_CONNECT
const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: false }));

try {
  mongoose.connect(db_connect)
} catch (error) {
  console.log(error)
}

app.post("/login", async (req,res,next)=>{
  let result = await accounts.findOne({user: req.body.username, password: req.body.password}).exec()
  if(result){
    req.body.data = {
      userId: result._id,
      username:result.user,
      permission:result.permission,
    }
    next()  
  }else{
    res.status(200)
    res.json({message:"username or password wrong ans"})
  }

  },
  async (req,res)=>
  {
    let result ={
      accessToken: await generateToken(req.body.data, process.env.PRIVATE_TOKEN_KEY),
      refreshToken: await refreshToken(req.body.data.userId, process.env.PRIVATE_TOKEN_KEY_REFRESH),
    }
    res.status(200)
    res.json(result)
  })

app.post("/refreshCode", async (req,res,next)=>{
  let userId = await verifyRefreshToken(req.body.refreshToken,process.env.PRIVATE_TOKEN_KEY_REFRESH)
  if(userId!=-1){
    req.body.userId= userId.data
    next()
  }else{
    res.status(400)
    res.json({message:"can't verify refreshToken"})
  }
}, async (req,res,next)=>{
  let snapshot = await accounts.findById({_id:req.body.userId}).exec()
  if(snapshot){
    req.body.data = {
      userId: snapshot._id,
      username: snapshot.user,
      premission: snapshot.premission,
    }
    next()
  }else{
    res.status(403)
    res.json({message:"error code"})
  } 
}, async (req,res)=>{
  let result = {
      accessToken: await generateToken(req.body.data, process.env.PRIVATE_TOKEN_KEY),
  }
  res.status(200)
  res.json(result)
}
)


app.listen(port, ()=>{
  console.log("Auth Server localhost: "+ port);
})
