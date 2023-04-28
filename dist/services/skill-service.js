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
exports.getSkillListForDropDown = exports.getSkillList = exports.removeSkillInfo = exports.updateSkillInfo = exports.addSkillInfo = exports.skillAlreadyIsNotExists = exports.getSkillsByFilterQuery = exports.getSkillListByFilterQuery = exports.getSkillInfoByFilterQuery = exports.getSkillInfoById = void 0;
const pagination_helper_1 = require("../helpers/pagination-helper");
const skill_model_1 = __importDefault(require("../models/skill-model"));
//pull skill info by skillId if exists
const getSkillInfoById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield skill_model_1.default.findById(id);
    }
    catch (err) {
        throw err;
    }
});
exports.getSkillInfoById = getSkillInfoById;
//getting skill info by filter query
const getSkillInfoByFilterQuery = (query) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield skill_model_1.default.findOne(query);
    }
    catch (err) {
        throw err;
    }
});
exports.getSkillInfoByFilterQuery = getSkillInfoByFilterQuery;
//getting skill list by filter query
const getSkillListByFilterQuery = (query) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield skill_model_1.default.find(query);
    }
    catch (err) {
        throw err;
    }
});
exports.getSkillListByFilterQuery = getSkillListByFilterQuery;
//getting skill info by filter query
const getSkillsByFilterQuery = (query, fileds) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let selectedFileds = {};
        if (fileds)
            selectedFileds = fileds;
        return yield skill_model_1.default.find(query, selectedFileds);
    }
    catch (err) {
        throw err;
    }
});
exports.getSkillsByFilterQuery = getSkillsByFilterQuery;
//Check if an skill already exist in Database
const skillAlreadyIsNotExists = (name, id) => __awaiter(void 0, void 0, void 0, function* () {
    const query = { name: name };
    if (id)
        query._id = { $ne: id };
    const skill = yield (0, exports.getSkillInfoByFilterQuery)(query);
    if (skill) {
        const customError = new Error("Skill already exists!. Please enter a new skill.");
        customError.statusCode = 400;
        throw customError;
    }
    else
        return true;
});
exports.skillAlreadyIsNotExists = skillAlreadyIsNotExists;
//Add skill to Database
const addSkillInfo = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = req.body;
        //@ts-ignore
        const loggedInUserInfo = req.user;
        input.createdBy = loggedInUserInfo._id;
        return yield skill_model_1.default.create(input);
    }
    catch (err) {
        throw err;
    }
});
exports.addSkillInfo = addSkillInfo;
//update skill info according to skill id.
const updateSkillInfo = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updateData = req.body;
        const skillInfo = yield (0, exports.getSkillInfoById)(req.body.id);
        if (!skillInfo) {
            const customError = new Error("Invalid skill info!");
            customError.statusCode = 400;
            throw customError;
        }
        const skill = new skill_model_1.default(skillInfo);
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
            return yield skill.save();
        }
        return skillInfo;
    }
    catch (err) {
        throw err;
    }
});
exports.updateSkillInfo = updateSkillInfo;
//remove skills info and related info
const removeSkillInfo = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = { _id: req.body.id };
        const skillInfo = yield (0, exports.getSkillInfoByFilterQuery)(query);
        if (!skillInfo) {
            const customError = new Error("Invalid skill info");
            customError.statusCode = 400;
            throw customError;
        }
        return yield skill_model_1.default.updateOne(query, { $set: { deleted: true, active: false } });
    }
    catch (err) {
        throw err;
    }
});
exports.removeSkillInfo = removeSkillInfo;
//Get All Reader API
const getSkillList = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pagination = yield (0, pagination_helper_1.getPagination)(req);
        const query = {};
        const { active } = req.query;
        const searchKeyword = req.query.searchKeyword;
        if (active === "YES")
            query.active = true;
        else if (active === "NO")
            query.active = false;
        if (searchKeyword) {
            let regExSearch = new RegExp(searchKeyword, 'i');
            query.name = regExSearch;
        }
        const skills = yield skill_model_1.default.find(query, {}, pagination);
        const totalSkills = yield skill_model_1.default.find(query).count();
        return {
            total: totalSkills,
            count: skills.length,
            next: skills.length === pagination.limit ? pagination.skip + pagination.limit : null,
            skills
        };
    }
    catch (err) {
        throw err;
    }
});
exports.getSkillList = getSkillList;
//get list for dropdown 
const getSkillListForDropDown = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let pagination = yield (0, pagination_helper_1.getPagination)(req);
        pagination.sort = { name: 1 };
        const query = { active: true };
        const searchKeyword = req.query.searchKeyword;
        if (searchKeyword) {
            let regExSearch = new RegExp(searchKeyword, 'i');
            query.name = regExSearch;
        }
        const skills = yield skill_model_1.default.find(query, { name: 1 }, pagination);
        return {
            count: skills.length,
            next: skills.length === pagination.limit ? pagination.skip + pagination.limit : null,
            skills
        };
    }
    catch (err) {
        throw err;
    }
});
exports.getSkillListForDropDown = getSkillListForDropDown;
