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
///------------------------------------------------------------------
app.post("/login", 
  async (req,res,next)=>{
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
  async (req,res,next)=>{
    req.body.result ={
      username:  req.body.data.username,
      accessToken: await generateToken(req.body.data, process.env.PRIVATE_TOKEN_KEY),
      refreshToken: await refreshToken(req.body.data.userId, process.env.PRIVATE_TOKEN_KEY_REFRESH),
    }
    let updateData = {token:{refreshToken: await req.body.result.refreshToken}}
    await accounts.findByIdAndUpdate({_id:req.body.data.userId}, updateData)
    next()
  }
  ,
  async (req,res)=>{
    res.status(200)
    res.json(req.body.result)
  },
)

///------------------------------------------------------------------
app.post("/refreshCode", 
  async (req,res,next)=>{ // find refreshToken in database
    let snapshot = await accounts.findOne({user: req.body.username}).exec()
    console.log(snapshot);
    if(req.body.refreshToken == snapshot.token.refreshToken)
      {
        req.body.snapshot = snapshot
        next()
      }
    else
      // res.sendStatus(403)
      res.json("time-expired token (logout);")
  },
  async (req,res,next)=>{ // verify refreshToken
    let refreshToken = await verifyRefreshToken(req.body.refreshToken,process.env.PRIVATE_TOKEN_KEY_REFRESH)
    if(refreshToken!=-1){
      next()
    }else{
      res.status(400)
      res.json({message:"can't verify refreshToken"})
    }
  }, 
  async (req,res,next)=>{ // create data for accessToken
    if(req.body.snapshot){
      req.body.data = {
        userId: req.body.snapshot._id,
        username: req.body.snapshot.user,
        premission: req.body.snapshot.premission,
      }
      next()
    }else{
      res.status(403)
      res.json({message:"error code"})
    } 
  }, async (req,res)=>{ // generate accessToken key and response
    let result = {
        accessToken: await generateToken(req.body.data, process.env.PRIVATE_TOKEN_KEY),
    }
    res.status(200)
    res.json(result)
  }
)

///------------------------------------------------------------------
app.post("/logout",async (req,res,next)=>{
  let updateData = {token:{refreshToken: `${Date.now()}`}}
  await accounts.findOneAndUpdate({user: req.body.username}, updateData)
    res.sendStatus(200)
})


app.listen(port, ()=>{
  console.log("Auth Server localhost: "+ port);
})
