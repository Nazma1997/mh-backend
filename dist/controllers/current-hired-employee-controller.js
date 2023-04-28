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
exports.updateStatusInfo = exports.updateInfo = exports.addInfo = exports.getCheckInfo = exports.getInfo = exports.getAll = void 0;
const lodash_1 = __importDefault(require("lodash"));
const success_response_handler_1 = require("../middleware/success-response-handler");
const current_hired_employee_service_1 = require("../services/current-hired-employee-service");
//pass the to valid inputs to service
const getAll = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const currentHiredEmployee = yield (0, current_hired_employee_service_1.getCurrentHiredEmployeeList)(req);
        return yield (0, success_response_handler_1.successResponseHandler)(res, 200, "Current hired employee list fetch successfully!", null, currentHiredEmployee);
    }
    catch (err) {
        return next(err);
    }
});
exports.getAll = getAll;
//pass the to valid inputs to service
const getInfo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const currentHiredEmployee = yield (0, current_hired_employee_service_1.getCurrentHiredEmployeeInfoById)(id);
        return yield (0, success_response_handler_1.successResponseHandler)(res, 200, "Current hired employee info fetch successfully!", "details", currentHiredEmployee);
    }
    catch (err) {
        return next(err);
    }
});
exports.getInfo = getInfo;
//pass the to valid inputs to service
const getCheckInfo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const currentHiredEmployee = yield (0, current_hired_employee_service_1.getCurrentHiredEmployeeCheckInCheckOutInfo)(req);
        return yield (0, success_response_handler_1.successResponseHandler)(res, 200, "Current hired employee info fetch successfully!", "details", currentHiredEmployee);
    }
    catch (err) {
        return next(err);
    }
});
exports.getCheckInfo = getCheckInfo;
//pass the client valid inputs to service
const addInfo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.body = lodash_1.default.pick(req.body, ["employeeId", "checkIn", "emmergencyCheckIn", "emmergencyCheckInComment", "lat", "long", "checkInDistance"]);
        const currentHiredEmployee = yield (0, current_hired_employee_service_1.addCurrentHiredEmployeeInfo)(req);
        return yield (0, success_response_handler_1.successResponseHandler)(res, 201, "Current hired employee created successfully!", "details", currentHiredEmployee);
    }
    catch (err) {
        return next(err);
    }
});
exports.addInfo = addInfo;
//request is passed to service for update
const updateInfo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.body = lodash_1.default.pick(req.body, ["id", "checkOut", "emmergencyCheckOut", "breakTime", "emmergencyCheckOutComment", "lat", "long", "checkOutDistance"]);
        const currentHiredEmployee = yield (0, current_hired_employee_service_1.updateCurrentHiredEmployeeInfo)(req);
        return yield (0, success_response_handler_1.successResponseHandler)(res, 200, "Current hired employee info has been updated successfully");
    }
    catch (err) {
        return next(err);
    }
});
exports.updateInfo = updateInfo;
//request is passed to service for updating active status
const updateStatusInfo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.body = lodash_1.default.pick(req.body, ["id", "checkIn", "checkOut", "clientComment", "clientBreakTime", "clientCheckInTime", "clientCheckOutTime"]);
        const currentHiredEmployee = yield (0, current_hired_employee_service_1.updateCurrentHiredEmployeeStatusInfo)(req);
        return yield (0, success_response_handler_1.successResponseHandler)(res, 200, "Current hired employee info has been updated successfully");
    }
    catch (err) {
        return next(err);
    }
});
exports.updateStatusInfo = updateStatusInfo;
