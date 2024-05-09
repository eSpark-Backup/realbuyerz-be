import { ALERT, REFETCH_CHAT } from "../constants/events.js";
import { tryCatch } from "../middlewares/error.js";
import  Chat  from "../models/chat.js";
import { emitEvent } from "../utils/features.js";
const newGroupChat = tryCatch(async (req, res) => {
  const {name, members} = req.body;

  const allMembers = [...members, req.user];
      await Chat.create({name, members: allMembers});
    emitEvent(req,ALERT,allMembers,`Welcome to ${name}`);
    emitEvent(req,REFETCH_CHAT,members);
    

});

export { newGroupChat };
