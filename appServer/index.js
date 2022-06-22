import express from "express"
import mongoose from "mongoose"

import router from './routes/index.js'

const port =process.env.PORT || '3000'
const db_connect = process.env.DB_CONNECT
const app = express();

try {
  mongoose.connect(db_connect)
} catch (error) {
  console.log(error)
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/// __dirname is not defined in ES module scope -- node version 14
// const __dirname = path.resolve();
// app.use(express.static(path.join(__dirname, 'public')));

app.use(router);



app.listen(port, ()=>{
  console.log("App Server localhost: "+ port);
})