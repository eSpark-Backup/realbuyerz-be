/* eslint-disable prettier/prettier */
import express from "express";

import { Server } from "socket.io";
import { createServer as CreateServer } from "http";
import {connectDb} from "./utils/features.js";
import userRoute from "./routes/user.js";
import chatRoute from "./routes/chat.js"
import adminRoute from "./routes/admin.js";
const app = express();
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { errorMiddleware } from "./middlewares/error.js";
import { createMessage, createMessagesInChat, createSingleChats, createUSer } from "./seeder/user.js";
const port =process.env.PORT || 3000;
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
dotenv.config();

const server  = CreateServer(app);

const io = new Server(server,{
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true
    },
    
});
connectDb(process.env.URI);
//seeders
// createMessage(10);
//  createMessagesInChat("66433c40348963b325b0be74",10)

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/user",userRoute)
app.use("/chat",chatRoute)
app.use("/admin",adminRoute)

app.use(errorMiddleware);
app.listen(port, () => {
  console.log("Server is running on http://localhost:3000");
});

