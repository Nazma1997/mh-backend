import _ from 'lodash';

//Check Two array is same or not
//[1,2,3] [1,2,3] => true
export const isArraySame = async (array1: any, array2: any) => {
    const is_same = (array1.length === array2.length) && array2.every(function (id: any, index: any) {
        return id === array1[index];
    });

    return is_same;
};

//are two objects same with respect to a field
export const isArrayOfObjectSame = async (array1: any, array2: any, choosenField: String) => {

    let is_same: Boolean = false;
    if (array1.length === array2.length && (_.differenceBy(array1, array2, choosenField)).length === 0) {
        is_same = true;
    }

    return is_same;
};

export const getStringWithoutSpecialCharacters = async (value: String) => {
    return value.replace(/[^a-zA-Z0-9.]/g, '-');
};

export const getUpperCaseString = async (value: String) => {
    return value.toUpperCase();
};

export const replaceSpacesWithUnderScores = async (value: String) => {
    return value.replace(/ /g, "_");
};