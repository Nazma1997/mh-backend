import { Request, Response, NextFunction } from "express";

import _ from "lodash";

import { successResponseHandler } from "../middleware/success-response-handler";

import { getCheckInCheckOutHistoryList, getCheckInCheckOutHistoryListForEmployee, getCheckInCheckOutHistoryInfoById } from "../services/check-in-check-out-history-service";

//pass the to valid inputs to service
export const getAll = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const checkInCheckOutHistory: any = await getCheckInCheckOutHistoryList(req);

        return await successResponseHandler(res, 200, "Check in check out history list fetch successfully!", null, checkInCheckOutHistory);
    } catch (err) {
        return next(err);
    }
};

//pass the to valid inputs to service
export const getAllForEmployee = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const checkInCheckOutHistory: any = await getCheckInCheckOutHistoryListForEmployee(req);

        return await successResponseHandler(res, 200, "Check in check out history list fetch successfully!", null, checkInCheckOutHistory);
    } catch (err) {
        return next(err);
    }
};

//pass the to valid inputs to service
export const getInfo = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const id: any = req.params.id;

        const checkInCheckOutHistory: any = await getCheckInCheckOutHistoryInfoById(id);

        return await successResponseHandler(res, 200, "Check in check out history info fetch successfully!", "details", checkInCheckOutHistory);
    } catch (err) {
        return next(err);
    }
};