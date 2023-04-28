"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("@awaitjs/express"));
const app_error_controller_1 = require("../controllers/app-error-controller");
const validate_request_handler_1 = __importDefault(require("../middleware/validate-request-handler"));
const app_error_add_request_1 = __importDefault(require("../requests/app-error-add-request"));
const appErrorRouter = express_1.default.Router();
//Reader API
appErrorRouter.getAsync("/", validate_request_handler_1.default, app_error_controller_1.getAll);
//Create and update app error
appErrorRouter.postAsync("/create", app_error_add_request_1.default, validate_request_handler_1.default, app_error_controller_1.addInfo);
appErrorRouter.deleteAsync("/delete/:id", validate_request_handler_1.default, app_error_controller_1.deleteInfo);
exports.default = appErrorRouter;
