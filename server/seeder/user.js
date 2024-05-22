/* eslint-disable prettier/prettier */
import { create } from "domain";
import User from "../models/user.js";
import Message from "../models/message.js";
import {faker} from "@faker-js/faker";
import Chat from "../models/chat.js";


const createUSer = async(numUsers)=>{
    try {
    let usersPromise= [];
        let user;
         usersPromise = Array(numUsers).fill().map(async()=>{
            user =  User.create({
                name: faker.person.fullName(),
                username: faker.internet.userName(),
                email: faker.internet.email(),
                password: "password",
                avatar: {
                    public_id: faker.system.commonFileName(),
                    url:faker.image.avatar(),
                },
            });

        });
        usersPromise.push(user);

        await Promise.all(usersPromise);
        console.log("User created successfully");
        process.exit(1);
        
    } catch (error) {
        console.log(error);
        process.exit(1);
        
    }
}

const createSingleChats =async (numChats)=>{
    try {
       const users = await User.find().select("_id");
       const chatsPromise = []

       for (let i = 0; i < numChats; i++) {
           const chat = Chat.create({
              name: faker.lorem.word(2),
              members:[users[i],users[i+1]],
           });
           chatsPromise.push(chat);
       }
         await Promise.all(chatsPromise);
        console.log("Chats created successfully");
        process.exit(1);

        
    } catch (error) {
        console.log(error);
        process.exit(1);
        
    }
}
const createMessage = async(numMessages)=>{
    try {
        const users = await User.find().select("_id");
        const chats = await Chat.find().select("_id");
        const messagesPromise = [];

        for (let i = 0; i < numMessages; i++) {
            const message = Message.create({
                chat: chats[i],
                sender: users[i],
                content: faker.lorem.sentence(),
            });
            messagesPromise.push(message);
        }
        await Promise.all(messagesPromise);
        console.log("Messages created successfully");
        process.exit();
        
    } catch (error) {
        console.log(error);
        process.exit();
        
    }
}
const createMessagesInChat = async (chatId,numMessages)=>{
    try {
        const users = await User.find().select("_id");
        const messagesPromise = [];

        for (let i = 0; i < numMessages; i++) {
            const message = Message.create({
                chat: chatId,
                sender: users[i],
                content: faker.lorem.sentence(),
            });
            messagesPromise.push(message);
        }
        await Promise.all(messagesPromise);
        console.log("Messages created successfully");
        process.exit();
        
    } catch (error) {
        console.log(error);
        process.exit();
        
    }
}



export {createUSer,createSingleChats,createMessage,createMessagesInChat}