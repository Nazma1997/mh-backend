import express from "@awaitjs/express";

import {
    getAll,
    addInfo,
    deleteInfo
} from "../controllers/app-error-controller";

import ValidateRequestHandler from "../middleware/validate-request-handler";

import AppErrorAddRequest from "../requests/app-error-add-request";

const appErrorRouter = express.Router();


//Reader API
appErrorRouter.getAsync("/", ValidateRequestHandler, getAll);

//Create and update app error
appErrorRouter.postAsync("/create", AppErrorAddRequest, ValidateRequestHandler, addInfo);

appErrorRouter.deleteAsync("/delete/:id", ValidateRequestHandler, deleteInfo);

export default appErrorRouter; 