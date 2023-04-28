"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("@awaitjs/express"));
const common_controller_1 = require("../controllers/common-controller");
const validate_request_handler_1 = __importDefault(require("../middleware/validate-request-handler"));
const commonRouter = express_1.default.Router();
//Reader API
commonRouter.getAsync("/", validate_request_handler_1.default, common_controller_1.getAll);
exports.default = commonRouter;
