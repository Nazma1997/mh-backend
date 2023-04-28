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
exports.replaceSpacesWithUnderScores = exports.getUpperCaseString = exports.getStringWithoutSpecialCharacters = exports.isArrayOfObjectSame = exports.isArraySame = void 0;
const lodash_1 = __importDefault(require("lodash"));
//Check Two array is same or not
//[1,2,3] [1,2,3] => true
const isArraySame = (array1, array2) => __awaiter(void 0, void 0, void 0, function* () {
    const is_same = (array1.length === array2.length) && array2.every(function (id, index) {
        return id === array1[index];
    });
    return is_same;
});
exports.isArraySame = isArraySame;
//are two objects same with respect to a field
const isArrayOfObjectSame = (array1, array2, choosenField) => __awaiter(void 0, void 0, void 0, function* () {
    let is_same = false;
    if (array1.length === array2.length && (lodash_1.default.differenceBy(array1, array2, choosenField)).length === 0) {
        is_same = true;
    }
    return is_same;
});
exports.isArrayOfObjectSame = isArrayOfObjectSame;
const getStringWithoutSpecialCharacters = (value) => __awaiter(void 0, void 0, void 0, function* () {
    return value.replace(/[^a-zA-Z0-9.]/g, '-');
});
exports.getStringWithoutSpecialCharacters = getStringWithoutSpecialCharacters;
const getUpperCaseString = (value) => __awaiter(void 0, void 0, void 0, function* () {
    return value.toUpperCase();
});
exports.getUpperCaseString = getUpperCaseString;
const replaceSpacesWithUnderScores = (value) => __awaiter(void 0, void 0, void 0, function* () {
    return value.replace(/ /g, "_");
});
exports.replaceSpacesWithUnderScores = replaceSpacesWithUnderScores;
