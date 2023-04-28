
import { Request } from "express";

export const getPagination = async (request: Request, minimumLimit?: number) => {
    const pageParsed = typeof request.query.page === 'number' ? request.query.page : ((typeof request.query.page === 'string') ? Number.parseInt(request.query.page.toString()) : NaN);
    const limitParsed = typeof request.query.limit === 'number' ? request.query.limit : ((typeof request.query.limit === 'string') ? Number.parseInt(request.query.limit.toString()) : NaN);

    const defaultLimit = minimumLimit ? minimumLimit : 20;

    const page = Number.isInteger(pageParsed) && pageParsed > 0 ? pageParsed : 1;
    const limit = Number.isInteger(limitParsed) && limitParsed > 0 ? Math.min(limitParsed, defaultLimit) : defaultLimit;
    const skip = Number.isInteger(page) && page > 0 ? (limit * (page - 1)) : 0;

    const sort = { createdAt: -1 };

    return { skip, limit, sort };
};


export const getRandomNumber = async (min: any, max: any) => {
    return Math.ceil(Math.random() * (max - min) + min);
};