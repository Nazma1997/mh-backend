"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("@awaitjs/express"));
const app_version_controller_1 = require("../controllers/app-version-controller");
const validate_request_handler_1 = __importDefault(require("../middleware/validate-request-handler"));
const app_version_update_request_1 = __importDefault(require("../requests/app-version-update-request"));
const appVersionRouter = express_1.default.Router();
appVersionRouter.putAsync("/update", app_version_update_request_1.default, validate_request_handler_1.default, app_version_controller_1.updateInfo);
exports.default = appVersionRouter;
