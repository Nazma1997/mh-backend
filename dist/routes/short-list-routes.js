"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("@awaitjs/express"));
const auth_1 = require("../middleware/auth");
const short_list_controller_1 = require("../controllers/short-list-controller");
const validate_request_handler_1 = __importDefault(require("../middleware/validate-request-handler"));
const short_list_add_request_1 = __importDefault(require("../requests/short-list-add-request"));
const short_list_update_request_1 = __importDefault(require("../requests/short-list-update-request"));
const shortListRouter = express_1.default.Router();
//Reader API
shortListRouter.getAsync("/", auth_1.authenticate, validate_request_handler_1.default, short_list_controller_1.getAll);
shortListRouter.postAsync("/create", auth_1.authenticate, short_list_add_request_1.default, validate_request_handler_1.default, short_list_controller_1.addInfo);
shortListRouter.putAsync("/update", auth_1.authenticate, short_list_update_request_1.default, validate_request_handler_1.default, short_list_controller_1.updateInfo);
shortListRouter.deleteAsync("/delete/:id", auth_1.authenticate, validate_request_handler_1.default, short_list_controller_1.deleteInfo);
exports.default = shortListRouter;
