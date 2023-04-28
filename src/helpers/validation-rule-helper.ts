import _ from "lodash";

import CountryWiseValidationRules from "../utils/static/phone-postcode-validation-rules";

export const getValidationRulesByCountryCode = async (countryCode: String) => {
    return _.find(CountryWiseValidationRules, (info: any) => {
        return info && info.code === countryCode;
    });
};