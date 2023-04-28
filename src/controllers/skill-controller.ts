import { Request, Response, NextFunction } from "express";

import _ from "lodash";

import { successResponseHandler } from "../middleware/success-response-handler";

import { addSkillInfo, updateSkillInfo, getSkillList, getSkillListForDropDown, getSkillInfoById } from "../services/skill-service";

//pass the to service
export const getAll = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const skill: any = await getSkillList(req);

        return await successResponseHandler(res, 200, "Skill list fetch successfully!", null, skill);
    } catch (err) {
        return next(err);
    }
};

//pass the to service
export const getInfo = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const id: any = req.params.id;

        const skill: any = await getSkillInfoById(id);

        return await successResponseHandler(res, 200, "Skill info fetch successfully!", "details", skill);
    } catch (err) {
        return next(err);
    }
};

//pass the to service
export const getAllForDropDown = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const skill: any = await getSkillListForDropDown(req);

        return await successResponseHandler(res, 200, "Skill list fetch successfully!", null, skill);
    } catch (err) {
        return next(err);
    }
};

//pass the skill valid inputs to service
export const addInfo = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        req.body = { name: req.body.name, active: req.body.active };

        const skill: any = await addSkillInfo(req);

        return await successResponseHandler(res, 201, "Skill created successfully!", "details", skill);
    } catch (err) {
        return next(err);
    }
};

//request is passed to service for update
export const updateInfo = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {

        req.body = { id: req.body.id, name: req.body.name, active: req.body.active };

        const skill: any = await updateSkillInfo(req);

        return await successResponseHandler(res, 200, "Skill info has been updated successfully");

    } catch (err) {
        return next(err);
    }
};

//request is passed to service for updating active status
export const updateStatusInfo = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {

        req.body = { id: req.body.id, active: req.body.active };

        const skill: any = await updateSkillInfo(req);

        return await successResponseHandler(res, 200, "Skill info has been updated successfully");

    } catch (err) {
        return next(err);
    }
};