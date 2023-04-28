import { Request, Response, NextFunction } from "express";

import config from "config";

// returns max file size for uploading in MB
const getMaxUploadSize = (): number => {
    return config.get<number>("MAX_UPLOAD_SIZE") / 1000000;
};

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction): void => {

    err.statusCode = err.statusCode || err.code || 500;
    err.message = err.message || "Internal Server Error!";

    if (err.name === 'CastError' || err.name === "JsonWebTokenError" || err.name === "NotBeforeError") {
        err.statusCode = 400;
    } else if ((err.name === 'MongoError' || err.name === 'MongoBulkWriteError') && err.code === 11000) {
        err.statusCode = 409;
    } else if (err.name === "TokenExpiredError") {
        err.statusCode = 401;

        if (err.expiredAt) err.expiredAt = err.expiredAt;
    } else if (err.code === 'LIMIT_FILE_SIZE') {
        err.statusCode = 413;
        err.message = `File/Image size must be smaller than ${getMaxUploadSize()} MB`;
    } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        err.statusCode = 400;
    }

    res.status(err.statusCode).json({
        status: "error",
        statusCode: err.statusCode,
        message: err.message
    });
};