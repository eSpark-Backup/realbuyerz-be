/* eslint-disable prettier/prettier */
import mongoose, { Schema, model } from 'mongoose';
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },
    mainAccountId: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },
    bio: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
    },
    password: {
      type: String,
      required: true,
      default: 'password',
      trim: true,
      minlength: 6,
    },

    avatar: {
      public_id: {
        type: String,
        required: false,
      },
      url: {
        type: String,
        required: false,
      },
    },
  },
  {
    timestamps: true,
  },
);

const ChatUser = mongoose.models.User || model('User', userSchema);
export { ChatUser, userSchema };
