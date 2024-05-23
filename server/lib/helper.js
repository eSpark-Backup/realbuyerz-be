/* eslint-disable prettier/prettier */
import { userSocketIds } from "../app.js";

/* eslint-disable prettier/prettier */
export const getOtherMember = (members, userId) => {
  return members.find((member) => member._id.toString() !== userId);
};

export const getSockets = (users=[])=>{
  
  const sockets = users.map((user) => {
     userSocketIds.get(user._id.toString());
    
  });
  return sockets;
}

export const getBase64 = (file) => {
 `data:${file.mimetype};base64,${file.buffer.toString('base64')}`
};
