const { default: mongoose } = require("mongoose")
const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:[true, 'First Name is Required.'],
        lowercase: true,
        trim: true,
    },
    lastName:{
        type:String,
        // required:true,
        lowercase: true,
        trim: true,
    },
    email:{
        type:String,
        required:[true, 'Email is Required.'],
        unique:[true, 'Email is already registered. please log in'],
        lowercase: true,
        trim: true,
        match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please enter a valid email address.'
    ],
    },
    userName:{
        type:String,
        // required:true,
        unique:[true, 'userName is already exist'],
        minlenght:[5, 'userName minimum lenght should be 5 character'],
        lowercase: true,
        trim: true,
    },
    password:{
        type:String,
        // required:true,
        minlenght:[5, 'password minimum lenght should be 5 character'],
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