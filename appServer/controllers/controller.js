import mongoose from 'mongoose';
import { verifyToken } from './Token.js';
import express from 'express';
import dotenv from 'dotenv'

import product from '../models/products.js'
import accounts from '../models/Account.js'

dotenv.config()


const authenToken= async (req,res,next)=>{
        let AuthorizationHeader = req.headers['authorization']
        let token = await AuthorizationHeader.split(' ')[1]
        let snapshot = await verifyToken(token, process.env.PRIVATE_TOKEN_KEY)

        if (snapshot!=-1) {
            req.auth = {
                userId: snapshot.data.userId,
                username: snapshot.data.username,
                permission: snapshot.data.permission,
            }
            next()
        }else{
            req.auth= {permission:-1}
            next()
        }

    }

const productGet = async (req,res)=>{
    console.log(req.auth);
    try {
        if(req.auth.permission>0)
            res.json(await product.find().exec())
            
    } catch (error) {
        let result = await product.find().limit(2).exec()
        res.json({permission:'you not login',result})
    }
    res.sendStatus(403)

}

const userGet = async (req,res)=>{
    let result
    result ={
        account: await accounts.findOne({_id:req.auth.userId}).exec(),
        permission:req.auth.userId
        }

    res.json(result)
}

const loginPage = async(req,res,next)=>{

    res.render("loginPage")
}
    

export {
    authenToken,
    productGet,
    userGet,
    loginPage,

}