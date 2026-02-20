const { default: mongoose } = require("mongoose")
const messageSchema = new mongoose.Schema({
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    recever:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    messageType:{
        type:String,
        required:true,
        enum:['image','video','text']
    },
    media:{
        type:String,
    },
    message:{
        type:String
    },
    isRead:{
        type:String,
        enum:['send','received','seen'],
        default:'send'
    },
    
},{timestamps:true})

const Message = mongoose.model("Message",messageSchema);

module.exports = Message;