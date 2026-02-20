const User = require("../models/userModel");
const uploadOnCloudinary = require("../config/uploadOnCloudinary");
const Notification = require("../models/notificationModel");
const { io, getSocketId } = require("../socket");
const Story = require("../models/storyModel");
const { default: mongoose } = require("mongoose");


 const getUserData = async (req,res)=>{
   const userId = req.userId;
   const user =await User.findById(userId);
   if(!user){
          return  res.status(400).json({msg:"Here is not any user of this id"})
        }
   return res.status(200).json(user) 
}
 const getSavedPost = async (req,res)=>{
   const userId = req.userId;
   const userIdObjectId = new mongoose.Types.ObjectId(userId);
   const user =await User.findById(userIdObjectId)
   .populate('savedPosts');
   if(!user){
          return  res.status(400).json({msg:"Here is not any user of this id getSavePosr error" })
        }
   return res.status(200).json(user) 
}
 const getSavedReels = async (req,res)=>{
   const userId = req.userId;
   const userIdObjectId = new mongoose.Types.ObjectId(userId);
   const user =await User.findById(userIdObjectId)
   .populate('savedReels');
   if(!user){
          return  res.status(400).json({msg:"Here is not any user of this id getSaveReels error"})
        }
   return res.status(200).json(user) 
}
const edit = async (req, res) => {
  try {
    const { firstName, lastName,userName, gender, bio } = await req.body;
    const userId = req.userId;
    if(!firstName || !lastName || !userName || !gender){
    return  res.status(400).json({message:'Fill All Require input'});
    }


    const existUserName = await User.findOne({userName});
    if(existUserName && existUserName._id!=userId){
    return  res.status(400).json({message:'UserName alradey Exist try another one'});
    }

    const user = await User.findById(userId);

    if (req.file) {
      const url = await uploadOnCloudinary(req.file.path);
      user.profileImage = url;
    }
    user.firstName = firstName;
    user.lastName = lastName;
    user.gender = gender;
    user.bio = bio;
    await user.save();

    return res.status(200).json( user );
  } catch (error) {
    console.log("edit error");
    console.log(error);

    return res.status(500).json({
      msg: "edit error",
    });
  }
};
const getProfile = async(req,res)=>{
  try {
       const userName = String(req.params.userName);
       const userId = req.userId;


   let user = await User.findOne({userName})
   .populate('posts reels')
   .lean();
   
   if(!user){
      return res.status(400).json({message:'cant get user of this user name'})
    }

    if (String(user._id)===String(userId)) {
      // await user.populate('savedPosts savedReels');
       user = await User.findOne({userName})
   .populate('posts reels savedPosts savedReels')
   .lean();
    }

   const story = await Story.findOne({author:user._id});
  
  user.isStory = story ? true : false;

   return res.status(200).json(user);

  } catch (error) {
    console.log("getProfile error");
    console.log(error);

    return res.status(500).json({
      msg: "getProfile error",
    });
    
  }

}
const follow = async(req,res)=>{
  try {
      const userId = new mongoose.Types.ObjectId(req.userId);
       const id = new mongoose.Types.ObjectId(req.params.id);

       if(String(userId)===String(id)){
        return res.status(400).json({massage:'user cant follow itsalf'})
       }

   const currentUser = await User.findById(userId)
   const followerUser = await User.findById(id)

   

     if (!currentUser || !followerUser) {
        return res.status(404).json({ msg: "User not found" });
        }


      const isFollow =  currentUser.followings.some((user)=>String(user)===String(followerUser._id))


      if(isFollow){
    (currentUser.followings) = (currentUser.followings).filter((user)=>String(user)!==String(followerUser._id));
    followerUser.followers = (followerUser.followers).filter((user)=>String(user)!==String(currentUser._id));
}else{
    (currentUser.followings).push(followerUser._id);
    (followerUser.followers).push(currentUser._id);


//create Notification

  const notification = await Notification.create({
    sender:userId,
    receiver:id,
    type:'follow',
    message:'started following you',
    })
  const populatedNotification = await Notification.findById(notification._id)
    .populate('sender','_id userName profileImage')
   //  implement socket io
  const receiverSocketId = getSocketId(id)
  io.to(receiverSocketId).emit('newNotification',populatedNotification)
  }

  await currentUser.save()
  await followerUser.save()

  return res.status(200).json(currentUser);

  } catch (error) {
    console.log("follow error");
    console.log(error);

    return res.status(500).json({
      msg: "follow error",
    });
    
  }

}
const userSearch = async(req,res)=>{
  try {
    const input = req.query.input;
    if (!input) {
      return res.status(400).json({message:'searched input is required'})
    }

    const user = await User.find({
      $or:[
        {userName:{$regex:input,$options:'i'}},
        {firstName:{$regex:input,$options:'i'}},
        {lastName:{$regex:input,$options:'i'}},
      ]
    }).select('_id firstName lastName userName profileImage followers')

    const selectedUser = user.splice(0,12)

    return res.status(200).json(selectedUser)

  } catch (error) {
    console.log(error);
    return res.status(500).json({message:'user serch error'})
  }
}
const getFollowers = async(req,res)=>{
  try {
       const userName = req.params.userName;

   const user = await User.findOne({userName})
   .populate('followers', '_id firstName lastName userName profileImage');
   
   if(!user){
      return res.status(400).json({message:'cant get user of this user name'})
        }

     return res.status(200).json(user.followers);

  } catch (error) {
    console.log("getFollowers error");
    console.log(error);

    return res.status(500).json({
      msg: "getFollowers error",
    });
    
  }

}
const getFollowings = async(req,res)=>{
  try {
       const userName = req.params.userName;

   const user = await User.findOne({userName})
   .populate('followings', '_id firstName lastName userName profileImage');
   
   if(!user){
      return res.status(400).json({message:'cant get user of this user name'})
        }

     return res.status(200).json(user.followings);

  } catch (error) {
    console.log("getFollowings error");
    console.log(error);

    return res.status(500).json({
      msg: "getFollowings error",
    });
    
  }

}
const getPreviousSearchedUsers = async (req,res)=>{
try {
  const userId = req.userId;
   const user =await User.findById(userId)
   .populate('previousSearchedUsers','_id firstName lastName userName profileImage followers');
   if(!user){
          return  res.status(400).json({msg:"Here is not any user of this id"})
        }
   return res.status(200).json((user.previousSearchedUsers).reverse()) 


} catch (error) {
  console.log("GetPreviousSearchedUsers error");
    console.log(error);

    return res.status(500).json({
      msg: "GetPreviousSearchedUsers error",
    });
}
}
 const pushPreviousSearchedUsers = async (req,res)=>{

  try {
    const userId = req.userId;
   const searchedUserId = new mongoose.Types.ObjectId(req.params.id);
   const user =await User.findById(userId);
   if(!user){
          return  res.status(404).json({msg:"Here is not any user of this id"})
        }
     
      user.previousSearchedUsers = user.previousSearchedUsers.filter(id=>String(id)!==String(searchedUserId))

      user.previousSearchedUsers.push(searchedUserId)

       if (user.previousSearchedUsers.length>20) {
       user.previousSearchedUsers.shift();
    }
    
    await user.save()
    await user.populate('previousSearchedUsers','_id firstName lastName userName profileImage followers')

   return res.status(200).json((user.previousSearchedUsers).reverse())
    
  } catch (error) {
    console.log("pushPreviousSearchedUsers error");
    console.log(error);

    return res.status(500).json({
      msg: "pushPreviousSearchedUsers error",
    });
  }
   
}
const deletePreviousSearchedUsers = async (req,res)=>{

  try {
    const userId = req.userId;
   const searchedUserId = new mongoose.Types.ObjectId(req.params.id);
   const user =await User.findById(userId);
   if(!user){
          return  res.status(404).json({msg:"Here is not any user of this id"})
        }
     
      user.previousSearchedUsers = user.previousSearchedUsers.filter(id=>String(id)!==String(searchedUserId))

    
    await user.save()
    await user.populate('previousSearchedUsers','_id firstName lastName userName profileImage followers')

   return res.status(200).json((user.previousSearchedUsers).reverse());
    
  } catch (error) {
    console.log("deletePreviousSearchedUsers error");
    console.log(error);

    return res.status(500).json({
      msg: "deletePreviousSearchedUsers error",
    });
  }
   
}
const getAllNotification = async (req,res)=>{
  try {
   const userId = req.userId;
   const notification =await Notification.find({receiver:userId})
    .populate('sender','_id userName profileImage')
    .populate('post','_id media mediaType')
    .populate('reels','_id media')
    .sort({createdAt:-1});
  
   return res.status(200).json(notification) 
  } catch (error) {
    console.log("getAllNotification error");
    console.log(error);

    return res.status(500).json({
      msg: "getAllNotification error",
    });
  }
   
}
// const markAsReadNotification = async (req,res)=>{
//   try {
//    const userId = req.userId;
//    const {notificationId} = req.body;
//    if (Array.isArray(notificationId)) {
//     //update all
//     await Notification.updateMany(
//       { _id:{ $in:notificationId }, receiver:userId},
//       {$set: {isRead:true}}
//     );
//    } else {
//     // updare single 
//     await Notification.findOneAndUpdate(
//       { _id:notificationId, receiver:userId},
//       {$set:{isRead:true}}
//     );
//    }

