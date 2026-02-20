const { default: mongoose } = require("mongoose")
const notificationSchema = new mongoose.Schema({
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    receiver:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    type:{
        type:String,
        required:true,
        enum:['like','comment','follow']
    },
    message:{
        type:String,
        required:true
    },
    post:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Post"
    },
    reels:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Reels"
    },
    isRead:{
        type:Boolean,
        default:false
    },
    
},{timestamps:true})

const Notification = mongoose.model("Notification",notificationSchema);

module.exports = Notification;