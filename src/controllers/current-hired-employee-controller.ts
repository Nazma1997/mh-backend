import { Request, Response, NextFunction } from "express";

import _ from "lodash";

import { successResponseHandler } from "../middleware/success-response-handler";

import { addCurrentHiredEmployeeInfo, updateCurrentHiredEmployeeInfo, updateCurrentHiredEmployeeStatusInfo, getCurrentHiredEmployeeList, getCurrentHiredEmployeeInfoById, getCurrentHiredEmployeeCheckInCheckOutInfo } from "../services/current-hired-employee-service";

//pass the to valid inputs to service
export const getAll = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const currentHiredEmployee: any = await getCurrentHiredEmployeeList(req);

        return await successResponseHandler(res, 200, "Current hired employee list fetch successfully!", null, currentHiredEmployee);
    } catch (err) {
        return next(err);
    }
};

//pass the to valid inputs to service
export const getInfo = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const id: any = req.params.id;

        const currentHiredEmployee: any = await getCurrentHiredEmployeeInfoById(id);

        return await successResponseHandler(res, 200, "Current hired employee info fetch successfully!", "details", currentHiredEmployee);
    } catch (err) {
        return next(err);
    }
};

//pass the to valid inputs to service
export const getCheckInfo = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {

        const currentHiredEmployee: any = await getCurrentHiredEmployeeCheckInCheckOutInfo(req);

        return await successResponseHandler(res, 200, "Current hired employee info fetch successfully!", "details", currentHiredEmployee);
    } catch (err) {
        return next(err);
    }
};

//pass the client valid inputs to service
export const addInfo = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        req.body = _.pick(req.body, ["employeeId", "checkIn", "emmergencyCheckIn", "emmergencyCheckInComment", "lat", "long", "checkInDistance"]);

        const currentHiredEmployee: any = await addCurrentHiredEmployeeInfo(req);

        return await successResponseHandler(res, 201, "Current hired employee created successfully!", "details", currentHiredEmployee);
    } catch (err) {
        return next(err);
    }
};

//request is passed to service for update
export const updateInfo = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {

        req.body = _.pick(req.body, ["id", "checkOut", "emmergencyCheckOut", "breakTime", "emmergencyCheckOutComment", "lat", "long", "checkOutDistance"]);

        const currentHiredEmployee: any = await updateCurrentHiredEmployeeInfo(req);

        return await successResponseHandler(res, 200, "Current hired employee info has been updated successfully");

    } catch (err) {
        return next(err);
    }
};

//request is passed to service for updating active status
export const updateStatusInfo = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {

        req.body = _.pick(req.body, ["id", "checkIn", "checkOut", "clientComment", "clientBreakTime", "clientCheckInTime", "clientCheckOutTime"]);

        const currentHiredEmployee: any = await updateCurrentHiredEmployeeStatusInfo(req);

        return await successResponseHandler(res, 200, "Current hired employee info has been updated successfully");

    } catch (err) {
        return next(err);
    }
};