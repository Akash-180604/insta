const express = require("express");
const isAuth = require("../middleWire/isAuth");
const upload = require("../middleWire/multer");
const { likeReels, uploadReels, getAllReels, commentReels, savedReels, getReelsById } = require("../controllers/reelsControllers");
const reelsRouter = express.Router();

reelsRouter.get("/getAllReels",isAuth,getAllReels);
reelsRouter.post("/upload",isAuth,upload.single('media'),uploadReels);
reelsRouter.get("/like/:reelsId",isAuth,likeReels);
reelsRouter.post("/comment/:reelsId",isAuth,commentReels);
reelsRouter.get("/saved/:reelsId",isAuth,savedReels);
reelsRouter.get("/getReelsById/:reelsId",isAuth,getReelsById);



module.exports = reelsRouter;