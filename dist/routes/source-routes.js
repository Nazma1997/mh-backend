"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("@awaitjs/express"));
const auth_1 = require("../middleware/auth");
const source_controller_1 = require("../controllers/source-controller");
const validate_request_handler_1 = __importDefault(require("../middleware/validate-request-handler"));
const source_add_request_1 = __importDefault(require("../requests/source-add-request"));
const source_update_request_1 = require("../requests/source-update-request");
const sourceRouter = express_1.default.Router();
//Reader API
sourceRouter.getAsync("/", auth_1.authenticate, validate_request_handler_1.default, source_controller_1.getAll);
sourceRouter.getAsync("/list-for-dropdown", validate_request_handler_1.default, source_controller_1.getAllForDropDown);
//Create and update source
sourceRouter.postAsync("/create", auth_1.authenticate, source_add_request_1.default, validate_request_handler_1.default, source_controller_1.addInfo);
sourceRouter.putAsync("/update", auth_1.authenticate, source_update_request_1.SourceUpdateRequest, validate_request_handler_1.default, source_controller_1.updateInfo);
sourceRouter.putAsync("/update-status", auth_1.authenticate, source_update_request_1.SourceUpdateStatusRequest, validate_request_handler_1.default, source_controller_1.updateStatusInfo);
sourceRouter.getAsync("/:id", auth_1.authenticate, auth_1.authenticate, validate_request_handler_1.default, source_controller_1.getInfo);
exports.default = sourceRouter;
