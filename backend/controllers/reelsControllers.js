const uploadOnCloudinary = require("../config/uploadOnCloudinary");
const Reels = require("../models/reelsModel");
const User = require("../models/userModel");
const Notification = require("../models/notificationModel");
const { io, getSocketId } = require("../socket");
const { default: mongoose } = require("mongoose");

const getAllReels = async (req,res) =>{
   try {
      const userId =  req.userId;
      // const reels = await Reels.find()
      const reels = await Reels.find({author:{$ne:userId}})
      .populate("author",'firstName lastName userName profileImage followers')
      .populate('comments.author', 'firstName lastName userName profileImage' )
      .sort({createdAt:-1});

      return res.status(200).json(reels); 

} catch (error) {
     console.log("getAllReels error");
    console.log(error);

    return res.status(500).json({
      msg: "getAllReels error",
    });
}
}

const uploadReels = async (req,res)=>{
try {
   const userId =  req.userId;
   const {caption} = await req.body;


   if(!req.file){
      return res.status(400).json({message:"reels does not found upload image or video"})
   }
   const url = await uploadOnCloudinary(req.file.path);
   

   const reels = await Reels.create({
    author:userId,
    media:url,
    caption,

   })

   await User.findByIdAndUpdate(userId, { $push: { reels: reels._id } });

   const reelsData = await Reels.findById(reels._id)
      .populate("author",'firstName lastName userName profileImage followers');
   
   return res.status(200).json(reelsData); 
} catch (error) {
     console.log("uploadReels error");
    console.log(error);

    return res.status(500).json({
      msg: "uploadReels error",
    });
}
 
}

const likeReels = async (req,res)=>{
try {
    const userId = req.userId;
    const reelsId = req.params.reelsId;

    const reels =await Reels.findById(reelsId);
    if(!reels){
        return res.status(400).json({message:"reels does not found"})
    }
    const isLiked = reels.likes.some((id)=>String(id)===String(userId));
    if (isLiked) {
       reels.likes = reels.likes.filter((id)=>String(id)!==String(userId));
    } else {
       reels.likes.push(userId) ;

       if (userId!=reels.author._id) {
         const notification = await Notification.create({
         sender:userId,
         receiver:reels.author._id,
         type:'like',
         message:'Liked your reels',
         reels:reels._id,
       })
       const populatedNotification = await Notification.findById(notification._id)
       .populate('sender','_id userName profileImage')
       .populate('reels','_id media');
   //  implement socket io
       const receiverSocketId = getSocketId(reels.author._id)
       io.to(receiverSocketId).emit('newNotification',populatedNotification)
       }
      
    }
    await reels.save();
    
   await reels.populate("author","firstName lastName, userName profileImage followers")

   //  implement socket io
       io.emit('likedReels', {
         reelsId,
         likes:reels.likes
       });

   return res.status(200).json(reels); 
} catch (error) {
     console.log("like error");
    console.log(error);

    return res.status(500).json({
      msg: "like error",
    });
}
 
}

const commentReels = async (req,res)=>{
try {
    const userId = req.userId;
    const reelsId = req.params.reelsId;
    const{message} = req.body;

    const reels =await Reels.findById(reelsId);
    if(!reels){
        return res.status(400).json({message:"reels does not found"})
    }
    reels.comments.push({author:userId,message});  

    //create Notification
    if (String(userId)!==String(reels.author._id)) {
         const notification = await Notification.create({
         sender:userId,
         receiver:reels.author._id,
         type:'comment',
         message:'commented your reels',
         reels:reels._id,
       })
       const populatedNotification = await Notification.findById(notification._id)
       .populate('sender','_id userName profileImage')
       .populate('reels','_id media comments');
   //  implement socket io
       const receiverSocketId = getSocketId(reels.author._id)
       io.to(receiverSocketId).emit('newNotification',populatedNotification)
       }

    await reels.save();
    
   const updatedReels = await Reels.findById(reels._id)
   .populate("author"," _id firstName lastName userName profileImage followers")
    .populate("comments.author","_id firstName lastName userName profileImage followers")
    .sort({createdAt:-1});

    // impliment socket io
        io.emit('commentedReels',{
          reelsId,
          comments:reels.comments
        })

   return res.status(200).json(updatedReels); 
} catch (error) {
     console.log("comment error in Reels");
    console.log(error);

    return res.status(500).json({
      msg: "comment error in Reels",
    });
}
 
}

const savedReels = async (req,res)=>{
try {
    const userId = req.userId;
    const reelsId = req.params.reelsId;

    const user = await User.findById(userId);
    if(!user){
        return res.status(400).json({message:"user does not found"})
    }
    const isSaved = user.savedReels.some((id)=>String(id)===String(reelsId));
    
    if (isSaved) {
       user.savedReels = user.savedReels.filter((id)=>String(id)!==String(reelsId));
    } else {
       user.savedReels.push(reelsId);
    }
    await user.save();

   return res.status(200).json(user);
} catch (error) {
     console.log("savedReels error");
    console.log(error);

    return res.status(500).json({
      msg: "savedReels error",
    });
}
 
}

const getReelsById = async (req,res) =>{
   try {
      const {reelsId} =  req.params;
      const reelsObjectId = new mongoose.Types.ObjectId(reelsId);
      
      const reels = await Reels.findOne(reelsObjectId)
      .populate("author",'firstName lastName userName profileImage')
      .populate('comments.author', 'firstName lastName userName profileImage');

      return res.status(200).json(reels); 

} catch (error) {
     console.log("getReelsById error");
    console.log(error);

    return res.status(500).json({
      msg: "getReelsById error",
    });
}
}

module.exports = {
   getAllReels,uploadReels,likeReels,commentReels,savedReels,getReelsById
}