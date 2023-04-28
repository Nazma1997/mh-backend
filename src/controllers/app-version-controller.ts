import { Request, Response, NextFunction } from "express";

import _ from "lodash";

import { successResponseHandler } from "../middleware/success-response-handler";

import { updateAppVersionInfo } from "../services/app-version-service";


//pass the app error valid inputs to service
export const updateInfo = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        req.body = _.pick(req.body, ["appVersion", "updateRequired"]);

        const appVersionInfo: any = await updateAppVersionInfo(req);

        return await successResponseHandler(res, 200, "App version updated successfully!", "details", appVersionInfo);
    } catch (err) {
        return next(err);
    }
};