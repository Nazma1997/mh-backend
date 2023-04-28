import { Request, Response, NextFunction } from "express";

import _ from "lodash";

import { successResponseHandler } from "../middleware/success-response-handler";

import { addAppErrorInfo, getAppErrorList, deleteAppErrorInfo } from "../services/app-error-service";

//pass the to service
export const getAll = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const appErrorInfo: any = await getAppErrorList(req);

        return await successResponseHandler(res, 200, "App error list fetch successfully!", null, appErrorInfo);
    } catch (err) {
        return next(err);
    }
};

//pass the app error valid inputs to service
export const addInfo = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        req.body = _.pick(req.body, ["name", "description", "userId", "active"]);

        const appErrorInfo: any = await addAppErrorInfo(req);

        return await successResponseHandler(res, 201, "App error created successfully!", "details", appErrorInfo);
    } catch (err) {
        return next(err);
    }
};

//pass the delete valid inputs to service
export const deleteInfo = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const appErrorInfo: any = await deleteAppErrorInfo(req);

        return await successResponseHandler(res, 200, "App error deleted successfully!");
    } catch (err) {
        return next(err);
    }
};