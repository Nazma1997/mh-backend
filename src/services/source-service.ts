import { Request } from "express";
import { FilterQuery, DocumentDefinition, ObjectId } from "mongoose";

import _ from "lodash";

import { getPagination } from "../helpers/pagination-helper";
import Source, { SourceDocument } from "../models/source-model";


//pull source  info by source Id if exists
export const getSourceInfoById = async (id: ObjectId) => {
    try {
        return await Source.findById(id);
    } catch (err: any) {
        throw err;
    }
};

//getting source  info by filter query
export const getSourceInfoByFilterQuery = async (query: FilterQuery<SourceDocument>) => {
    try {
        return await Source.findOne(query);
    } catch (err: any) {
        throw err;
    }
};

//getting source  info by filter query
export const getSourcesByFilterQuery = async (query: FilterQuery<SourceDocument>, fileds?: Object) => {
    try {
        let selectedFileds: Object = {};
        if (fileds) selectedFileds = fileds;

        return await Source.find(query, selectedFileds);
    } catch (err: any) {
        throw err;
    }
};

//Check if an source  already exist in Database
export const sourceAlreadyIsNotExists = async (name: string, id?: ObjectId) => {
    const query: any = { name: name };

    if (id) query._id = { $ne: id };

    const source: any = await getSourceInfoByFilterQuery(query);

    if (source) {
        const customError: any = new Error("Source  already exists!. Please enter a new source .");
        customError.statusCode = 400;
        throw customError;
    } else return true;
};

//Add source  to Database
export const addSourceInfo = async (req: Request) => {
    try {
        const input: DocumentDefinition<SourceDocument> = req.body;

        //@ts-ignore
        const loggedInUserInfo: any = req.user;

        input.createdBy = loggedInUserInfo._id;

        return await Source.create(input);

    } catch (err: any) {
        throw err;
    }
};

//update source  info according to source  id.
export const updateSourceInfo = async (req: Request) => {
    try {
        const updateData: DocumentDefinition<SourceDocument> = req.body;

        const sourceInfo: any = await getSourceInfoById(req.body.id);

        if (!sourceInfo) {
            const customError: any = new Error("Invalid source  info!");
            customError.statusCode = 400;
            throw customError;
        }

        const source: any = new Source(sourceInfo);
        let isChanged = false;

        if (updateData.name && sourceInfo.name !== updateData.name) {
            isChanged = true;
            source.name = updateData.name;
        }

        if (sourceInfo.active !== updateData.active) {
            isChanged = true;
            source.active = updateData.active;
        }

        if (isChanged) {
            return await source.save();
        }

        return sourceInfo;

    } catch (err: any) {
        throw err;
    }
};

//remove source  info and related info
export const removeSourceInfoInfo = async (req: Request) => {
    try {

        const query = { _id: req.body.id };

        const sourceInfo: any = await getSourceInfoByFilterQuery(query);

        if (!sourceInfo) {
            const customError: any = new Error("Invalid source  info");
            customError.statusCode = 400;
            throw customError;
        }

        return await Source.updateOne(query, { $set: { deleted: true, active: false } });

    } catch (err: any) {
        throw err;
    }
};

//Get All Reader API
export const getSourceList = async (req: Request) => {
    try {
        const pagination = await getPagination(req);

        const query: FilterQuery<SourceDocument> = {};

        const { active } = req.query;
        const searchKeyword: any = req.query.searchKeyword;

        if (active === "YES") query.active = true;
        else if (active === "NO") query.active = false;

        if (searchKeyword) {
            let regExSearch = new RegExp(searchKeyword, 'i');
            query.name = regExSearch;
        }

        const sources = await Source.find(query, {}, pagination);
        const totalSources = await Source.find(query).count();

        return {
            total: totalSources,
            count: sources.length,
            next: sources.length === pagination.limit ? pagination.skip + pagination.limit : null,
            sources
        };

    } catch (err: any) {
        throw err;
    }
};

//get list for dropdown 
export const getSourceListForDropDown = async (req: Request) => {
    try {

        let pagination: any = await getPagination(req);

        pagination.sort = { name: 1 };

        const query: FilterQuery<SourceDocument> = { active: true };

        const searchKeyword: any = req.query.searchKeyword;

        if (searchKeyword) {
            let regExSearch = new RegExp(searchKeyword, 'i');

            query.name = regExSearch;
        }

        const sources = await Source.find(query, { name: 1 }, pagination);

        return {
            count: sources.length,
            next: sources.length === pagination.limit ? pagination.skip + pagination.limit : null,
            sources
        };

    } catch (err: any) {
        throw err;
    }
};