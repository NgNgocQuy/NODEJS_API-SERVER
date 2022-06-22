import express from "express"
const router = express.Router();
import {authenToken, productGet} from '../controllers/controller.js'

/* GET home page. */
router.get('/product',authenToken, productGet );

export default router;
