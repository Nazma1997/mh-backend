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
exports.deleteInfo = exports.addInfo = exports.getAll = void 0;
const lodash_1 = __importDefault(require("lodash"));
const success_response_handler_1 = require("../middleware/success-response-handler");
const app_error_service_1 = require("../services/app-error-service");
//pass the to service
const getAll = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const appErrorInfo = yield (0, app_error_service_1.getAppErrorList)(req);
        return yield (0, success_response_handler_1.successResponseHandler)(res, 200, "App error list fetch successfully!", null, appErrorInfo);
    }
    catch (err) {
        return next(err);
    }
});
exports.getAll = getAll;
//pass the app error valid inputs to service
const addInfo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.body = lodash_1.default.pick(req.body, ["name", "description", "userId", "active"]);
        const appErrorInfo = yield (0, app_error_service_1.addAppErrorInfo)(req);
        return yield (0, success_response_handler_1.successResponseHandler)(res, 201, "App error created successfully!", "details", appErrorInfo);
    }
    catch (err) {
        return next(err);
    }
});
exports.addInfo = addInfo;
//pass the delete valid inputs to service
const deleteInfo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const appErrorInfo = yield (0, app_error_service_1.deleteAppErrorInfo)(req);
        return yield (0, success_response_handler_1.successResponseHandler)(res, 200, "App error deleted successfully!");
    }
    catch (err) {
        return next(err);
    }
});
exports.deleteInfo = deleteInfo;
