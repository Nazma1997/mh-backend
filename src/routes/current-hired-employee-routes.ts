import express from "@awaitjs/express";

import { authenticate } from "../middleware/auth";

import {
    getAll,
    getInfo,
    getCheckInfo,
    addInfo,
    updateInfo,
    updateStatusInfo,
} from "../controllers/current-hired-employee-controller";

import ValidateRequestHandler from "../middleware/validate-request-handler";

import CurrentHiredEmployeeAddRequest from "../requests/current-hired-employee-add-request";
import { CurrentHiredEmployeeUpdateRequest, CurrentHiredEmployeeUpdateStatusRequest } from "../requests/current-hired-employee-update-request";

const currentHiredEmployeeRouter = express.Router();

//Reader API
currentHiredEmployeeRouter.getAsync("/", authenticate, ValidateRequestHandler, getAll);

//Create and update current hired employee
currentHiredEmployeeRouter.postAsync("/create", authenticate, CurrentHiredEmployeeAddRequest, ValidateRequestHandler, addInfo);
currentHiredEmployeeRouter.putAsync("/update", authenticate, CurrentHiredEmployeeUpdateRequest, ValidateRequestHandler, updateInfo);
currentHiredEmployeeRouter.putAsync("/update-status", authenticate, CurrentHiredEmployeeUpdateStatusRequest, ValidateRequestHandler, updateStatusInfo);

currentHiredEmployeeRouter.getAsync("/details/:id", authenticate, ValidateRequestHandler, getCheckInfo); //this id is employee id
currentHiredEmployeeRouter.getAsync("/:id", authenticate, ValidateRequestHandler, getInfo);

export default currentHiredEmployeeRouter; 