import { Request, Response, NextFunction } from "express";

import _ from "lodash";

import { successResponseHandler } from "../middleware/success-response-handler";

import { addRequestEmployeeInfo, updateRequestEmployeeInfo, getRequestEmployeeList, getRequestEmployeeInfoById, removeRequestEmployeeInfo } from "../services/request-employee-service";

//pass the client valid inputs to service
export const getAll = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const requestEmployee: any = await getRequestEmployeeList(req);

        return await successResponseHandler(res, 200, "Request employee list fetch successfully!", null, requestEmployee);
    } catch (err) {
        return next(err);
    }
};

//pass the client valid inputs to service
export const getInfo = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const id: any = req.params.id;

        const requestEmployee: any = await getRequestEmployeeInfoById(id);

        return await successResponseHandler(res, 200, "Request employee info fetch successfully!", "details", requestEmployee);
    } catch (err) {
        return next(err);
    }
};


//pass the client valid inputs to service
export const addInfo = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        req.body = { requestClientId: req.body.requestClientId, employees: req.body.employees };

        const requestEmployee: any = await addRequestEmployeeInfo(req);

        return await successResponseHandler(res, 201, "Request employee created successfully!", "details", requestEmployee);
    } catch (err) {
        return next(err);
    }
};

//request is passed to service for update
export const updateInfo = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {

        req.body = { id: req.body.id, positionId: req.body.positionId, employeeIds: req.body.employeeIds };

        const requestEmployee: any = await updateRequestEmployeeInfo(req);

        return await successResponseHandler(res, 200, "Request employee info has been updated successfully");

    } catch (err) {
        return next(err);
    }
};

//request is passed to service for update
export const removeInfo = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {

        const requestEmployee: any = await removeRequestEmployeeInfo(req);

        return await successResponseHandler(res, 200, "Request employee info has been removed successfully");

    } catch (err) {
        return next(err);
    }
};

//request is passed to service for updating active status
export const updateStatusInfo = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {

        req.body = { id: req.body.id, active: req.body.active };

        const requestEmployee: any = await updateRequestEmployeeInfo(req);

        return await successResponseHandler(res, 200, "Request employee info has been updated successfully");

    } catch (err) {
        return next(err);
    }
};