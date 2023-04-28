import { Request, Response, NextFunction } from "express";

import _ from "lodash";

import { successResponseHandler } from "../middleware/success-response-handler";

import { addTermsConditionInfo, updateTermsConditionInfo, getTermsConditionList, getTermsConditionInfoById } from "../services/terms-condition-service";

//pass the client valid inputs to service
export const getAll = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const termsCondition: any = await getTermsConditionList(req);

        return await successResponseHandler(res, 200, "Terms and condition list fetch successfully!", null, termsCondition);
    } catch (err) {
        return next(err);
    }
};

//pass the client valid inputs to service
export const getInfo = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const id: any = req.params.id;

        const termsCondition: any = await getTermsConditionInfoById(id);

        return await successResponseHandler(res, 200, "Terms and condition info fetch successfully!", "details", termsCondition);
    } catch (err) {
        return next(err);
    }
};

//pass the client valid inputs to service
export const addInfo = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        req.body = { description: req.body.description, active: req.body.active };

        const termsCondition: any = await addTermsConditionInfo(req);

        return await successResponseHandler(res, 201, "Terms and condition created successfully!", "details", termsCondition);
    } catch (err) {
        return next(err);
    }
};

//request is passed to service for update
export const updateInfo = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {

        req.body = { id: req.body.id, description: req.body.description, active: req.body.active };

        const termsCondition: any = await updateTermsConditionInfo(req);

        return await successResponseHandler(res, 200, "Terms and condition info has been updated successfully");

    } catch (err) {
        return next(err);
    }
};

//request is passed to service for updating active status
export const updateStatusInfo = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {

        req.body = { id: req.body.id, active: req.body.active };

        const termsCondition: any = await updateTermsConditionInfo(req);

        return await successResponseHandler(res, 200, "Terms and condition info has been updated successfully");

    } catch (err) {
        return next(err);
    }
};