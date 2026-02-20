const { default: mongoose } = require("mongoose");
const gemini = require("../config/configGemini");
const uploadOnCloudinary = require("../config/uploadOnCloudinary");
const AiMessage = require("../models/aiMessageModel");
const Conversation = require("../models/conversationModel");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const { io, getSocketId } = require("../socket");

const sendMessage = async(req,res)=>{
    try {

     const {messageType, message} = req.body;

    const senderId = req.userId;
    const receverId = new mongoose.Types.ObjectId(req.params.id);

    if(!messageType){
      return res.status(400).json({message:"messageType is required"})
   }

    let url;
    if(req.file){
        url = await uploadOnCloudinary(req.file.path);
    }



    const newMessage = await Message.create({
        sender:senderId,
        recever:receverId,
        messageType,
        message,
        media:url

    })

    let conversation = await Conversation.findOne(
        {participants:{$all:[senderId,receverId]}}
    )
    if(!conversation){
        conversation = await Conversation.create({
            participants:[senderId,receverId],
            messages:[newMessage._id]
        })
    }else{
        conversation.messages.push(newMessage._id);
        await conversation.save();
    }

    // Socket io for Real time message send
    const receverSocketId = getSocketId(receverId);
    if (receverSocketId) {
    io.to(receverSocketId).emit('newMessage', newMessage);
    }


    return res.status(201).json(newMessage);

} catch (error) {
    console.log(error);
    return res.status(500).json({message:'sendMessage error'});
    }
}

const getAllMessages = async(req,res)=>{
    try {
    const userId = req.userId;
    const otherUserId = new mongoose.Types.ObjectId(req.params.id);

    

    const conversation =await Conversation.findOne({
        participants:{$all:[userId,otherUserId]}
    }).populate('messages')
    .sort({createdAt:-1});
    if(!conversation){
        return res.status(200).json([])
    }
    return res.status(200).json(conversation.messages);
    } catch (error) {
    console.log(error);
    return res.status(500).json({message:'getAllMessages error'});
    }
}

const getPrevUserMessages = async(req,res)=>{
    try {
        const userId = req.userId;

        const conversation = await Conversation.find({
            participants:userId
        }).populate('participants','_id userName firstName lastName profileImage')
        .populate('messages','_id sender messageType message isRead createdAt')
        .lean()
        .sort({updatedAt:-1});

        let prevUsers = [];
        conversation.forEach((con)=>{
            let count = 0;
            (con?.messages).forEach((mess)=>{
            String(mess?.sender)!==String(userId) && mess?.isRead!=='seen' && count++
            })
            
            con.participants.forEach((user)=>{
                if(String(user._id)!==String(userId)){
                    prevUsers.push({user,lastMessage:con.messages[con.messages.length - 1],unSeenMessage:count});
                }
            })
        })

        return res.status(200).json(prevUsers);

    } catch (error) {
    console.log(error);
    return res.status(500).json({message:'getAllMessages error'});
    }
}
const getProfileById = async(req,res)=>{
  try {
       const id = new mongoose.Types.ObjectId(req.params.id);

   const user = await User.findById(id)
   .select('_id firstName lastName userName profileImage followings')
   
   if(!user){
            return res.status(400).json({message:'cant get user of this user name'})
        }

     return res.status(200).json(user);

  } catch (error) {
    console.log("getProfileById in message error");
    console.log(error);

    return res.status(500).json({
      msg: "getProfileById in message error",
    });
    
  }

}

// Ai controlleres
const aiSendMessage =async (req,res)=>{
    try {
    const userId = req.userId;
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({message:'message required'});
    }

    const response = await gemini(message);
    
    const aiMessage = await AiMessage.create({
        user:userId,
        request:message,
        response
    })

    return res.status(200).json(aiMessage);

    } catch (error) {
        console.log(`aiSendMessage error \n ${error}`); 
        return res.status(500).json({message:'aiSendMessage error'});
    }
    
}

const aiGetAllMessages =async (req,res)=>{
    try {
    const userId = req.userId;

    const allMessages = await AiMessage.find({user:userId,})

    return res.status(200).json(allMessages);

    } catch (error) {
        console.log(`aiGetAllMessages error \n ${error}`); 
        return res.status(500).json({message:'aiGetAllMessages error'});
    }
    
}
// mark as read seen messages 
const markReadMessage = async (req,res)=>{
    try {
        //messageIds is a array And otheruserId is id id of otherUser
        const {messageIds,otherUserId} = req.body;

        if (!Array.isArray(messageIds)) {
            return res.status(400).json({message : 'message ids are not Array'});
        }
        if (!otherUserId) {
            return res.status(400).json({message : 'other user is required'});
        }
        const objectIdArray = messageIds.map(id => new mongoose.Types.ObjectId(id));

        const result = await Message.updateMany(
            {_id : { $in : objectIdArray } },
            { $set : { isRead : 'seen'} }
        );

        console.log(`Matched: ${result.matchedCount}, Modified: ${result.modifiedCount}`);
        const otherUserocketId = getSocketId(otherUserId);
        if (otherUserocketId) {
        io.to(otherUserocketId).emit('markAsReadMessage',{otherUserId});
        console.log('socket runing in markReadMessage');
        
        }

    return res.status(200).json({marked : true});

    } catch (error) {
        console.log(`markReadMessage error \n ${error}`); 
        return res.status(500).json({message:'markReadMessage error'});
    }
}
// mark as read received messages 
const markReceivedMessage = async (req,res)=>{
    try {
        const userId = req.userId;
        

        await Message.updateMany(
            { recever: userId, isRead: 'send'},
            { $set : { isRead : 'received' } }
        );


    return res.status(200).json({marked : true});

    } catch (error) {
        console.log(`markReceivedMessage error \n ${error}`); 
        return res.status(500).json({message:'markReceivedMessage error'});
    }
}
const markReceivedMessageById = async (req,res)=>{
    try {
        const messageId = new mongoose.Types.ObjectId(req.params.messageId);
        
        const message =await Message.findById(messageId);

        if (message.isRead === 'send') {
            message.isRead = 'received';
            await message.save();
        }



    return res.status(200).json(message);

    } catch (error) {
        console.log(`markReceivedMessageById error \n ${error}`); 
        return res.status(500).json({message:'markReceivedMessageById error'});
    }
}

module.exports = {
    sendMessage, getAllMessages, getPrevUserMessages, getProfileById,aiSendMessage,aiGetAllMessages,markReadMessage,markReceivedMessage,markReceivedMessageById
}