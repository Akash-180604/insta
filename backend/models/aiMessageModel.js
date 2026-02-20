const { default: mongoose } = require("mongoose")
const aiMessageSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    request:{
        type:String,
        required:true
    },
     response:{
        type:String
    },
    
},{timestamps:true})

const AiMessage = mongoose.model("AiMessage",aiMessageSchema);

module.exports = AiMessage;