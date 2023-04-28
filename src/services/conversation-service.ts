import { Request } from "express";
import { FilterQuery, DocumentDefinition, ObjectId } from "mongoose";

import _ from "lodash";

import { getPagination } from "../helpers/pagination-helper";
import Conversation, { ConversationDocument } from "../models/conversation-model";


//pull conversation info by conversationId if exists
export const getConversationInfoById = async (id: ObjectId) => {
    try {
        return await Conversation.findById(id);
    } catch (err: any) {
        throw err;
    }
};

//getting conversation info by filter query
export const getConversationInfoByFilterQuery = async (query: FilterQuery<ConversationDocument>) => {
    try {
        return await Conversation.findOne(query);
    } catch (err: any) {
        throw err;
    }
};

//getting conversation info by filter query
export const getConversationsByFilterQuery = async (query: FilterQuery<ConversationDocument>, fileds?: Object) => {
    try {
        let selectedFileds: Object = {};
        if (fileds) selectedFileds = fileds;

        return await Conversation.find(query, selectedFileds);
    } catch (err: any) {
        throw err;
    }
};

//Add conversation info to Database
export const addConversationInfo = async (req: Request) => {
    try {
        const input: DocumentDefinition<ConversationDocument> = req.body;

        //@ts-ignore
        const loggedInUserInfo: any = req.user;

        input.members = [req.body.senderId, req.body.receiverId];
        input.createdBy = loggedInUserInfo._id;

        return await Conversation.create(input);

    } catch (err: any) {
        throw err;
    }
};

//remove conversation info and related info
export const removeConversationInfo = async (req: Request) => {
    try {

        const query = { _id: req.body.id };

        const conversationInfo: any = await getConversationInfoByFilterQuery(query);

        if (!conversationInfo) {
            const customError: any = new Error("Invalid conversation info");
            customError.statusCode = 400;
            throw customError;
        }

        return await Conversation.updateOne(query, { $set: { deleted: true, active: false } });

    } catch (err: any) {
        throw err;
    }
};

//Get All Reader API
export const getConversationList = async (req: Request) => {
    try {
        const pagination = await getPagination(req);

        const query: FilterQuery<ConversationDocument> = {};

        const { active } = req.query;
        const searchKeyword: any = req.query.searchKeyword;

        if (active === "YES") query.active = true;
        else if (active === "NO") query.active = false;

        if (searchKeyword) {
            let regExSearch = new RegExp(searchKeyword, 'i');
            query.name = regExSearch;
        }

        const conversations = await Conversation.find(query, {}, pagination);
        const totalConversations = await Conversation.find(query).count();

        return {
            total: totalConversations,
            count: conversations.length,
            next: conversations.length === pagination.limit ? pagination.skip + pagination.limit : null,
            conversations
        };

    } catch (err: any) {
        throw err;
    }
};

//get list for dropdown 
export const getUserChatConversationInfo = async (req: Request) => {
    try {

        return await getConversationInfoByFilterQuery({ members: { $in: [req.params.userId] } });

    } catch (err: any) {
        throw err;
    }
};

//get list for dropdown 
export const getConversationInfoBasedOnFirstAndSecondId = async (req: Request) => {
    try {

        return await getConversationInfoByFilterQuery({ members: { $all: [req.params.firstId, req.params.secondId] } });

    } catch (err: any) {
        throw err;
    }
};