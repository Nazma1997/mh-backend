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
exports.updateInfo = void 0;
const lodash_1 = __importDefault(require("lodash"));
const success_response_handler_1 = require("../middleware/success-response-handler");
const app_version_service_1 = require("../services/app-version-service");
//pass the app error valid inputs to service
const updateInfo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.body = lodash_1.default.pick(req.body, ["appVersion", "updateRequired"]);
        const appVersionInfo = yield (0, app_version_service_1.updateAppVersionInfo)(req);
        return yield (0, success_response_handler_1.successResponseHandler)(res, 200, "App version updated successfully!", "details", appVersionInfo);
    }
    catch (err) {
        return next(err);
    }
});
exports.updateInfo = updateInfo;
