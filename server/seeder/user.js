/* eslint-disable prettier/prettier */
import { create } from "domain";
import User from "../models/user.js";
import {faker} from "@faker-js/faker";


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

export {createUSer}