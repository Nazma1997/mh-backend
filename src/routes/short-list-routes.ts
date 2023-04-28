import express from "@awaitjs/express";

import { authenticate } from "../middleware/auth";

import { addInfo, updateInfo, getAll, deleteInfo } from "../controllers/short-list-controller";

import ValidateRequestHandler from "../middleware/validate-request-handler";

import ShortListAddRequest from "../requests/short-list-add-request";
import ShortListUpdateRequest from "../requests/short-list-update-request";

const shortListRouter = express.Router();

//Reader API
shortListRouter.getAsync("/", authenticate, ValidateRequestHandler, getAll);

shortListRouter.postAsync("/create", authenticate, ShortListAddRequest, ValidateRequestHandler, addInfo);
shortListRouter.putAsync("/update", authenticate, ShortListUpdateRequest, ValidateRequestHandler, updateInfo);
shortListRouter.deleteAsync("/delete/:id", authenticate, ValidateRequestHandler, deleteInfo);

export default shortListRouter; 