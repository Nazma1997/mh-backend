"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("@awaitjs/express"));
const auth_1 = require("../middleware/auth");
const position_controller_1 = require("../controllers/position-controller");
const validate_request_handler_1 = __importDefault(require("../middleware/validate-request-handler"));
const position_add_request_1 = __importDefault(require("../requests/position-add-request"));
const position_update_request_1 = require("../requests/position-update-request");
const positionRouter = express_1.default.Router();
//Reader API
positionRouter.getAsync("/", auth_1.authenticate, validate_request_handler_1.default, position_controller_1.getAll);
positionRouter.getAsync("/list-for-dropdown", validate_request_handler_1.default, position_controller_1.getAllForDropDown);
//Create and update position
positionRouter.postAsync("/create", auth_1.authenticate, position_add_request_1.default, validate_request_handler_1.default, position_controller_1.addInfo);
positionRouter.putAsync("/update", position_update_request_1.PositionUpdateRequest, validate_request_handler_1.default, position_controller_1.updateInfo);
positionRouter.putAsync("/update-status", position_update_request_1.PositionUpdateStatusRequest, validate_request_handler_1.default, position_controller_1.updateStatusInfo);
positionRouter.getAsync("/:id", auth_1.authenticate, validate_request_handler_1.default, position_controller_1.getInfo);
exports.default = positionRouter;
