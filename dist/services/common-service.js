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
exports.getPositionSkillAndSourceList = void 0;
const position_model_1 = __importDefault(require("../models/position-model"));
const skill_model_1 = __importDefault(require("../models/skill-model"));
const source_model_1 = __importDefault(require("../models/source-model"));
const app_version_model_1 = __importDefault(require("../models/app-version-model"));
//Get All Reader API
const getPositionSkillAndSourceList = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sources = yield source_model_1.default.find({}, { name: 1, active: 1 });
        const positions = yield position_model_1.default.find({}, { name: 1, active: 1 });
        const skills = yield skill_model_1.default.find({}, { name: 1, active: 1 });
        const appVersion = yield app_version_model_1.default.find();
        return {
            positions: positions,
            skills: skills,
            sources: sources,
            appVersion: appVersion,
        };
    }
    catch (err) {
        throw err;
    }
});
exports.getPositionSkillAndSourceList = getPositionSkillAndSourceList;
