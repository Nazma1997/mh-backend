"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("@awaitjs/express"));
const auth_1 = require("../middleware/auth");
const conversation_controller_1 = require("../controllers/conversation-controller");
const validate_request_handler_1 = __importDefault(require("../middleware/validate-request-handler"));
const conversation_add_request_1 = __importDefault(require("../requests/conversation-add-request"));
const conversationRouter = express_1.default.Router();
//Reader API
conversationRouter.getAsync("/", auth_1.authenticate, validate_request_handler_1.default, conversation_controller_1.getAll);
//Create and update conversation
conversationRouter.postAsync("/create", auth_1.authenticate, conversation_add_request_1.default, validate_request_handler_1.default, conversation_controller_1.addInfo);
//specific user chat
conversationRouter.getAsync("/:userId", auth_1.authenticate, validate_request_handler_1.default, conversation_controller_1.getUserChatInfo);
//specific user chat
conversationRouter.getAsync("/find/:firstId/:secondId", auth_1.authenticate, validate_request_handler_1.default, conversation_controller_1.getUserChatBasedOnFirstAndSecondIdInfo);
conversationRouter.getAsync("/:id", auth_1.authenticate, validate_request_handler_1.default, conversation_controller_1.getInfo);
exports.default = conversationRouter;
