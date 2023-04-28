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
exports.deleteInfo = exports.updateInfo = exports.addInfo = exports.getAll = void 0;
const success_response_handler_1 = require("../middleware/success-response-handler");
const short_list_service_1 = require("../services/short-list-service");
//pass the client valid inputs to service
const getAll = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const shotList = yield (0, short_list_service_1.getShortListInfo)(req);
        return yield (0, success_response_handler_1.successResponseHandler)(res, 201, "Short list fetch successfully!", null, shotList);
    }
    catch (err) {
        return next(err);
    }
});
exports.getAll = getAll;
//pass the client valid inputs to service
const addInfo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.body = { employeeId: req.body.employeeId };
        const shortList = yield (0, short_list_service_1.addShortListInfo)(req);
        return yield (0, success_response_handler_1.successResponseHandler)(res, 201, "Shot list created successfully!", "details", shortList);
    }
    catch (err) {
        return next(err);
    }
});
exports.addInfo = addInfo;
//request is passed to service for update
const updateInfo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.body = { id: req.body.id, fromDate: req.body.fromDate, toDate: req.body.toDate };
        const shortList = yield (0, short_list_service_1.updateShortListInfo)(req);
        return yield (0, success_response_handler_1.successResponseHandler)(res, 200, "Shot list info has been updated successfully");
    }
    catch (err) {
        return next(err);
    }
});
exports.updateInfo = updateInfo;
//request is passed to service for delete
const deleteInfo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const shortList = yield (0, short_list_service_1.deleteShortListInfo)(req);
        return yield (0, success_response_handler_1.successResponseHandler)(res, 200, "Shot list info has been deleted successfully");
    }
    catch (err) {
        return next(err);
    }
});
exports.deleteInfo = deleteInfo;
