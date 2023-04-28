import { Request, Response, NextFunction } from "express";

import _ from "lodash";

import { successResponseHandler } from "../middleware/success-response-handler";

import { getMessageList, addMessageInfo, getMessageInfoByFilterQuery } from "../services/message-service";

//pass the client valid inputs to service
export const getAll = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const message: any = await getMessageList(req);

        return await successResponseHandler(res, 200, "Message list fetch successfully!", null, message);
    } catch (err) {
        return next(err);
    }
};

//pass the client valid inputs to service
export const getInfo = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const conversationId: any = req.params.conversationId;

        const message: any = await getMessageInfoByFilterQuery({ conversationId: conversationId });

        return await successResponseHandler(res, 200, "Message info fetch successfully!", "details", message);
    } catch (err) {
        return next(err);
    }
};

//pass the client valid inputs to service
export const addInfo = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        req.body = _.pick(req.body, ["senderId", "receiverId", "text"]);

        const conversation: any = await addMessageInfo(req);

        return await successResponseHandler(res, 201, "Message created successfully!", "details", conversation);
    } catch (err) {
        return next(err);
    }
};