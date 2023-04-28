import { Request } from "express";
import { FilterQuery, DocumentDefinition, ObjectId } from "mongoose";

import _ from "lodash";

import { getPagination } from "../helpers/pagination-helper";
import TermsCondition, { TermsConditionDocument } from "../models/terms-condition-model";


//pull terms condition info by terms condition id if exists
export const getTermsConditionInfoById = async (id: ObjectId) => {
    try {
        return await TermsCondition.findById(id);
    } catch (err: any) {
        throw err;
    }
};

//getting terms condition info by filter query
export const getTermsConditionInfoByFilterQuery = async (query: FilterQuery<TermsConditionDocument>) => {
    try {
        return await TermsCondition.findOne(query);
    } catch (err: any) {
        throw err;
    }
};

//getting terms condition info by filter query
export const getTermsConditionsByFilterQuery = async (query: FilterQuery<TermsConditionDocument>, fileds?: Object) => {
    try {
        let selectedFileds: Object = {};
        if (fileds) selectedFileds = fileds;

        return await TermsCondition.find(query, selectedFileds);
    } catch (err: any) {
        throw err;
    }
};

//Add terms condition info to Database
export const addTermsConditionInfo = async (req: Request) => {
    try {
        const input: DocumentDefinition<TermsConditionDocument> = req.body;

        //@ts-ignore
        const loggedInUserInfo: any = req.user;
        
        input.createdBy = loggedInUserInfo._id;

        return await TermsCondition.create(input);

    } catch (err: any) {
        throw err;
    }
};

//update terms condition info according to terms condition id.
export const updateTermsConditionInfo = async (req: Request) => {
    try {
        const updateData: DocumentDefinition<TermsConditionDocument> = req.body;

        const termsConditionInfo: any = await getTermsConditionInfoById(req.body.id);

        if (!termsConditionInfo) {
            const customError: any = new Error("Invalid terms and condition info!");
            customError.statusCode = 400;
            throw customError;
        }

        const termsCondition: any = new TermsCondition(termsConditionInfo);
        let isChanged = false;

        if (updateData.description && termsConditionInfo.description !== updateData.description) {
            isChanged = true;
            termsCondition.description = updateData.description;
        }

        if (termsConditionInfo.active !== updateData.active) {
            isChanged = true;
            termsCondition.active = updateData.active;
        }

        if (isChanged) {
            return await termsCondition.save();
        }

        return termsConditionInfo;

    } catch (err: any) {
        throw err;
    }
};

//remove terms conditions info and related info
export const removeTermsConditionInfo = async (req: Request) => {
    try {

        const query = { _id: req.body.id };

        const termsConditionInfo: any = await getTermsConditionInfoByFilterQuery(query);

        if (!termsConditionInfo) {
            const customError: any = new Error("Invalid terms and condition info");
            customError.statusCode = 400;
            throw customError;
        }

        return await TermsCondition.updateOne(query, { $set: { deleted: true, active: false } });

    } catch (err: any) {
        throw err;
    }
};

//Get All Reader API
export const getTermsConditionList = async (req: Request) => {
    try {
        const pagination = await getPagination(req);

        const query: FilterQuery<TermsConditionDocument> = {};

        const { active } = req.query;
        const searchKeyword: any = req.query.searchKeyword;

        if (active === "YES") query.active = true;
        else if (active === "NO") query.active = false;

        if (searchKeyword) {
            let regExSearch = new RegExp(searchKeyword, 'i');
            query.description = regExSearch;
        }

        const termsConditions = await TermsCondition.find(query, {}, pagination);
        const totalTermsConditions = await TermsCondition.find(query).count();

        return {
            total: totalTermsConditions,
            count: termsConditions.length,
            next: termsConditions.length === pagination.limit ? pagination.skip + pagination.limit : null,
            termsConditions
        };

    } catch (err: any) {
        throw err;
    }
};