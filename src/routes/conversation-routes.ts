import express from "@awaitjs/express";

import { authenticate } from "../middleware/auth";

import {
    getAll,
    getUserChatInfo,
    getInfo,
    getUserChatBasedOnFirstAndSecondIdInfo,
    addInfo,
} from "../controllers/conversation-controller";

import ValidateRequestHandler from "../middleware/validate-request-handler";

import ConversationAddRequest from "../requests/conversation-add-request";

const conversationRouter = express.Router();

//Reader API
conversationRouter.getAsync("/", authenticate, ValidateRequestHandler, getAll);

//Create and update conversation
conversationRouter.postAsync("/create", authenticate, ConversationAddRequest, ValidateRequestHandler, addInfo);

//specific user chat
conversationRouter.getAsync("/:userId", authenticate, ValidateRequestHandler, getUserChatInfo);

//specific user chat
conversationRouter.getAsync("/find/:firstId/:secondId", authenticate, ValidateRequestHandler, getUserChatBasedOnFirstAndSecondIdInfo);

conversationRouter.getAsync("/:id", authenticate, ValidateRequestHandler, getInfo);

export default conversationRouter; 