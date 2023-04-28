import express from "@awaitjs/express";

import { authenticate } from "../middleware/auth";

import {
    getAll,
    getInfo,
    addInfo,
    updateInfo,
    updateStatusInfo,
    removeInfo
} from "../controllers/request-employee-controller";

import ValidateRequestHandler from "../middleware/validate-request-handler";

import RequestEmployeeAddRequest from "../requests/request-employee-add-request";
import { RequestEmployeeUpdateRequest, RequestEmployeeUpdateStatusRequest } from "../requests/request-employee-update-request";

const requestEmployeeRouter = express.Router();

//Reader API
requestEmployeeRouter.getAsync("/", authenticate, ValidateRequestHandler, getAll);

//Create and update requestEmployee
requestEmployeeRouter.postAsync("/create", authenticate, RequestEmployeeAddRequest, ValidateRequestHandler, addInfo);
requestEmployeeRouter.putAsync("/update", RequestEmployeeUpdateRequest, ValidateRequestHandler, updateInfo);
requestEmployeeRouter.putAsync("/update-status", RequestEmployeeUpdateStatusRequest, ValidateRequestHandler, updateStatusInfo);

requestEmployeeRouter.deleteAsync("/remove/:id", authenticate, ValidateRequestHandler, removeInfo);
requestEmployeeRouter.getAsync("/:id", authenticate, ValidateRequestHandler, getInfo);

export default requestEmployeeRouter; 