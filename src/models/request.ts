/* eslint-disable prettier/prettier */
import mongoose, { Schema, model } from 'mongoose';

const requestSchema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    status: {
      type: String,
      default: 'pending',
      enum: ['pending', 'accepted', 'rejected'],
      required: true,
    },
  },

  {
    timestamps: true,
  },
);

const Request = mongoose.models.Request || model('Request', requestSchema);
export { Request, requestSchema };
