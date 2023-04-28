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
exports.getInfo = exports.getAllForEmployee = exports.getAll = void 0;
const success_response_handler_1 = require("../middleware/success-response-handler");
const check_in_check_out_history_service_1 = require("../services/check-in-check-out-history-service");
//pass the to valid inputs to service
const getAll = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const checkInCheckOutHistory = yield (0, check_in_check_out_history_service_1.getCheckInCheckOutHistoryList)(req);
        return yield (0, success_response_handler_1.successResponseHandler)(res, 200, "Check in check out history list fetch successfully!", null, checkInCheckOutHistory);
    }
    catch (err) {
        return next(err);
    }
});
exports.getAll = getAll;
//pass the to valid inputs to service
const getAllForEmployee = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const checkInCheckOutHistory = yield (0, check_in_check_out_history_service_1.getCheckInCheckOutHistoryListForEmployee)(req);
        return yield (0, success_response_handler_1.successResponseHandler)(res, 200, "Check in check out history list fetch successfully!", null, checkInCheckOutHistory);
    }
    catch (err) {
        return next(err);
    }
});
exports.getAllForEmployee = getAllForEmployee;
//pass the to valid inputs to service
const getInfo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const checkInCheckOutHistory = yield (0, check_in_check_out_history_service_1.getCheckInCheckOutHistoryInfoById)(id);
        return yield (0, success_response_handler_1.successResponseHandler)(res, 200, "Check in check out history info fetch successfully!", "details", checkInCheckOutHistory);
    }
    catch (err) {
        return next(err);
    }
});
exports.getInfo = getInfo;
