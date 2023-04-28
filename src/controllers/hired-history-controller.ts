import { Request, Response, NextFunction } from "express";

import _ from "lodash";

import { successResponseHandler } from "../middleware/success-response-handler";

import { getHiredHistoryList, getEmployeeHiredHistoryListForClient, addHiredHistoryInfo } from "../services/hired-history-service";

//pass the hired history valid inputs to service
export const getAll = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const getData: any = await getHiredHistoryList(req);

        return await successResponseHandler(res, 200, "Hired history list fetch successfully!", null, getData);
    } catch (err) {
        return next(err);
    }
};

//pass the hired history valid inputs to service
export const getAllEmployeeList = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const getData: any = await getEmployeeHiredHistoryListForClient(req);

        return await successResponseHandler(res, 200, "Hired history list fetch successfully!", null, getData);
    } catch (err) {
        return next(err);
    }
};

//request is passed to service
export const addInfo = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {

        req.body = { selectedShortlist: req.body.selectedShortlist };

        const hiredUser: any = await addHiredHistoryInfo(req);

        return await successResponseHandler(res, 200, "Hired info has been added successfully");

    } catch (err) {
        return next(err);
    }
};