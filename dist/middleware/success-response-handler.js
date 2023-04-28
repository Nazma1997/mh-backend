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
exports.successResponseHandler = void 0;
const successResponseHandler = (res, statusCode, message, keyOfData, data) => __awaiter(void 0, void 0, void 0, function* () {
    let responseResult = {
        status: "success",
        statusCode: statusCode,
        message: message
    };
    if (keyOfData && data)
        responseResult[keyOfData] = data;
    if (!keyOfData && data)
        responseResult = Object.assign(Object.assign({}, responseResult), data);
    return res.status(statusCode).json(responseResult);
});
exports.successResponseHandler = successResponseHandler;
