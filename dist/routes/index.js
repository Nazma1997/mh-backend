"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("@awaitjs/express");
const user_routes_1 = __importDefault(require("./user-routes"));
const position_routes_1 = __importDefault(require("./position-routes"));
const source_routes_1 = __importDefault(require("./source-routes"));
const skill_routes_1 = __importDefault(require("./skill-routes"));
const common_routes_1 = __importDefault(require("./common-routes"));
const short_list_routes_1 = __importDefault(require("./short-list-routes"));
const terms_condition_routes_1 = __importDefault(require("./terms-condition-routes"));
const hired_history_routes_1 = __importDefault(require("./hired-history-routes"));
const current_hired_employee_routes_1 = __importDefault(require("./current-hired-employee-routes"));
const app_error_routes_1 = __importDefault(require("./app-error-routes"));
const app_version_routes_1 = __importDefault(require("./app-version-routes"));
const check_in_check_out_history_routes_1 = __importDefault(require("./check-in-check-out-history-routes"));
const conversation_routes_1 = __importDefault(require("./conversation-routes"));
const message_routes_1 = __importDefault(require("./message-routes"));
const request_employee_routes_1 = __importDefault(require("./request-employee-routes"));
const router = (0, express_1.Router)();
router.use("/api/v1/users", user_routes_1.default);
router.use("/api/v1/positions", position_routes_1.default);
router.use("/api/v1/sources", source_routes_1.default);
router.use("/api/v1/skills", skill_routes_1.default);
router.use("/api/v1/commons", common_routes_1.default);
router.use("/api/v1/short-list", short_list_routes_1.default);
router.use("/api/v1/terms-conditions", terms_condition_routes_1.default);
router.use("/api/v1/hired-histories", hired_history_routes_1.default);
router.use("/api/v1/current-hired-employees", current_hired_employee_routes_1.default);
router.use("/api/v1/app-errors", app_error_routes_1.default);
router.use("/api/v1/app-versions", app_version_routes_1.default);
router.use("/api/v1/check-in-check-out-histories", check_in_check_out_history_routes_1.default);
router.use("/api/v1/conversations", conversation_routes_1.default);
router.use("/api/v1/messages", message_routes_1.default);
router.use("/api/v1/request-employees", request_employee_routes_1.default);
router.getAsync("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // res.send("MH backend health is now ok");
    // console.log("__dirname; ", __dirname + "/index.html");
    // return res.sendFile(__dirname + "/index.html");
    res.send(`<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body>
        <h2>MH backend health is now ok</h2>
    
        <button>Send</button>
    
        <script src="https://cdn.socket.io/4.6.0/socket.io.min.js"
            integrity="sha384-c79GN5VsunZvi+Q/WObgk2in0CbZsHnjEqvFxC5DxHn9lTfNce2WW6h2pH6u/kF+"
            crossorigin="anonymous"></script>
        <script>
            const socket = io();
        </script>
    </body>
    </html>`);
}));
router.route("*").all((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.send("404 Not Found!");
}));
exports.default = router;
