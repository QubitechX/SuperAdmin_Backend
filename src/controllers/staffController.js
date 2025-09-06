const { addStaff,staffList,staffDetails,approveAndRejected,deleteStaff,staffUpdate} = require("../services/StaffService");
const { response } = require("../config/helpers");
exports.addStaff = async (req, res) => {
    const am = await addStaff(req.body);
    if (am.status) {
        return response(res, req, am?.statusCode, true, am?.message, am?.data);
    } else {
        return response(res, req, am?.statusCode, false, am?.message, {});
    }
};
exports.staffList = async (req, res) => {
    const ml = await staffList(req.body);
    if (ml.status) {
        return response(res, req, ml?.statusCode, true, ml?.message, ml?.data);
    } else {
        return response(res, req, ml?.statusCode, false, ml?.message, {});
    }
};
exports.staffDetails = async (req, res) => {
    const md = await staffDetails(req.body);
    if (md.status) {
        return response(res, req, md?.statusCode, true, md?.message, md?.data);
    } else {
        return response(res, req, md?.statusCode, false, md?.message, {});
    }
};
exports.approveAndRejectedStaff = async (req, res) => {
    req.body.userId=req.id;
    const aar = await approveAndRejected(req.body);
    if (aar.status) {
        return response(res, req, aar?.statusCode, true, aar?.message, aar?.data);
    } else {
        return response(res, req, aar?.statusCode, false, aar?.message, {});
    }
};
exports.deleteStaff = async (req, res) => {
    const dm = await deleteStaff(req.body);
    if (dm.status) {
        return response(res, req, dm?.statusCode, true, dm?.message, dm?.data);
    } else {
        return response(res, req, dm?.statusCode, false, dm?.message, {});
    }
};
exports.staffUpdate = async (req, res) => {
    const mu = await staffUpdate(req.body);;
    if (mu.status) {
        return response(res, req, mu?.statusCode, true, mu?.message, mu?.data);
    } else {
        return response(res, req, mu?.statusCode, false, mu?.message, {});
    }
};

