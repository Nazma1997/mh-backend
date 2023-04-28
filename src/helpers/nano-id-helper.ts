import { customAlphabet } from "nanoid/async"

export const generateNewNanoId = async (isOnlyNumber?: Boolean, noOfCharacterOrDigit?: number, prefix?: String) => {

    let alphabetCombination = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

    if (isOnlyNumber === true) alphabetCombination = "0123456789";

    noOfCharacterOrDigit = noOfCharacterOrDigit && noOfCharacterOrDigit > 0 ? noOfCharacterOrDigit : 12;

    const nanoid = customAlphabet(alphabetCombination, noOfCharacterOrDigit)

    const generatedNanoId = await nanoid();

    return prefix !== undefined ? prefix.toString() + generatedNanoId : generatedNanoId;
};