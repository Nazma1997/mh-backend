import { getValidationRulesByCountryCode } from "../validation-rule-helper";

export const isPhoneNumberValid = async (phone: String, countryCode: String) => {

    const country = await getValidationRulesByCountryCode(countryCode);

    if (country) {

        //@ts-ignore
        const dialCode = country.dial_code.substring(1);

        const prefix = phone.substring(0, dialCode.length);
        const subscriberNumber = phone.substring(dialCode.length).trim();

        if (dialCode && dialCode === prefix && subscriberNumber.length >= 4 && subscriberNumber.length <= 15) return true;
        else throw new Error("Phone Number is not valid for the given country!");

    } else {
        throw new Error("Phone Number is not valid for the given country!")
    }
};

