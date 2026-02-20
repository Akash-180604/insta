const express=require("express");
const dotenv=require("dotenv");
const cors=require("cors");

const cookieParser = require("cookie-parser");
const cunnectDB = require("./config/cunnectDB");
const postRouter = require("./route/postRouters");
const reelsRouter = require("./route/reelsRouters");
const authRouter = require("./route/authRouters");
const userRouther = require("./route/userRouther");
const storyRouter = require("./route/storyRouters");
const messageRouter = require("./route/messageRouters");
const { app, server } = require("./socket");
dotenv.config();
// const app = express();
app.use(cookieParser());

const port = process.env.PORT || 6000;


app.use(express.json());
app.use(cors({
    origin:'http://localhost:5173',
    credentials:true
}))
app.use("/auth",authRouter);
app.use("/user",userRouther);
app.use("/post",postRouter);
app.use("/reels",reelsRouter);
app.use("/story",storyRouter);
app.use("/message",messageRouter);






server. listen(port,()=>{
    console.log(`App is listen at ${port}`);
        cunnectDB();
})