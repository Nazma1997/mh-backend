import { Request, Response, NextFunction } from "express";

import _ from "lodash";

import { successResponseHandler } from "../middleware/success-response-handler";

import { addConversationInfo, getConversationList, getUserChatConversationInfo, getConversationInfoById, getConversationInfoBasedOnFirstAndSecondId } from "../services/conversation-service";

//pass the client valid inputs to service
export const getAll = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const conversation: any = await getConversationList(req);

        return await successResponseHandler(res, 200, "Conversation list fetch successfully!", null, conversation);
    } catch (err) {
        return next(err);
    }
};

//pass the client valid inputs to service
export const getInfo = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const id: any = req.params.id;

        const conversation: any = await getConversationInfoById(id);

        return await successResponseHandler(res, 200, "Conversation info fetch successfully!", "details", conversation);
    } catch (err) {
        return next(err);
    }
};

//pass the client valid inputs to service
export const getUserChatBasedOnFirstAndSecondIdInfo = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const id: any = req.params.id;

        const conversation: any = await getConversationInfoBasedOnFirstAndSecondId(id);

        return await successResponseHandler(res, 200, "Conversation info fetch successfully!", "details", conversation);
    } catch (err) {
        return next(err);
    }
};

//pass the client valid inputs to service
export const getUserChatInfo = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {

        const conversation: any = await getUserChatConversationInfo(req);

        return await successResponseHandler(res, 200, "User conversation info fetch successfully!", "details", conversation);
    } catch (err) {
        return next(err);
    }
};

//pass the client valid inputs to service
export const addInfo = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        req.body = { senderId: req.body.senderId, receiverId: req.body.receiverId };

        const conversation: any = await addConversationInfo(req);

        return await successResponseHandler(res, 201, "Conversation created successfully!", "details", conversation);
    } catch (err) {
        return next(err);
    }
};