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
exports.getRandomNumber = exports.getPagination = void 0;
const getPagination = (request, minimumLimit) => __awaiter(void 0, void 0, void 0, function* () {
    const pageParsed = typeof request.query.page === 'number' ? request.query.page : ((typeof request.query.page === 'string') ? Number.parseInt(request.query.page.toString()) : NaN);
    const limitParsed = typeof request.query.limit === 'number' ? request.query.limit : ((typeof request.query.limit === 'string') ? Number.parseInt(request.query.limit.toString()) : NaN);
    const defaultLimit = minimumLimit ? minimumLimit : 20;
    const page = Number.isInteger(pageParsed) && pageParsed > 0 ? pageParsed : 1;
    const limit = Number.isInteger(limitParsed) && limitParsed > 0 ? Math.min(limitParsed, defaultLimit) : defaultLimit;
    const skip = Number.isInteger(page) && page > 0 ? (limit * (page - 1)) : 0;
    const sort = { createdAt: -1 };
    return { skip, limit, sort };
});
exports.getPagination = getPagination;
const getRandomNumber = (min, max) => __awaiter(void 0, void 0, void 0, function* () {
    return Math.ceil(Math.random() * (max - min) + min);
});
exports.getRandomNumber = getRandomNumber;
