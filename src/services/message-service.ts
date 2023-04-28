import { Request } from "express";
import mongoose, { FilterQuery, DocumentDefinition, ObjectId } from "mongoose";

import _ from "lodash";

import { getPagination } from "../helpers/pagination-helper";
import Message, { MessageDocument } from "../models/message-model";
import { getUserInfoById } from "./user-service";


//pull message info by messageId if exists
export const getMessageInfoById = async (id: ObjectId) => {
    try {
        return await Message.findById(id);
    } catch (err: any) {
        throw err;
    }
};

//getting message info by filter query
export const getMessageInfoByFilterQuery = async (query: FilterQuery<MessageDocument>) => {
    try {
        return await Message.findOne(query);
    } catch (err: any) {
        throw err;
    }
};

//getting message info by filter query
export const getMessagesByFilterQuery = async (query: FilterQuery<MessageDocument>, fileds?: Object) => {
    try {
        let selectedFileds: Object = {};
        if (fileds) selectedFileds = fileds;

        return await Message.find(query, selectedFileds);
    } catch (err: any) {
        throw err;
    }
};

//Add conversation info to Database
export const addMessageInfo = async (req: Request) => {
    try {
        const input: DocumentDefinition<MessageDocument> = req.body;

        //@ts-ignore
        const loggedInUserInfo: any = req.user;
        input.createdBy = loggedInUserInfo._id;

        //Start sender details
        if (input.senderId) {
            const senderInfo: any = await getUserInfoById(req.body.senderId);

            const senderDetails: any = {
                senderId: senderInfo._id,
                name: senderInfo.name,
                profilePicture: senderInfo.profilePicture,
            };

            input.senderDetails = senderDetails;
        }
        //End sender details

        //Start receiver details
        if (input.receiverId) {
            const receiverInfo: any = await getUserInfoById(req.body.receiverId);

            const receiverDetails: any = {
                receiverId: receiverInfo._id,
                name: receiverInfo.name,
                profilePicture: receiverInfo.profilePicture,
            };

            input.receiverDetails = receiverDetails;
        }
        //End receiver details

        const addMessageInfo: any = await Message.create(input);

        // emit socket event
        //@ts-ignore
        global.io.emit("new_message", {
            message: {
                senderDetails: input.senderDetails,
                receiverDetails: input.receiverDetails,
                text: input.text,
                dateTime: addMessageInfo.dateTime,
            },
        });

        return addMessageInfo
    } catch (err: any) {
        throw err;
    }
};

//Get All Reader API
export const getMessageList = async (req: Request) => {
    try {
        const pagination = await getPagination(req);

        let query: FilterQuery<MessageDocument> = {};

        const { receiverId, senderId }: any = req.query;

        if (!receiverId || !senderId) {
            const customError: any = new Error("Sender or receiver must be given!");
            customError.statusCode = 400;
            throw customError;
        } else {

            query = {
                $or: [
                    { receiverId: new mongoose.Types.ObjectId(receiverId) },
                    { senderId: new mongoose.Types.ObjectId(receiverId) },
                    { receiverId: new mongoose.Types.ObjectId(senderId) },
                    { senderId: new mongoose.Types.ObjectId(senderId) },
                ],
            };
        }

        const messages = await Message.find(query, {}, pagination);

        return {
            count: messages.length,
            next: messages.length === pagination.limit ? pagination.skip + pagination.limit : null,
            messages
        };

    } catch (err: any) {
        throw err;
    }
};