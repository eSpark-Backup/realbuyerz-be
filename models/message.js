/* eslint-disable prettier/prettier */
import mongoose, { Schema, model } from "mongoose";

const messageSChema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    chat: {
      type: Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },
    content: {
      type: String,
      required: false,
    },
    attachments:[
      {
        public_id: {
          type: String,
          required: false,

        },
        url: {
          type: String,
          required: false,
        },
      },
    ]
  },

  {
    timestamps: true,
  }
);

const Message =   mongoose.models.Message  || model("Message", messageSChema);
export default Message;
