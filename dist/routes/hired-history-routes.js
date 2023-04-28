"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("@awaitjs/express"));
const hired_history_controller_1 = require("../controllers/hired-history-controller");
const auth_1 = require("../middleware/auth");
const validate_request_handler_1 = __importDefault(require("../middleware/validate-request-handler"));
const hired_history_add_request_1 = __importDefault(require("../requests/hired-history-add-request"));
const hiredHistoryRouter = express_1.default.Router();
//Reader API
hiredHistoryRouter.getAsync("/", auth_1.authenticate, validate_request_handler_1.default, hired_history_controller_1.getAll);
hiredHistoryRouter.getAsync("/employee-list-for-client", auth_1.authenticate, validate_request_handler_1.default, hired_history_controller_1.getAllEmployeeList);
//Create and update source
hiredHistoryRouter.postAsync("/create", auth_1.authenticate, hired_history_add_request_1.default, validate_request_handler_1.default, hired_history_controller_1.addInfo);
exports.default = hiredHistoryRouter;
