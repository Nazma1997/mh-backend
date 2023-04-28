import { Request } from "express";
import { FilterQuery, DocumentDefinition, ObjectId } from "mongoose";

import _ from "lodash";

import { getPagination } from "../helpers/pagination-helper";
import Skill, { SkillDocument } from "../models/skill-model";


//pull skill info by skillId if exists
export const getSkillInfoById = async (id: ObjectId) => {
    try {
        return await Skill.findById(id);
    } catch (err: any) {
        throw err;
    }
};

//getting skill info by filter query
export const getSkillInfoByFilterQuery = async (query: FilterQuery<SkillDocument>) => {
    try {
        return await Skill.findOne(query);
    } catch (err: any) {
        throw err;
    }
};

//getting skill list by filter query
export const getSkillListByFilterQuery = async (query: FilterQuery<SkillDocument>) => {
    try {
        return await Skill.find(query);
    } catch (err: any) {
        throw err;
    }
};

//getting skill info by filter query
export const getSkillsByFilterQuery = async (query: FilterQuery<SkillDocument>, fileds?: Object) => {
    try {
        let selectedFileds: Object = {};
        if (fileds) selectedFileds = fileds;

        return await Skill.find(query, selectedFileds);
    } catch (err: any) {
        throw err;
    }
};

//Check if an skill already exist in Database
export const skillAlreadyIsNotExists = async (name: string, id?: ObjectId) => {
    const query: any = { name: name };

    if (id) query._id = { $ne: id };

    const skill: any = await getSkillInfoByFilterQuery(query);

    if (skill) {
        const customError: any = new Error("Skill already exists!. Please enter a new skill.");
        customError.statusCode = 400;
        throw customError;
    } else return true;
};

//Add skill to Database
export const addSkillInfo = async (req: Request) => {
    try {
        const input: DocumentDefinition<SkillDocument> = req.body;

        //@ts-ignore
        const loggedInUserInfo: any = req.user;

        input.createdBy = loggedInUserInfo._id;

        return await Skill.create(input);

    } catch (err: any) {
        throw err;
    }
};

//update skill info according to skill id.
export const updateSkillInfo = async (req: Request) => {
    try {
        const updateData: DocumentDefinition<SkillDocument> = req.body;

        const skillInfo: any = await getSkillInfoById(req.body.id);

        if (!skillInfo) {
            const customError: any = new Error("Invalid skill info!");
            customError.statusCode = 400;
            throw customError;
        }

        const skill: any = new Skill(skillInfo);
        let isChanged = false;

        if (updateData.name && skillInfo.name !== updateData.name) {
            isChanged = true;
            skill.name = updateData.name;
        }

        if (skillInfo.active !== updateData.active) {
            isChanged = true;
            skill.active = updateData.active;
        }

        if (isChanged) {
            return await skill.save();
        }

        return skillInfo;

    } catch (err: any) {
        throw err;
    }
};

//remove skills info and related info
export const removeSkillInfo = async (req: Request) => {
    try {

        const query = { _id: req.body.id };

        const skillInfo: any = await getSkillInfoByFilterQuery(query);

        if (!skillInfo) {
            const customError: any = new Error("Invalid skill info");
            customError.statusCode = 400;
            throw customError;
        }

        return await Skill.updateOne(query, { $set: { deleted: true, active: false } });

    } catch (err: any) {
        throw err;
    }
};

//Get All Reader API
export const getSkillList = async (req: Request) => {
    try {
        const pagination = await getPagination(req);

        const query: FilterQuery<SkillDocument> = {};

        const { active } = req.query;
        const searchKeyword: any = req.query.searchKeyword;

        if (active === "YES") query.active = true;
        else if (active === "NO") query.active = false;

        if (searchKeyword) {
            let regExSearch = new RegExp(searchKeyword, 'i');
            query.name = regExSearch;
        }

        const skills = await Skill.find(query, {}, pagination);
        const totalSkills = await Skill.find(query).count();

        return {
            total: totalSkills,
            count: skills.length,
            next: skills.length === pagination.limit ? pagination.skip + pagination.limit : null,
            skills
        };

    } catch (err: any) {
        throw err;
    }
};

//get list for dropdown 
export const getSkillListForDropDown = async (req: Request) => {
    try {

        let pagination: any = await getPagination(req);

        pagination.sort = { name: 1 };

        const query: FilterQuery<SkillDocument> = { active: true };

        const searchKeyword: any = req.query.searchKeyword;

        if (searchKeyword) {
            let regExSearch = new RegExp(searchKeyword, 'i');

            query.name = regExSearch;
        }

        const skills = await Skill.find(query, { name: 1 }, pagination);

        return {
            count: skills.length,
            next: skills.length === pagination.limit ? pagination.skip + pagination.limit : null,
            skills
        };

    } catch (err: any) {
        throw err;
    }
};