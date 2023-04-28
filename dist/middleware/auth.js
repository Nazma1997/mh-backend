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
exports.authenticate = void 0;
const user_service_1 = require("../services/user-service");
const authenticate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { authorization } = req.headers;
    if (!authorization) {
        let customError = new Error("Authorization token not found!");
        customError.statusCode = 400;
        return next(customError);
    }
    try {
        const user = yield (0, user_service_1.verifyToken)(authorization);
        //@ts-ignore
        req.user = user;
        return next();
    }
    catch (err) {
        return next(err);
    }
});
exports.authenticate = authenticate;
