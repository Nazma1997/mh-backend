"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("@awaitjs/express"));
const auth_1 = require("../middleware/auth");
const request_employee_controller_1 = require("../controllers/request-employee-controller");
const validate_request_handler_1 = __importDefault(require("../middleware/validate-request-handler"));
const request_employee_add_request_1 = __importDefault(require("../requests/request-employee-add-request"));
const request_employee_update_request_1 = require("../requests/request-employee-update-request");
const requestEmployeeRouter = express_1.default.Router();
//Reader API
requestEmployeeRouter.getAsync("/", auth_1.authenticate, validate_request_handler_1.default, request_employee_controller_1.getAll);
//Create and update requestEmployee
requestEmployeeRouter.postAsync("/create", auth_1.authenticate, request_employee_add_request_1.default, validate_request_handler_1.default, request_employee_controller_1.addInfo);
requestEmployeeRouter.putAsync("/update", request_employee_update_request_1.RequestEmployeeUpdateRequest, validate_request_handler_1.default, request_employee_controller_1.updateInfo);
requestEmployeeRouter.putAsync("/update-status", request_employee_update_request_1.RequestEmployeeUpdateStatusRequest, validate_request_handler_1.default, request_employee_controller_1.updateStatusInfo);
requestEmployeeRouter.deleteAsync("/remove/:id", auth_1.authenticate, validate_request_handler_1.default, request_employee_controller_1.removeInfo);
requestEmployeeRouter.getAsync("/:id", auth_1.authenticate, validate_request_handler_1.default, request_employee_controller_1.getInfo);
exports.default = requestEmployeeRouter;
