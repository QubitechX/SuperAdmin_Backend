const { addSubscription,approveAndRejected,deleteSubscription,subscriptionUpdate,subscriptionList} = require("../services/subscriptionService");
const { response } = require("../config/helpers");
  
exports.addSubscription = async (req, res, next) => {
    const am = await addSubscription(req.body);
    if (am.status) {
        return response(res, req, am?.statusCode, true, am?.message, am?.data);
    } else {
        return response(res, req, am?.statusCode, false, am?.message, {});
    }
};
exports.subscriptionList = async (req, res, next) => {
    const am = await subscriptionList(req.body);
    if (am.status) {
        return response(res, req, am?.statusCode, true, am?.message, am?.data);
    } else {
        return response(res, req, am?.statusCode, false, am?.message, {});
    }
};
exports.subscriptionUpdate = async (req, res, next) => {
    const am = await subscriptionUpdate(req.body);
    if (am.status) {
        return response(res, req, am?.statusCode, true, am?.message, am?.data);
    } else {
        return response(res, req, am?.statusCode, false, am?.message, {});
    }
};
exports.deleteSubscription = async (req, res, next) => {
    const am = await deleteSubscription(req.body);
    if (am.status) {
        return response(res, req, am?.statusCode, true, am?.message, am?.data);
    } else {
        return response(res, req, am?.statusCode, false, am?.message, {});
    }
};
exports.approveAndRejectedSubscription = async (req, res, next) => {
    const am = await approveAndRejected(req.body);
    if (am.status) {
        return response(res, req, am?.statusCode, true, am?.message, am?.data);
    } else {
        return response(res, req, am?.statusCode, false, am?.message, {});
    }
};
