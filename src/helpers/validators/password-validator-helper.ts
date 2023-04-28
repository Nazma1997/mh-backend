import { ObjectId } from "mongoose";

import { comparePassword, getUserInfoById } from "../../services/user-service";

const passwordRegex = /^(?=.*\d)(?=.*[a-zA-Z])(?!.*\s).{8,30}$/;

export const isPasswordValid = async (password: string) => {

    if (passwordRegex.test(password)) return true;
    else throw new Error("Your password is weak. Password must contains at least one character and one digit.");

};

//check if the given password matches with current password in the database
export const isCurrentPassword = async (id: ObjectId, password: string) => {
    const user = await getUserInfoById(id);

    if (!user) {
        throw new Error("Invalid user");
    }

    if (await comparePassword(password, user.password)) {
        return true;
    } else throw new Error("Your current password is wrong! Try again!");

};