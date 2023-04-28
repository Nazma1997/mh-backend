import express from "@awaitjs/express";

import { getAll } from "../controllers/common-controller";

import ValidateRequestHandler from "../middleware/validate-request-handler";

const commonRouter = express.Router();

//Reader API
commonRouter.getAsync("/", ValidateRequestHandler, getAll);

export default commonRouter; 