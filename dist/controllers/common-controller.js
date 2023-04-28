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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAll = void 0;
const success_response_handler_1 = require("../middleware/success-response-handler");
const common_service_1 = require("../services/common-service");
//pass the client valid inputs to service
const getAll = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getData = yield (0, common_service_1.getPositionSkillAndSourceList)(req);
        return yield (0, success_response_handler_1.successResponseHandler)(res, 200, "Position, skill and source list fetch successfully!", null, getData);
    }
    catch (err) {
        return next(err);
    }
});
exports.getAll = getAll;
