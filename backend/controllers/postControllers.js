const { default: mongoose } = require("mongoose");
const uploadOnCloudinary = require("../config/uploadOnCloudinary");
const Notification = require("../models/notificationModel");
const Post = require("../models/postModel");
const User = require("../models/userModel");
const { io, getSocketId } = require("../socket");

const getAllPost = async (req,res) =>{
   try {
      const userId =  req.userId;
      
      const post = await Post.find({author:{$ne:userId}})
      .populate("author",'firstName lastName userName profileImage followers')
      .populate('comments.author', 'firstName lastName userName profileImage' )
      .sort({createdAt:-1});

      return res.status(200).json(post); 

} catch (error) {
     console.log("getAllPost error");
    console.log(error);

    return res.status(500).json({
      msg: "getAllPost error",
    });
}
}

const uploadPost = async (req,res)=>{
try {
   const userId =  req.userId;
   const {caption,mediaType} = req.body;

   if(!req.file){
      return res.status(400).json({message:"post does not found upload image or video"})
   }

   
   const url = await uploadOnCloudinary(req.file.path);
   
  
   const post = await Post.create({
    author:userId,
    mediaType,
    media:url,
    caption,

   })

   // const user = await User.findById(userId);
   // (user.posts).push(post._id);
   // await user.save();

      await User.findByIdAndUpdate(userId, { $push: { posts: post._id } });

      const postData = await Post.findById(post._id)
      .populate("author",'firstName lastName userName profileImage followers');


   return res.status(200).json(postData);
} catch (error) {
     console.log("uploadPost error");
    console.log(error);

    return res.status(500).json({
      msg: "uploadPost error",
      details: error.message
    });
}
 
}

const likePost = async (req,res)=>{

try {
    const userId = req.userId;
    const postId = req.params.postId;

    const post =await Post.findById(postId);
    if(!post){
        return res.status(400).json({message:"post does not found"})
    }
    const isLiked = post.likes.some((id)=>String(id)===String(userId));
    if (isLiked) {
       post.likes = post.likes.filter((id)=>String(id)!==String(userId));
    } else {
       post.likes.push(userId);
       if (userId!=post.author._id) {
         const notification = await Notification.create({
         sender:userId,
         receiver:post.author._id,
         type:'like',
         message:'Liked your post',
         post:post._id,
       })
       const populatedNotification = await Notification.findById(notification._id)
       .populate('sender','_id userName profileImage')
       .populate('post','_id media mediaType');
   //  implement socket io
       const receiverSocketId = getSocketId(post.author._id)
       io.to(receiverSocketId).emit('newNotification',populatedNotification)
       }
      
    }
    await post.save();

   await post.populate("author","firstName lastName userName profileImage followers")

   //  implement socket io
    io.emit('likedPost', {
      postId:postId,
      likes:post.likes
    });

   return res.status(200).json(post); 
} catch (error) {
     console.log("like error");
    console.log(error);

    return res.status(500).json({
      msg: "like error",
    });
}
 
}

const commentPost = async (req,res)=>{
try {
    const userId = req.userId;
    const postId = req.params.postId;
    const{message} = req.body;

    const post =await Post.findById(postId);
    if(!post){
        return res.status(400).json({message:"post does not found"})
    }
    post.comments.push({author:userId,message});

    await post.save();

    //create Notification
    if (String(userId)!==String(post.author._id)) {
         const notification = await Notification.create({
         sender:userId,
         receiver:post.author._id,
         type:'comment',
         message:'commented your post',
         post:post._id,
       })
       const populatedNotification = await Notification.findById(notification._id)
       .populate('sender','_id userName profileImage')
       .populate('post','_id media mediaType comments');
   //  implement socket io
       const receiverSocketId = getSocketId(post.author._id)
       io.to(receiverSocketId).emit('newNotification',populatedNotification)
       }
      
    
     
   const updatedPost = await Post.findById(post._id)
   .populate("author"," _id firstName lastName userName profileImage followers")
   .populate("comments.author","_id firstName lastName userName profileImage followers")
   .sort({createdAt:-1});
   
   // await post.populate("author","_id firstName lastName userName profileImage followers")
   // .populate("comments.author","_id firstName lastName userName profileImage followers")
   //  .sort({createdAt:-1});

   // impliment socket io
    io.emit('commentedPost',{
      postId:postId,
      comments:post.comments
    })

   return res.status(200).json(updatedPost); 
} catch (error) {
     console.log("comment error");
    console.log(error);

    return res.status(500).json({
      msg: "comment error",
    });
}
 
}

const savedPost = async (req,res)=>{
try {
    const userId = req.userId;
    const postId = req.params.postId;

    const user =await User.findById(userId);
    if(!user){
        return res.status(400).json({message:"user does not found"})
    }
    const isSaved = user.savedPosts.some((id)=>String(id)===String(postId));
    if (isSaved) {
       user.savedPosts = user.savedPosts.filter((id)=>String(id)!==String(postId));
    } else {
       user.savedPosts.push(postId) ;
    }
    await user.save();
    

   return res.status(200).json(user);
} catch (error) {
     console.log("savedPost error");
    console.log(error);

    return res.status(500).json({
      msg: "savedPost error",
    });
} 
}

const likedUsers = async (req,res)=>{
try {
   const postId = req.params.postId;

   const post = await Post.findById(postId)
   .populate('likes',' _id firstName lastName userName profileImage')

   res.status(200).json(post.likes);
} catch (error) {
   console.log("likedUsers error");
    console.log(error);

    return res.status(500).json({
      msg: "likedUsers error",
})
}
}

const getPostById = async (req,res) =>{
   try {
      const {postId} =  req.params;
      const postObjectId = new mongoose.Types.ObjectId(postId);

      const post = await Post.findOne(postObjectId)
      .populate("author",'firstName lastName userName profileImage')
      .populate('comments.author', 'firstName lastName userName profileImage');

      return res.status(200).json(post); 

} catch (error) {
     console.log("getPostById error");
    console.log(error);

    return res.status(500).json({
      msg: "getPostById error",
    });
}
}


module.exports = {
   getAllPost,uploadPost,likePost,commentPost,savedPost,likedUsers,getPostById
}