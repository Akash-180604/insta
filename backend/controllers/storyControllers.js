const uploadOnCloudinary = require("../config/uploadOnCloudinary");
const Story = require("../models/storyModel");
const User = require("../models/userModel");

const getAllStory = async (req,res) =>{
   try {
      const userId =  req.userId;

      const user = await User.findById(userId);
      const followingIds = user.followings;

      const story = await Story.find({
        author:{$in:followingIds}
      }).populate('author','userName profileImage')
      .sort({createdAt:-1});

      const seen = new Set();
    const uniqueStory =  story.filter(item => {
    const value = item.author._id;
    if (seen.has(value)) {
      return false; // Duplicate found
    }
    seen.add(value);
    return true; // Unique
  });

  return res.status(200).json(uniqueStory); 

} catch (error) {
     console.log("getAllStory error");
    console.log(error);

    return res.status(500).json({
      msg: "getAllStory error",
    });
}
}

const uploadStory = async (req,res)=>{
try {
   const userId =  req.userId;
   const {caption,mediaType} = req.body;

   if(!req.file){
      return res.status(400).json({message:"story does not found, upload image or video"})
   }
   const url = await uploadOnCloudinary(req.file.path);
  
   const story = await Story.create({
    author:userId,
    mediaType,
    media:url,
    caption,

   })

const storyData = await Story.findById(story._id)
.populate('author','_id firstName lastName userName profileImage');

   return res.status(201).json(storyData);
} catch (error) {
     console.log("uploadStory error \n");
    console.log(error);

    return res.status(500).json({
      msg: "uploadStory error",
    });
}
 
}
const viewStory = async (req,res)=>{
    try {
        const userId = req.userId;
        const storyId = req.params.storyId;
        
        const story = await Story.findById(storyId);
        if(!story){
            return res.status(400).json({message:'cant get story of this story id'})
        }

       const isview = (story.views).some((s)=>String(s.vieweres)===String(userId));
       if(!isview){
        story.views.push({vieweres:userId,viewTime:Date.now()});
        await story.save();
       }

       return res.status(200).json(story);

    } catch (error) {
        console.log("viewStory error \n");
    console.log(error);

    return res.status(500).json({
      msg: "viewStory error",
    });
    }
}
const getStory = async(req,res)=>{
  try {
       const userName = req.params.userName;

   const user = await User.findOne({userName})
   .select('_id');

       if(!user){
            return res.status(400).json({message:'cant get story of this userName'});
        }
        const userStories = await Story.find({author: user._id})
        .populate('author','_id firstName lastName userName profileImage');

     return res.status(200).json( userStories );

  } catch (error) {
    console.log("getStory error");
    console.log(error);

    return res.status(500).json({
      msg: "getStory error",
    });
    
  }

}
const userStory = async(req,res)=>{
try {
  const userId = req.userId;

  const story = await Story.find({author:userId})
  .populate('author', '_id profileImage userName firstName lastName')
  .populate('views.vieweres', '_id firstName lastName userName profileImage ');

  if(!story){
    return res.status(200).json({message:'user cant have any story'});
    }

  return res.status(200).json(story);
} catch (error) {
  console.log("userStory error");
    console.log(error);

    return res.status(500).json({
      msg: "userStory error",
    });
}
}


module.exports = {
    getAllStory,uploadStory,viewStory,getStory,userStory
}