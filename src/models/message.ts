/* eslint-disable prettier/prettier */
import mongoose, { Schema, model } from 'mongoose';

const messageSChema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    chat: {
      type: Schema.Types.ObjectId,
      ref: 'Chat',
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    attachments: [
      {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],
  },

  {
    timestamps: true,
  },
);

const Message = mongoose.models.Message || model('Message', messageSChema);
export { Message, messageSChema };
