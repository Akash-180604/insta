const express = require("express");
const isAuth = require("../middleWire/isAuth");
const upload = require("../middleWire/multer");
const { sendMessage, getAllMessages, getPrevUserMessages, getProfileById, aiSendMessage, aiGetAllMessages, markReadMessage, markReceivedMessage, markReceivedMessageById } = require("../controllers/messageControllers");
const messageRouter = express.Router();

messageRouter.get("/getAllMessages/:id",isAuth,getAllMessages);
messageRouter.post("/sendMessage/:id",isAuth,upload.single('media'),sendMessage);
messageRouter.get("/getPrevUserMessages",isAuth,getPrevUserMessages);
messageRouter.get("/getProfileById/:id",isAuth,getProfileById);

// AI Message Routeres
messageRouter.post('/aiSendMessage',isAuth,aiSendMessage);
messageRouter.get('/aiGetAllMessages',isAuth,aiGetAllMessages);

// merk read message 
messageRouter.post('/markReadMessage',isAuth,markReadMessage);
// merk received message 
messageRouter.get('/markReceivedMessage',isAuth,markReceivedMessage);
messageRouter.get('/markReceivedMessageById/:messageId',isAuth,markReceivedMessageById);




module.exports = messageRouter;