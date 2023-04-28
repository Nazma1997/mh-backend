import { Request, Response, NextFunction } from "express";

import _ from "lodash";

import { successResponseHandler } from "../middleware/success-response-handler";

import { addSourceInfo, updateSourceInfo, getSourceList, getSourceListForDropDown, getSourceInfoById } from "../services/source-service";

//pass the to service
export const getAll = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const source: any = await getSourceList(req);

        return await successResponseHandler(res, 200, "Source  list fetch successfully!", null, source);
    } catch (err) {
        return next(err);
    }
};

//pass the to service
export const getInfo = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const id: any = req.params.id;

        const source: any = await getSourceInfoById(id);

        return await successResponseHandler(res, 200, "Source  info fetch successfully!", "details", source);
    } catch (err) {
        return next(err);
    }
};

//pass the to service
export const getAllForDropDown = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const source: any = await getSourceListForDropDown(req);

        return await successResponseHandler(res, 200, "Source  list fetch successfully!", null, source);
    } catch (err) {
        return next(err);
    }
};

//pass the to service
export const addInfo = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        req.body = { name: req.body.name, active: req.body.active };

        const source: any = await addSourceInfo(req);

        return await successResponseHandler(res, 201, "Source  created successfully!", "details", source);
    } catch (err) {
        return next(err);
    }
};

//request is passed to service for update
export const updateInfo = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {

        req.body = { id: req.body.id, name: req.body.name, active: req.body.active };

        const source: any = await updateSourceInfo(req);

        return await successResponseHandler(res, 200, "Source  info has been updated successfully");

    } catch (err) {
        return next(err);
    }
};

//request is passed to service for updating active status
export const updateStatusInfo = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {

        req.body = { id: req.body.id, active: req.body.active };

        const source: any = await updateSourceInfo(req);

        return await successResponseHandler(res, 200, "Source  info has been updated successfully");

    } catch (err) {
        return next(err);
    }
};