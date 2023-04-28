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
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const config_1 = __importDefault(require("config"));
const db_connection_1 = __importDefault(require("./db-connection/db-connection"));
const error_handler_1 = require("./middleware/error-handler");
const logger_1 = __importDefault(require("./utils/logger"));
const index_1 = __importDefault(require("./routes/index"));
const app = (0, express_1.default)();
const httpServer = http_1.default.createServer(app);
// socket creation
const io = new socket_io_1.Server(httpServer);
//@ts-ignore
global.io = io;
io.on('connection', function (socket) {
    console.log("New User Connected");
});
app.use((0, cors_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use((0, helmet_1.default)());
(0, db_connection_1.default)();
//add routes
app.use(index_1.default);
// Handling Errors
app.use(error_handler_1.errorHandler);
const port = config_1.default.get('PORT');
httpServer.listen(port, () => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.default.info(`Application successfully connected on http://localhost:${port}`);
}));
