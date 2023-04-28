"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const config_1 = __importDefault(require("config"));
// returns max file size for uploading in MB
const getMaxUploadSize = () => {
    return config_1.default.get("MAX_UPLOAD_SIZE") / 1000000;
};
const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || err.code || 500;
    err.message = err.message || "Internal Server Error!";
    if (err.name === 'CastError' || err.name === "JsonWebTokenError" || err.name === "NotBeforeError") {
        err.statusCode = 400;
    }
    else if ((err.name === 'MongoError' || err.name === 'MongoBulkWriteError') && err.code === 11000) {
        err.statusCode = 409;
    }
    else if (err.name === "TokenExpiredError") {
        err.statusCode = 401;
        if (err.expiredAt)
            err.expiredAt = err.expiredAt;
    }
    else if (err.code === 'LIMIT_FILE_SIZE') {
        err.statusCode = 413;
        err.message = `File/Image size must be smaller than ${getMaxUploadSize()} MB`;
    }
    else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        err.statusCode = 400;
    }
    res.status(err.statusCode).json({
        status: "error",
        statusCode: err.statusCode,
        message: err.message
    });
};
exports.errorHandler = errorHandler;
