const express = require("express");
const {getUserData, getProfile, edit, getSavedReels, getSavedPost, follow, userSearch, getFollowers, getFollowings, getPreviousSearchedUsers, pushPreviousSearchedUsers, getAllNotification, markAsReadNotification, deletePreviousSearchedUsers, getOnlineUserData} = require("../controllers/userCntroller");
const isAuth = require("../middleWire/isAuth");
const upload = require("../middleWire/multer");
const userRouther = express.Router();

userRouther.get("/getUserData",isAuth,getUserData);
userRouther.post("/edit",isAuth,upload.single('profileImage'),edit);
userRouther.get("/getProfile/:userName",isAuth,getProfile);
userRouther.get("/follow/:id",isAuth,follow);
userRouther.get("/getSavedPost",isAuth,getSavedPost);
userRouther.get("/getSavedReels",isAuth,getSavedReels);
userRouther.get("/search",isAuth,userSearch);
userRouther.get("/getFollowers/:userName",isAuth,getFollowers);
userRouther.get("/getFollowings/:userName",isAuth,getFollowings);
userRouther.get("/getPreviousSearchedUsers",isAuth,getPreviousSearchedUsers);
userRouther.get("/pushPreviousSearchedUsers/:id",isAuth,pushPreviousSearchedUsers);
userRouther.get("/deletePreviousSearchedUsers/:id",isAuth,deletePreviousSearchedUsers);
userRouther.get("/getAllNotification",isAuth,getAllNotification);
userRouther.get("/markAsReadNotification",isAuth,markAsReadNotification);
//geting data of online Users
userRouther.post("/getOnlineUserData",isAuth,getOnlineUserData);








module.exports = userRouther;