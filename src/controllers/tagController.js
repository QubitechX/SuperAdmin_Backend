const { addTag,tagsList,tagUpdate,deleteTag} = require("../services/tagService");
const { response } = require("../config/helpers");

exports.addTag = async (req, res, next) => {
    const am = await addTag(req.body);
    if (am.status) {
        return response(res, req, am?.statusCode, true, am?.message, am?.data);
    } else {
        return response(res, req, am?.statusCode, false, am?.message, {});
    }
};
exports.tagsList = async (req, res, next) => {
    const am = await tagsList(req.body);
    if (am.status) {
        return response(res, req, am?.statusCode, true, am?.message, am?.data);
    } else {
        return response(res, req, am?.statusCode, false, am?.message, {});
    }
};
exports.tagUpdate = async (req, res, next) => {
    const am = await tagUpdate(req.body);
    if (am.status) {
        return response(res, req, am?.statusCode, true, am?.message, am?.data);
    } else {
        return response(res, req, am?.statusCode, false, am?.message, {});
    }
};
exports.deleteTag = async (req, res, next) => {
    const am = await deleteTag(req.body);
    if (am.status) {
        return response(res, req, am?.statusCode, true, am?.message, am?.data);
    } else {
        return response(res, req, am?.statusCode, false, am?.message, {});
    }
};
