import mongoose, { Schema, model } from "mongoose";

const chatSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
     
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
   
  },
  {
    timestamps: true,
  }
);

const Chat =mongoose.models.Chat ||  model("Chat", chatSchema) ;
export default Chat;
