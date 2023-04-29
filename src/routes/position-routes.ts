import express from "@awaitjs/express";

import { authenticate } from "../middleware/auth";

import {
    getAll,
    getAllForDropDown,
    getInfo,
    addInfo,
    updateInfo,
    updateStatusInfo,
} from "../controllers/position-controller";

import ValidateRequestHandler from "../middleware/validate-request-handler";

import PositionAddRequest from "../requests/position-add-request";
import { PositionUpdateRequest, PositionUpdateStatusRequest } from "../requests/position-update-request";

const positionRouter = express.Router();

//Reader API
positionRouter.getAsync("/", authenticate, ValidateRequestHandler, getAll);
positionRouter.getAsync("/list-for-dropdown", ValidateRequestHandler, getAllForDropDown);

//Create and update position

// authenticate
positionRouter.postAsync("/create",  PositionAddRequest, ValidateRequestHandler, addInfo);
positionRouter.putAsync("/update", PositionUpdateRequest, ValidateRequestHandler, updateInfo);
positionRouter.putAsync("/update-status", PositionUpdateStatusRequest, ValidateRequestHandler, updateStatusInfo);

positionRouter.getAsync("/:id", authenticate, ValidateRequestHandler, getInfo);

export default positionRouter; 