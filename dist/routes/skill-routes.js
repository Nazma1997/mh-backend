"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("@awaitjs/express"));
const auth_1 = require("../middleware/auth");
const skill_controller_1 = require("../controllers/skill-controller");
const validate_request_handler_1 = __importDefault(require("../middleware/validate-request-handler"));
const skill_add_request_1 = __importDefault(require("../requests/skill-add-request"));
const skill_update_request_1 = require("../requests/skill-update-request");
const skillRouter = express_1.default.Router();
//Reader API
skillRouter.getAsync("/", auth_1.authenticate, validate_request_handler_1.default, skill_controller_1.getAll);
skillRouter.getAsync("/list-for-dropdown", validate_request_handler_1.default, skill_controller_1.getAllForDropDown);
//Create and update skill
skillRouter.postAsync("/create", auth_1.authenticate, skill_add_request_1.default, validate_request_handler_1.default, skill_controller_1.addInfo);
skillRouter.putAsync("/update", skill_update_request_1.SkillUpdateRequest, validate_request_handler_1.default, skill_controller_1.updateInfo);
skillRouter.putAsync("/update-status", skill_update_request_1.SkillUpdateStatusRequest, validate_request_handler_1.default, skill_controller_1.updateStatusInfo);
skillRouter.getAsync("/:id", auth_1.authenticate, validate_request_handler_1.default, skill_controller_1.getInfo);
exports.default = skillRouter;
