import { Request, Response, NextFunction } from "express";

import _ from "lodash";

import { successResponseHandler } from "../middleware/success-response-handler";

import { addPositionInfo, updatePositionInfo, getPositionList, getPositionListForDropDown, getPositionInfoById } from "../services/position-service";

//pass the client valid inputs to service
export const getAll = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const position: any = await getPositionList(req);

        return await successResponseHandler(res, 200, "Position list fetch successfully!", null, position);
    } catch (err) {
        return next(err);
    }
};

//pass the client valid inputs to service
export const getInfo = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const id: any = req.params.id;

        const position: any = await getPositionInfoById(id);

        return await successResponseHandler(res, 200, "Position info fetch successfully!", "details", position);
    } catch (err) {
        return next(err);
    }
};

//pass the client valid inputs to service
export const getAllForDropDown = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const position: any = await getPositionListForDropDown(req);

        return await successResponseHandler(res, 200, "Position list fetch successfully!", null, position);
    } catch (err) {
        return next(err);
    }
};

//pass the client valid inputs to service
export const addInfo = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        req.body = { name: req.body.name, active: req.body.active };

        const position: any = await addPositionInfo(req);

        return await successResponseHandler(res, 201, "Position created successfully!", "details", position);
    } catch (err) {
        return next(err);
    }
};

//request is passed to service for update
export const updateInfo = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {

        req.body = { id: req.body.id, name: req.body.name, active: req.body.active };

        const position: any = await updatePositionInfo(req);

        return await successResponseHandler(res, 200, "Position info has been updated successfully");

    } catch (err) {
        return next(err);
    }
};

//request is passed to service for updating active status
export const updateStatusInfo = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {

        req.body = { id: req.body.id, active: req.body.active };

        const position: any = await updatePositionInfo(req);

        return await successResponseHandler(res, 200, "Position info has been updated successfully");

    } catch (err) {
        return next(err);
    }
};