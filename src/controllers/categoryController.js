const { addCategory,categoriesList,categoryUpdate,deleteCategory} = require("../services/categoryService");
const { response } = require("../config/helpers");

exports.addCategory = async (req, res, next) => {
     
    const am = await addCategory(req.body);
    if (am.status) {
        return response(res, req, am?.statusCode, true, am?.message, am?.data);
    } else {
        return response(res, req, am?.statusCode, false, am?.message, {});
    }
};
exports.categoriesList = async (req, res, next) => {
    const am = await categoriesList(req.body);
    if (am.status) {
        return response(res, req, am?.statusCode, true, am?.message, am?.data);
    } else {
        return response(res, req, am?.statusCode, false, am?.message, {});
    }
};
exports.categoryUpdate = async (req, res, next) => {
    const am = await categoryUpdate(req.body);
    if (am.status) {
        return response(res, req, am?.statusCode, true, am?.message, am?.data);
    } else {
        return response(res, req, am?.statusCode, false, am?.message, {});
    }
};
exports.deleteCategory = async (req, res, next) => {
    const am = await deleteCategory(req.body);
    if (am.status) {
        return response(res, req, am?.statusCode, true, am?.message, am?.data);
    } else {
        return response(res, req, am?.statusCode, false, am?.message, {});
    }
};
