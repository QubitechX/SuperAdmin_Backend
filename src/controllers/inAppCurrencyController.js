const { addInAppCurrency,approveAndRejected,deleteInAppCurrency,inAppCurrencyUpdate,inAppCurrencyList} = require("../services/inAppCurrencyService");
const { response } = require("../config/helpers");
  
exports.addInAppCurrency= async (req, res, next) => {
    const am = await addInAppCurrency(req.body);
    if (am.status) {
        return response(res, req, am?.statusCode, true, am?.message, am?.data);
    } else {
        return response(res, req, am?.statusCode, false, am?.message, {});
    }
};
exports.inAppCurrencyList = async (req, res, next) => {
    const am = await inAppCurrencyList(req.body);
    if (am.status) {
        return response(res, req, am?.statusCode, true, am?.message, am?.data);
    } else {
        return response(res, req, am?.statusCode, false, am?.message, {});
    }
};
exports.inAppCurrencyUpdate = async (req, res, next) => {
    const am = await inAppCurrencyUpdate(req.body);
    if (am.status) {
        return response(res, req, am?.statusCode, true, am?.message, am?.data);
    } else {
        return response(res, req, am?.statusCode, false, am?.message, {});
    }
};
exports.deleteInAppCurrency = async (req, res, next) => {
    const am = await deleteInAppCurrency(req.body);
    if (am.status) {
        return response(res, req, am?.statusCode, true, am?.message, am?.data);
    } else {
        return response(res, req, am?.statusCode, false, am?.message, {});
    }
};
exports.approveAndRejectedInAppCurrency = async (req, res, next) => {
    const am = await approveAndRejected(req.body);
    if (am.status) {
        return response(res, req, am?.statusCode, true, am?.message, am?.data);
    } else {
        return response(res, req, am?.statusCode, false, am?.message, {});
    }
};
