const { addMerchant,merchantList,merchantDetails,approveAndRejected,deleteMerchant,merchantUpdate,userList} = require("../services/merchantService");
const { response } = require("../config/helpers");
exports.serverStatus = async (req, res, next) => {
    try {
        return response(res, req, 200, true, "Server is runing ", {});
    } catch (err) {
        next(err);
    }
};

exports.addMerchant = async (req, res) => {
    const am = await addMerchant(req.body);
    if (am.status) {
        return response(res, req, am?.statusCode, true, am?.message, am?.data);
    } else {
        return response(res, req, am?.statusCode, false, am?.message, {});
    }
};
exports.merchantList = async (req, res) => {
    const ml = await merchantList(req.body);
    if (ml.status) {
        return response(res, req, ml?.statusCode, true, ml?.message, ml?.data);
    } else {
        return response(res, req, ml?.statusCode, false, ml?.message, {});
    }
};
exports.merchantDetails = async (req, res) => {
    const md = await merchantDetails(req.body);
    if (md.status) {
        return response(res, req, md?.statusCode, true, md?.message, md?.data);
    } else {
        return response(res, req, md?.statusCode, false, md?.message, {});
    }
};
exports.approveAndRejected = async (req, res) => {
    req.body.userId=req.id;
    const aar = await approveAndRejected(req.body);
    if (aar.status) {
        return response(res, req, aar?.statusCode, true, aar?.message, aar?.data);
    } else {
        return response(res, req, aar?.statusCode, false, aar?.message, {});
    }
};
exports.deleteMerchant = async (req, res) => {
    const dm = await deleteMerchant(req.body);
    if (dm.status) {
        return response(res, req, dm?.statusCode, true, dm?.message, dm?.data);
    } else {
        return response(res, req, dm?.statusCode, false, dm?.message, {});
    }
};
exports.merchantUpdate = async (req, res) => {
    const mu = await merchantUpdate(req.body);;
    if (mu.status) {
        return response(res, req, mu?.statusCode, true, mu?.message, mu?.data);
    } else {
        return response(res, req, mu?.statusCode, false, mu?.message, {});
    }
};
exports.userList = async (req, res) => {
    const mu = await userList(req.body);;
    if (mu.status) {
        return response(res, req, mu?.statusCode, true, mu?.message, mu?.data);
    } else {
        return response(res, req, mu?.statusCode, false, mu?.message, {});
    }
};
merchantDetails

