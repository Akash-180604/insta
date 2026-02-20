const express = require("express");
const isAuth = require("../middleWire/isAuth");
const upload = require("../middleWire/multer");
const { uploadPost, likePost, commentPost, savedPost, getAllPost, likedUsers, getPostById } = require("../controllers/postControllers");
const postRouter = express.Router();

postRouter.get("/getAllPost",isAuth,getAllPost);
postRouter.post("/upload",isAuth,upload.single('media'),uploadPost);
postRouter.get("/like/:postId",isAuth,likePost);
postRouter.post("/comment/:postId",isAuth,commentPost);
postRouter.get("/saved/:postId",isAuth,savedPost);
postRouter.get("/likedUsers/:postId",isAuth,likedUsers);
postRouter.get("/getPostById/:postId",isAuth,getPostById);



module.exports = postRouter;