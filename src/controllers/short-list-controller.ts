import { Request, Response, NextFunction } from "express";

import _ from "lodash";

import { successResponseHandler } from "../middleware/success-response-handler";

import { addShortListInfo, updateShortListInfo, getShortListInfo, deleteShortListInfo } from "../services/short-list-service";

//pass the client valid inputs to service
export const getAll = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const shotList: any = await getShortListInfo(req);

        return await successResponseHandler(res, 201, "Short list fetch successfully!", null, shotList);
    } catch (err) {
        return next(err);
    }
};

//pass the client valid inputs to service
export const addInfo = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        req.body = { employeeId: req.body.employeeId };

        const shortList: any = await addShortListInfo(req);

        return await successResponseHandler(res, 201, "Shot list created successfully!", "details", shortList);
    } catch (err) {
        return next(err);
    }
};

//request is passed to service for update
export const updateInfo = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {

        req.body = { id: req.body.id, fromDate: req.body.fromDate, toDate: req.body.toDate };

        const shortList: any = await updateShortListInfo(req);

        return await successResponseHandler(res, 200, "Shot list info has been updated successfully");

    } catch (err) {
        return next(err);
    }
};

//request is passed to service for delete
export const deleteInfo = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {

        const shortList: any = await deleteShortListInfo(req);

        return await successResponseHandler(res, 200, "Shot list info has been deleted successfully");

    } catch (err) {
        return next(err);
    }
};