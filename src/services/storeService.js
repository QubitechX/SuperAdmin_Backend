const Store = require('../models/Store');
const { returnError } = require("../config/helpers");

exports.storeListBasedOnStaff = async () => {
    try {
        const stores = await Store.find({}, '_id storeName');
        return {
            status: true,
            message: "Store List",
            statusCode: 200,
            data: stores,
        };
    } catch (error) {
        console.error(error);
        return returnError(error);
    }
};
