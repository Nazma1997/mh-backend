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
exports.generateNewNanoId = void 0;
const async_1 = require("nanoid/async");
const generateNewNanoId = (isOnlyNumber, noOfCharacterOrDigit, prefix) => __awaiter(void 0, void 0, void 0, function* () {
    let alphabetCombination = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (isOnlyNumber === true)
        alphabetCombination = "0123456789";
    noOfCharacterOrDigit = noOfCharacterOrDigit && noOfCharacterOrDigit > 0 ? noOfCharacterOrDigit : 12;
    const nanoid = (0, async_1.customAlphabet)(alphabetCombination, noOfCharacterOrDigit);
    const generatedNanoId = yield nanoid();
    return prefix !== undefined ? prefix.toString() + generatedNanoId : generatedNanoId;
});
exports.generateNewNanoId = generateNewNanoId;
