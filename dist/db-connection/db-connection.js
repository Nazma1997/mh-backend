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
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("config"));
const logger_1 = __importDefault(require("../utils/logger"));
const createDBConnection = () => __awaiter(void 0, void 0, void 0, function* () {
    const NODE_ENV = config_1.default.get("NODE_ENV");
    const MONGO_USER = config_1.default.get("MONGO_USER");
    const MONGO_PASSWORD = config_1.default.get("MONGO_PASSWORD");
    const MONGO_CLUSTER = config_1.default.get("MONGO_CLUSTER");
    const MONGO_DB_NAME = config_1.default.get("MONGO_DB_NAME");
    const MONGO_PORT = config_1.default.get("MONGO_PORT");
    const mongoConnectionUri = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_CLUSTER}/${MONGO_DB_NAME}?retryWrites=true&w=majority`;
    const mongoDbConnectionURI = NODE_ENV === "local_development" ? `mongodb://localhost:${MONGO_PORT}/${MONGO_DB_NAME}` : (NODE_ENV === "development" ? mongoConnectionUri : mongoConnectionUri);
    // const localConnection = "mongodb://localhost:27017/mhapp";
    // const cloudConnection = "mongodb+srv://mircoHospitality:@cluster0.ao2qrau.mongodb.net/mircoHospitality?retryWrites=true&w=majority";
    try {
        mongoose_1.default.set('strictQuery', false);
        yield mongoose_1.default.connect(mongoConnectionUri, { useNewUrlParser: true, useUnifiedTopology: true });
        logger_1.default.info("Database connected successfully!");
    }
    catch (error) {
        logger_1.default.error("Could not connect to database");
        process.exit(1);
    }
});
exports.default = createDBConnection;