//    return res.status(200).json({message:'marked as Read'}) 
//   } catch (error) {
//     console.log("markAsReadNotification error");
//     console.log(error);

//     return res.status(500).json({
//       msg: "markAsReadNotification error",
//     });
//   }
   
// }

const markAsReadNotification = async (req,res)=>{
  try {
   const userId = req.userId;
   
    await Notification.updateMany(
    {receiver:userId},
    {$set : {isRead:true}}
   )

   const notification =await Notification.find({receiver:userId})
    .populate('sender','_id userName profileImage')
    .populate('post','_id media mediaType')
    .populate('reels','_id media')
    .sort({createdAt:-1});


   return res.status(200).json(notification);
  } catch (error) {
    console.log("markAsReadNotification error");
    console.log(error);

    return res.status(500).json({
      msg: "markAsReadNotification error",
    });
  }
   
}
//geting data of online Users
const getOnlineUserData = async (req,res)=>{
  try {
    const {onlineUsers} = req.body;
    console.log(onlineUsers);
    console.log("getOnlineUserData running ......");
    
    
    const objectIds = onlineUsers.map(id => new mongoose.Types.ObjectId(id));
    const onlineUserData = await User.find({'_id': { $in:objectIds } })
    .select('_id userName firstName lastName profileImage');

    return res.status(200).json(onlineUserData);
  } catch (error) {
    console.log("getOnlineUserData error");
    console.log(error);

    return res.status(500).json({
      msg: "getOnlineUserData error",
    });
  }
}

module.exports = {getUserData,getProfile,edit,getSavedPost,getSavedReels,follow,userSearch,getFollowers,getFollowings,getPreviousSearchedUsers,pushPreviousSearchedUsers,deletePreviousSearchedUsers,getAllNotification,markAsReadNotification,getOnlineUserData};