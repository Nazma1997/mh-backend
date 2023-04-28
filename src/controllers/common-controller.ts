import { Request, Response, NextFunction } from "express";

import _ from "lodash";

import { successResponseHandler } from "../middleware/success-response-handler";

import { getPositionSkillAndSourceList} from "../services/common-service";

//pass the client valid inputs to service
export const getAll = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const getData: any = await getPositionSkillAndSourceList(req);

        return await successResponseHandler(res, 200, "Position, skill and source list fetch successfully!", null, getData);
    } catch (err) {
        return next(err);
    }
};