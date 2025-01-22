/* eslint-disable prettier/prettier */
import mongoose, { Schema, Types, model } from 'mongoose';

const notificationSchema = new Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['info', 'warning', 'alert'],
      default: 'info',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    metadata: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
  },
);

const Notification =
  mongoose.models.Notification || model('Notification', notificationSchema);
export { Notification, notificationSchema };
