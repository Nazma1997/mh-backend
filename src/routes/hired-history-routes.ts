import express from "@awaitjs/express";

import { addInfo, getAll, getAllEmployeeList } from "../controllers/hired-history-controller";
import { authenticate } from "../middleware/auth";

import ValidateRequestHandler from "../middleware/validate-request-handler";
import HiredHistoryAddRequest from "../requests/hired-history-add-request";

const hiredHistoryRouter = express.Router();

//Reader API
hiredHistoryRouter.getAsync("/", authenticate, ValidateRequestHandler, getAll);
hiredHistoryRouter.getAsync("/employee-list-for-client", authenticate, ValidateRequestHandler, getAllEmployeeList);

//Create and update source
hiredHistoryRouter.postAsync("/create", authenticate, HiredHistoryAddRequest, ValidateRequestHandler, addInfo);

export default hiredHistoryRouter; 