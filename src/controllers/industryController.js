const { addIndustry,industryList,industryUpdate,deleteIndustry} = require("../services/industryService");
const { response } = require("../config/helpers");
const { industrySchema } = require("../middlewares/validations/adminValidation");

exports.addIndustry = async (req, res, next) => {
    const { error, value } = industrySchema.validate(req.body);
    if (error) return response(res, req, 400, false, error.details[0].message, {});
    const am = await addIndustry(value);
    if (am.status) {
        return response(res, req, am?.statusCode, true, am?.message, am?.data);
    } else {
        return response(res, req, am?.statusCode, false, am?.message, {});
    }
};
exports.industryList = async (req, res, next) => {
    const am = await industryList(req.body);
    if (am.status) {
        return response(res, req, am?.statusCode, true, am?.message, am?.data);
    } else {
        return response(res, req, am?.statusCode, false, am?.message, {});
    }
};
exports.industryUpdate = async (req, res, next) => {
    // const { error, value } = industrySchema.validate(req.body);
    // if (error) return response(res, req, 400, false, error.details[0].message, {});
    const am = await industryUpdate(req.body);
    if (am.status) {
        return response(res, req, am?.statusCode, true, am?.message, am?.data);
    } else {
        return response(res, req, am?.statusCode, false, am?.message, {});
    }
};
exports.deleteIndustry = async (req, res, next) => {
    const am = await deleteIndustry(req.body);
    if (am.status) {
        return response(res, req, am?.statusCode, true, am?.message, am?.data);
    } else {
        return response(res, req, am?.statusCode, false, am?.message, {});
    }
};
