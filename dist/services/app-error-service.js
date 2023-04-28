"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAppErrorList = exports.deleteAppErrorInfo = exports.addAppErrorInfo = exports.getAppErrorInfoById = void 0;
const app_error_model_1 = __importDefault(require("../models/app-error-model"));
const user_service_1 = require("./user-service");
//pull AppError info by AppError id if exists
const getAppErrorInfoById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield app_error_model_1.default.findById(id);
    }
    catch (err) {
        throw err;
    }
});
exports.getAppErrorInfoById = getAppErrorInfoById;
//Add AppError to Database
const addAppErrorInfo = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = req.body;
        if (req.body.userId) {
            const userInfo = yield (0, user_service_1.getUserInfoById)(req.body.userId);
            if (!userInfo) {
                const customError = new Error("Invalid user info.");
                customError.statusCode = 400;
                throw customError;
            }
            input.createdBy = input.userId;
        }
        return yield app_error_model_1.default.create(input);
    }
    catch (err) {
        throw err;
    }
});
exports.addAppErrorInfo = addAppErrorInfo;
//remove AppError info and related info
const deleteAppErrorInfo = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const appErrorInfo = yield (0, exports.getAppErrorInfoById)(id);
        if (!appErrorInfo) {
            const customError = new Error("Invalid app error info");
            customError.statusCode = 400;
            throw customError;
        }
        return yield app_error_model_1.default.deleteOne({ _id: id });
    }
    catch (err) {
        throw err;
    }
});
exports.deleteAppErrorInfo = deleteAppErrorInfo;
//get app error list 
const getAppErrorList = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const appErrors = yield app_error_model_1.default.find();
        return {
            count: appErrors.length,
            appErrors
        };
    }
    catch (err) {
        throw err;
    }
});
exports.getAppErrorList = getAppErrorList;
