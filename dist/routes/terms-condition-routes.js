"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("@awaitjs/express"));
const auth_1 = require("../middleware/auth");
const terms_condition_controller_1 = require("../controllers/terms-condition-controller");
const validate_request_handler_1 = __importDefault(require("../middleware/validate-request-handler"));
const terms_condition_add_request_1 = __importDefault(require("../requests/terms-condition-add-request"));
const terms_condition_update_request_1 = require("../requests/terms-condition-update-request");
const termsConditionRouter = express_1.default.Router();
//Reader API
termsConditionRouter.getAsync("/", validate_request_handler_1.default, terms_condition_controller_1.getAll);
//Create and update terms condition
termsConditionRouter.postAsync("/create", auth_1.authenticate, terms_condition_add_request_1.default, validate_request_handler_1.default, terms_condition_controller_1.addInfo);
termsConditionRouter.putAsync("/update", terms_condition_update_request_1.TermsConditionUpdateRequest, validate_request_handler_1.default, terms_condition_controller_1.updateInfo);
termsConditionRouter.putAsync("/update-status", terms_condition_update_request_1.TermsConditionUpdateStatusRequest, validate_request_handler_1.default, terms_condition_controller_1.updateStatusInfo);
termsConditionRouter.getAsync("/:id", validate_request_handler_1.default, terms_condition_controller_1.getInfo);
exports.default = termsConditionRouter;
