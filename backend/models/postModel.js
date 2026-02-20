const { default: mongoose } = require("mongoose")
const postSchema = new mongoose.Schema({
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    mediaType:{
        type:String,
        required:true,
        enum:['image','video']
    },
    media:{
        type:String,
        required:true
    },
    caption:{
        type:String
    },
    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    comments:[{
        author:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        message:{
            type:String
        }
    }],

},{timestamps:true})

const Post = mongoose.model("Post",postSchema);

module.exports = Post;