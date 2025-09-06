const { storeListBasedOnStaff,} = require("../services/storeService");
const { response } = require("../config/helpers");

exports.storeListBasedOnStaff = async (req, res) => {
    const ml = await storeListBasedOnStaff(req.body);
    if (ml.status) {
        return response(res, req, ml?.statusCode, true, ml?.message, ml?.data);
    } else {
        return response(res, req, ml?.statusCode, false, ml?.message, {});
    }
};

