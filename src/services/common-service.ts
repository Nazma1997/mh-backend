import { Request } from "express";

import _ from "lodash";

import Position from "../models/position-model";
import Skill from "../models/skill-model";
import Source from "../models/source-model";
import AppVersion from "../models/app-version-model";

//Get All Reader API
export const getPositionSkillAndSourceList = async (req: Request) => {
    try {

        const sources: any = await Source.find({}, { name: 1, active: 1 });
        const positions: any = await Position.find({}, { name: 1, active: 1 });
        const skills: any = await Skill.find({}, { name: 1, active: 1 });
        const appVersion: any = await AppVersion.find();

        return {
            positions: positions,
            skills: skills,
            sources: sources,
            appVersion: appVersion,
        };

    } catch (err: any) {
        throw err;
    }
};