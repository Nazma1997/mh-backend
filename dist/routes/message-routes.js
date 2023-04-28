"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("@awaitjs/express"));
const auth_1 = require("../middleware/auth");
const message_controller_1 = require("../controllers/message-controller");
const validate_request_handler_1 = __importDefault(require("../middleware/validate-request-handler"));
const message_add_request_1 = __importDefault(require("../requests/message-add-request"));
const messageRouter = express_1.default.Router();
//Reader API
messageRouter.getAsync("/", auth_1.authenticate, validate_request_handler_1.default, message_controller_1.getAll);
//add message info
messageRouter.postAsync("/create", auth_1.authenticate, message_add_request_1.default, validate_request_handler_1.default, message_controller_1.addInfo);
messageRouter.getAsync("/:conversationId", auth_1.authenticate, validate_request_handler_1.default, message_controller_1.getInfo);
exports.default = messageRouter;
