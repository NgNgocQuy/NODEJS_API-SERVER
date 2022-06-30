import express from "express"
const router = express.Router();
import {authenToken, loginPage, productGet, userGet} from '../controllers/controller.js'

/* GET home page. */
// router.get("/page/login", loginPage)
router.get('/product', productGet );

router.use('/user',authenToken);
router.get('/user/property',userGet );
// router.get('/user/', productGet );

export default router;
