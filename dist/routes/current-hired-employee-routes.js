"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("@awaitjs/express"));
const auth_1 = require("../middleware/auth");
const current_hired_employee_controller_1 = require("../controllers/current-hired-employee-controller");
const validate_request_handler_1 = __importDefault(require("../middleware/validate-request-handler"));
const current_hired_employee_add_request_1 = __importDefault(require("../requests/current-hired-employee-add-request"));
const current_hired_employee_update_request_1 = require("../requests/current-hired-employee-update-request");
const currentHiredEmployeeRouter = express_1.default.Router();
//Reader API
currentHiredEmployeeRouter.getAsync("/", auth_1.authenticate, validate_request_handler_1.default, current_hired_employee_controller_1.getAll);
//Create and update current hired employee
currentHiredEmployeeRouter.postAsync("/create", auth_1.authenticate, current_hired_employee_add_request_1.default, validate_request_handler_1.default, current_hired_employee_controller_1.addInfo);
currentHiredEmployeeRouter.putAsync("/update", auth_1.authenticate, current_hired_employee_update_request_1.CurrentHiredEmployeeUpdateRequest, validate_request_handler_1.default, current_hired_employee_controller_1.updateInfo);
currentHiredEmployeeRouter.putAsync("/update-status", auth_1.authenticate, current_hired_employee_update_request_1.CurrentHiredEmployeeUpdateStatusRequest, validate_request_handler_1.default, current_hired_employee_controller_1.updateStatusInfo);
currentHiredEmployeeRouter.getAsync("/details/:id", auth_1.authenticate, validate_request_handler_1.default, current_hired_employee_controller_1.getCheckInfo); //this id is employee id
currentHiredEmployeeRouter.getAsync("/:id", auth_1.authenticate, validate_request_handler_1.default, current_hired_employee_controller_1.getInfo);
exports.default = currentHiredEmployeeRouter;
