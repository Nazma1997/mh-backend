import { Request } from "express";
import { FilterQuery, DocumentDefinition, ObjectId } from "mongoose";

import _ from "lodash";

import { getPagination } from "../helpers/pagination-helper";
import createNewSlug from "../helpers/slug-helper";
import Position, { PositionDocument } from "../models/position-model";


//pull position info by positionId if exists
export const getPositionInfoById = async (id: ObjectId) => {
    try {
        return await Position.findById(id);
    } catch (err: any) {
        throw err;
    }
};

//getting position info by filter query
export const getPositionInfoByFilterQuery = async (query: FilterQuery<PositionDocument>) => {
    try {
        return await Position.findOne(query);
    } catch (err: any) {
        throw err;
    }
};

//getting position info by filter query
export const getPositionsByFilterQuery = async (query: FilterQuery<PositionDocument>, fileds?: Object) => {
    try {
        let selectedFileds: Object = {};
        if (fileds) selectedFileds = fileds;

        return await Position.find(query, selectedFileds);
    } catch (err: any) {
        throw err;
    }
};

//Check if an position already exist in Database
export const positionAlreadyIsNotExists = async (name: string, id?: ObjectId) => {
    const query: any = { name: name };

    if (id) query._id = { $ne: id };

    const position: any = await getPositionInfoByFilterQuery(query);

    if (position) {
        const customError: any = new Error("Position already exists!. Please enter a new position.");
        customError.statusCode = 400;
        throw customError;
    } else return true;
};

//Add position to Database
export const addPositionInfo = async (req: Request) => {
    try {
        const input: DocumentDefinition<PositionDocument> = req.body;

        //@ts-ignore
        // const loggedInUserInfo: any = req.user;

        // input.createdBy = loggedInUserInfo._id;

        const positionName: any = input.name;
        input.slug = await createNewSlug(positionName);

        return await Position.create(input);

    } catch (err: any) {
        throw err;
    }
};

//update position info according to position id.
export const updatePositionInfo = async (req: Request) => {
    try {
        const updateData: DocumentDefinition<PositionDocument> = req.body;

        const positionInfo: any = await getPositionInfoById(req.body.id);

        if (!positionInfo) {
            const customError: any = new Error("Invalid position info!");
            customError.statusCode = 400;
            throw customError;
        }

        const position: any = new Position(positionInfo);
        let isChanged = false;

        if (updateData.name && positionInfo.name !== updateData.name) {
            isChanged = true;
            position.name = updateData.name;

            //Generate slug
            position.slug = await createNewSlug(position.name);
        }

        if (positionInfo.active !== updateData.active) {
            isChanged = true;
            position.active = updateData.active;
        }

        if (isChanged) {
            return await position.save();
        }

        return positionInfo;

    } catch (err: any) {
        throw err;
    }
};

//remove position info and related info
export const removePositionInfo = async (req: Request) => {
    try {

        const query = { _id: req.body.id };

        const positionInfo: any = await getPositionInfoByFilterQuery(query);

        if (!positionInfo) {
            const customError: any = new Error("Invalid position info");
            customError.statusCode = 400;
            throw customError;
        }

        return await Position.updateOne(query, { $set: { deleted: true, active: false } });

    } catch (err: any) {
        throw err;
    }
};

//Get All Reader API
export const getPositionList = async (req: Request) => {
    try {
        const pagination = await getPagination(req);

        const query: FilterQuery<PositionDocument> = {};

        const { active } = req.query;
        const searchKeyword: any = req.query.searchKeyword;

        if (active === "YES") query.active = true;
        else if (active === "NO") query.active = false;

        if (searchKeyword) {
            let regExSearch = new RegExp(searchKeyword, 'i');
            query.name = regExSearch;
        }

        const positions = await Position.find(query, {}, pagination);
        const totalPositions = await Position.find(query).count();

        return {
            total: totalPositions,
            count: positions.length,
            next: positions.length === pagination.limit ? pagination.skip + pagination.limit : null,
            positions
        };

    } catch (err: any) {
        throw err;
    }
};

//get list for dropdown 
export const getPositionListForDropDown = async (req: Request) => {
    try {

        let pagination: any = await getPagination(req);

        pagination.sort = { name: 1 };

        const query: FilterQuery<PositionDocument> = { active: true };

        const searchKeyword: any = req.query.searchKeyword;

        if (searchKeyword) {
            let regExSearch = new RegExp(searchKeyword, 'i');

            query.name = regExSearch;
        }

        const positions = await Position.find(query, { name: 1 }, pagination);

        return {
            count: positions.length,
            next: positions.length === pagination.limit ? pagination.skip + pagination.limit : null,
            positions
        };

    } catch (err: any) {
        throw err;
    }
};