import express from "express"
const router = express.Router();
import {authenToken, loginPage, productGet} from '../controllers/controller.js'

/* GET home page. */
// router.get("/page/login", loginPage)
router.get('/product',authenToken, productGet );

export default router;
