import express from "@awaitjs/express";

import { authenticate } from "../middleware/auth";

import { getAll, getInfo, addInfo } from "../controllers/message-controller";

import ValidateRequestHandler from "../middleware/validate-request-handler";

import MessageAddRequest from "../requests/message-add-request";

const messageRouter = express.Router();

//Reader API
messageRouter.getAsync("/", authenticate, ValidateRequestHandler, getAll);

//add message info
messageRouter.postAsync("/create", authenticate, MessageAddRequest, ValidateRequestHandler, addInfo);

messageRouter.getAsync("/:conversationId", authenticate, ValidateRequestHandler, getInfo);

export default messageRouter; 