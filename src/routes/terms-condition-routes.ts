import express from "@awaitjs/express";

import { authenticate } from "../middleware/auth";

import {
    getAll,
    getInfo,
    addInfo,
    updateInfo,
    updateStatusInfo
} from "../controllers/terms-condition-controller";

import ValidateRequestHandler from "../middleware/validate-request-handler";

import TermsConditionAddRequest from "../requests/terms-condition-add-request";
import { TermsConditionUpdateRequest, TermsConditionUpdateStatusRequest } from "../requests/terms-condition-update-request";

const termsConditionRouter = express.Router();

//Reader API
termsConditionRouter.getAsync("/", ValidateRequestHandler, getAll);

//Create and update terms condition
termsConditionRouter.postAsync("/create", authenticate, TermsConditionAddRequest, ValidateRequestHandler, addInfo);
termsConditionRouter.putAsync("/update", TermsConditionUpdateRequest, ValidateRequestHandler, updateInfo);
termsConditionRouter.putAsync("/update-status", TermsConditionUpdateStatusRequest, ValidateRequestHandler, updateStatusInfo);

termsConditionRouter.getAsync("/:id", ValidateRequestHandler, getInfo);

export default termsConditionRouter; 