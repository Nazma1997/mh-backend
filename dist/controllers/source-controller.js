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
exports.updateStatusInfo = exports.updateInfo = exports.addInfo = exports.getAllForDropDown = exports.getInfo = exports.getAll = void 0;
const success_response_handler_1 = require("../middleware/success-response-handler");
const source_service_1 = require("../services/source-service");
//pass the to service
const getAll = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const source = yield (0, source_service_1.getSourceList)(req);
        return yield (0, success_response_handler_1.successResponseHandler)(res, 200, "Source  list fetch successfully!", null, source);
    }
    catch (err) {
        return next(err);
    }
});
exports.getAll = getAll;
//pass the to service
const getInfo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const source = yield (0, source_service_1.getSourceInfoById)(id);
        return yield (0, success_response_handler_1.successResponseHandler)(res, 200, "Source  info fetch successfully!", "details", source);
    }
    catch (err) {
        return next(err);
    }
});
exports.getInfo = getInfo;
//pass the to service
const getAllForDropDown = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const source = yield (0, source_service_1.getSourceListForDropDown)(req);
        return yield (0, success_response_handler_1.successResponseHandler)(res, 200, "Source  list fetch successfully!", null, source);
    }
    catch (err) {
        return next(err);
    }
});
exports.getAllForDropDown = getAllForDropDown;
//pass the to service
const addInfo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.body = { name: req.body.name, active: req.body.active };
        const source = yield (0, source_service_1.addSourceInfo)(req);
        return yield (0, success_response_handler_1.successResponseHandler)(res, 201, "Source  created successfully!", "details", source);
    }
    catch (err) {
        return next(err);
    }
});
exports.addInfo = addInfo;
//request is passed to service for update
const updateInfo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.body = { id: req.body.id, name: req.body.name, active: req.body.active };
        const source = yield (0, source_service_1.updateSourceInfo)(req);
        return yield (0, success_response_handler_1.successResponseHandler)(res, 200, "Source  info has been updated successfully");
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
        const source = yield (0, source_service_1.updateSourceInfo)(req);
        return yield (0, success_response_handler_1.successResponseHandler)(res, 200, "Source  info has been updated successfully");
    }
    catch (err) {
        return next(err);
    }
});
exports.updateStatusInfo = updateStatusInfo;
