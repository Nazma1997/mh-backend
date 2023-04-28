import express from "@awaitjs/express";

import { authenticate } from "../middleware/auth";

import {
    getAll,
    getInfo,
    getAllForEmployee,
} from "../controllers/check-in-check-out-history-controller";

import ValidateRequestHandler from "../middleware/validate-request-handler";

const checkInCheckOutHistoryRouter = express.Router();

//Reader API
checkInCheckOutHistoryRouter.getAsync("/", authenticate, ValidateRequestHandler, getAll);
checkInCheckOutHistoryRouter.getAsync("/list", authenticate, ValidateRequestHandler, getAllForEmployee);
checkInCheckOutHistoryRouter.getAsync("/:id", authenticate, ValidateRequestHandler, getInfo);

export default checkInCheckOutHistoryRouter; 