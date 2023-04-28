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
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStatusInfo = exports.updateInfo = exports.addInfo = exports.getInfo = exports.getAll = void 0;
const success_response_handler_1 = require("../middleware/success-response-handler");
const terms_condition_service_1 = require("../services/terms-condition-service");
//pass the client valid inputs to service
const getAll = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const termsCondition = yield (0, terms_condition_service_1.getTermsConditionList)(req);
        return yield (0, success_response_handler_1.successResponseHandler)(res, 200, "Terms and condition list fetch successfully!", null, termsCondition);
    }
    catch (err) {
        return next(err);
    }
});
exports.getAll = getAll;
//pass the client valid inputs to service
const getInfo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const termsCondition = yield (0, terms_condition_service_1.getTermsConditionInfoById)(id);
        return yield (0, success_response_handler_1.successResponseHandler)(res, 200, "Terms and condition info fetch successfully!", "details", termsCondition);
    }
    catch (err) {
        return next(err);
    }
});
exports.getInfo = getInfo;
//pass the client valid inputs to service
const addInfo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.body = { description: req.body.description, active: req.body.active };
        const termsCondition = yield (0, terms_condition_service_1.addTermsConditionInfo)(req);
        return yield (0, success_response_handler_1.successResponseHandler)(res, 201, "Terms and condition created successfully!", "details", termsCondition);
    }
    catch (err) {
        return next(err);
    }
});
exports.addInfo = addInfo;
//request is passed to service for update
const updateInfo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.body = { id: req.body.id, description: req.body.description, active: req.body.active };
        const termsCondition = yield (0, terms_condition_service_1.updateTermsConditionInfo)(req);
        return yield (0, success_response_handler_1.successResponseHandler)(res, 200, "Terms and condition info has been updated successfully");
    }
    catch (err) {
        return next(err);
    }
});
exports.updateInfo = updateInfo;
//request is passed to service for updating active status
const updateStatusInfo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.body = { id: req.body.id, active: req.body.active };
        const termsCondition = yield (0, terms_condition_service_1.updateTermsConditionInfo)(req);
        return yield (0, success_response_handler_1.successResponseHandler)(res, 200, "Terms and condition info has been updated successfully");
    }
    catch (err) {
        return next(err);
    }
});
exports.updateStatusInfo = updateStatusInfo;
