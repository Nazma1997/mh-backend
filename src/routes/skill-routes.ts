import express from "@awaitjs/express";

import { authenticate } from "../middleware/auth";

import {
    getAll,
    getAllForDropDown,
    getInfo,
    addInfo,
    updateInfo,
    updateStatusInfo,
} from "../controllers/skill-controller";

import ValidateRequestHandler from "../middleware/validate-request-handler";

import SkillAddRequest from "../requests/skill-add-request";
import { SkillUpdateRequest, SkillUpdateStatusRequest } from "../requests/skill-update-request";

const skillRouter = express.Router();


//Reader API
skillRouter.getAsync("/", authenticate, ValidateRequestHandler, getAll);
skillRouter.getAsync("/list-for-dropdown", ValidateRequestHandler, getAllForDropDown);

//Create and update skill
skillRouter.postAsync("/create", authenticate, SkillAddRequest, ValidateRequestHandler, addInfo);
skillRouter.putAsync("/update", SkillUpdateRequest, ValidateRequestHandler, updateInfo);
skillRouter.putAsync("/update-status", SkillUpdateStatusRequest, ValidateRequestHandler, updateStatusInfo);

skillRouter.getAsync("/:id", authenticate, ValidateRequestHandler, getInfo);

export default skillRouter; 