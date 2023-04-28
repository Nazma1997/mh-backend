import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

const ValidateRequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: "error",
            statusCode: 400,
            errors: errors.array()
        });
    }

    return next();
};

export default ValidateRequestHandler;