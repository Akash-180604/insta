const { default: mongoose } = require("mongoose")
const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        // required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    userName:{
        type:String,
        // required:true,
        unique:true
    },
    password:{
        type:String,
        // required:true
    },
    profileImage:{
        type:String
    },
    gender:{
        type:String,
        enum:["male","female","other"]
    },
    bio:{
        type:String
    },
    savedPosts:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Post"
    }],
    savedReels:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Reels"
    }],
    followers:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
     followings:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    posts:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Post"
    }],
    reels:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Reels"
    }],
    previousSearchedUsers:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    resetPassword:{
        otp:{
            type:String
        },
        otpExpiredTime:{
            type:Date
        },
        isVarified:{
            type:Boolean,
            default:false
        }
    }


},{timestamps:true})

const User = mongoose.model("User",userSchema);

module.exports = User;