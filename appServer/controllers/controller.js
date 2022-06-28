import mongoose from 'mongoose';
import { verifyToken } from './Token.js';
import express from 'express';
import dotenv from 'dotenv'

import product from '../models/products.js'

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
            res.sendStatus(401)
        }

    }

const productGet = async (req,res)=>{
    console.log(req.auth);
    if(req.auth.permission)
        try {
            let result = await product.find().exec()
            res.json(result)
        } catch (error) {
            console.log(error);
            res.json(error)
        }
    res.sendStatus(403)
}

const loginPage = async(req,res,next)=>{

    res.render("loginPage")
}
    

export {
    authenToken,
    productGet,

    loginPage,
}