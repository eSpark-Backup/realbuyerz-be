/* eslint-disable prettier/prettier */
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { v2 as cloudinary } from 'cloudinary';
import { v4 as uuid } from 'uuid';
import { getBase64 } from '../lib/helper.js';
const cookieOptions = {
  maxAge: 24 * 3600 * 1000,
  sameSite: 'none',
  secure: true,
  httpOnly: true,
};
const connectDb = (uri) => {
  return new Promise((resolve, reject) => {
    mongoose.connect(uri).then((res, err) => {
      if (err) return reject(err);
      console.log('Connected to the database');
      resolve();
    });
  });
};
const sendToken = (res, user, code, message) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });
  return res
    .status(code)
    .cookie('badami', token, cookieOptions)
    .json({ success: true, message });
};

const emitEvent = (req, event, users, data) => {
  console.log('Emitting event:' + event);
};

const uploadFilesToCloudinary = async (files = []) => {
  if (files.length === 0) {
    throw new Error("Missing required parameter - files");
  }

  const uploadPromises = files.map((file) => {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        getBase64(file),
        {
          resource_type: 'auto',
          public_id: uuid(),
        },
        (err, result) => {
          if (err) {
            return reject(err);
          }
          resolve(result);
        },
      );
    });
  });

  try {
    const results = await Promise.all(uploadPromises);
    const formattedResults = results.map((result) => {
      return {
        public_id: result.public_id,
        url: result.secure_url,
      };
    });
    return formattedResults;
  } catch (err) {
    throw new Error(`Error uploading files: ${err.message}`);
  }
};
const deleteFilesFromCloudinary = async (public_ids) => {
  // delete files from cloudinary
  if (public_ids.length === 0) {
    throw new Error("Missing required parameter - public_ids");
  }
  else{
    const deletePromises = public_ids.map((public_id) => {
      return new Promise((resolve, reject) => {
        cloudinary.uploader.destroy(public_id, (err, result) => {
          if (err) {
            return reject(err);
          }
          resolve(result);
        });
      });
    });
    try {
      await Promise.all(deletePromises);
      return;
    } catch (err) {
      throw new Error(`Error deleting files: ${err.message}`);
    }
  
  }
};
export {
  connectDb,
  sendToken,
  cookieOptions,
  emitEvent,
  deleteFilesFromCloudinary,
  uploadFilesToCloudinary,
};
