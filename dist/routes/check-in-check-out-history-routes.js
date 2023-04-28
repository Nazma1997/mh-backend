"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("@awaitjs/express"));
const auth_1 = require("../middleware/auth");
const check_in_check_out_history_controller_1 = require("../controllers/check-in-check-out-history-controller");
const validate_request_handler_1 = __importDefault(require("../middleware/validate-request-handler"));
const checkInCheckOutHistoryRouter = express_1.default.Router();
//Reader API
checkInCheckOutHistoryRouter.getAsync("/", auth_1.authenticate, validate_request_handler_1.default, check_in_check_out_history_controller_1.getAll);
checkInCheckOutHistoryRouter.getAsync("/list", auth_1.authenticate, validate_request_handler_1.default, check_in_check_out_history_controller_1.getAllForEmployee);
checkInCheckOutHistoryRouter.getAsync("/:id", auth_1.authenticate, validate_request_handler_1.default, check_in_check_out_history_controller_1.getInfo);
exports.default = checkInCheckOutHistoryRouter;
