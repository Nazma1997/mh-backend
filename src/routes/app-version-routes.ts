import express from "@awaitjs/express";

import { updateInfo } from "../controllers/app-version-controller";

import ValidateRequestHandler from "../middleware/validate-request-handler";

import AppappVersionRouterUpdateRequest from "../requests/app-version-update-request";

const appVersionRouter = express.Router();

appVersionRouter.putAsync("/update", AppappVersionRouterUpdateRequest, ValidateRequestHandler, updateInfo);

export default appVersionRouter;