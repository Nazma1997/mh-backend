import slugify from "slugify";

const createNewSlug = async (text: string, isNanoIdOnlyNumber?: boolean) => {
    return await slugify(text, {
        replacement: '-',   // replace spaces with replacement character, defaults to `-`
        remove: undefined,       // remove characters that match regex, defaults to `undefined`
        lower: true,        // convert to lower case, defaults to `false`
        strict: true,       // strip special characters except replacement, defaults to `false`
        locale: 'vi',       // language code of the locale to use
        trim: true
    });
};

export default createNewSlug;