import express from "@awaitjs/express";

import { authenticate } from "../middleware/auth";

import {
    getAll,
    getAllForDropDown,
    getInfo,
    addInfo,
    updateInfo,
    updateStatusInfo,
} from "../controllers/source-controller";

import ValidateRequestHandler from "../middleware/validate-request-handler";

import SourceAddRequest from "../requests/source-add-request";
import { SourceUpdateRequest, SourceUpdateStatusRequest } from "../requests/source-update-request";

const sourceRouter = express.Router();

//Reader API
sourceRouter.getAsync("/", authenticate, ValidateRequestHandler, getAll);
sourceRouter.getAsync("/list-for-dropdown", ValidateRequestHandler, getAllForDropDown);

//Create and update source
sourceRouter.postAsync("/create", authenticate, SourceAddRequest, ValidateRequestHandler, addInfo);
sourceRouter.putAsync("/update", authenticate, SourceUpdateRequest, ValidateRequestHandler, updateInfo);
sourceRouter.putAsync("/update-status", authenticate, SourceUpdateStatusRequest, ValidateRequestHandler, updateStatusInfo);

sourceRouter.getAsync("/:id", authenticate, authenticate, ValidateRequestHandler, getInfo);

export default sourceRouter; 