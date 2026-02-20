const { default: mongoose } = require("mongoose");

const storySchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    mediaType: {
      type: String,
      require: true,
      enum: ["image", "video"],
    },
    media: {
      type: String,
      require: true,
    },

    caption: {
      type: String,
    },
    views: [
        {
      vieweres:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      viewTime:{
        type:Date
      }}
    ],
    createdAt: {
      type: Date,
      default: Date.now(),
      expires: 86400 
    }
  },
  { timestamps: true }
);

const Story = mongoose.model("Story", storySchema);
module.exports = Story;
