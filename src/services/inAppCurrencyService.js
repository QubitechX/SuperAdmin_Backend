
const Merchant = require('../models/Merchant');
const mongoose = require("mongoose");
const { create, find, findOneAndUpdate, findOneAndDelete } = require("../queries/adminQueries");
const InAppCurrency = require('../models/InAppCurrency');
const { returnError } = require("../config/helpers");
exports.addInAppCurrency = async (body) => {
    try {
        const addInAppCurrency = await create(InAppCurrency, body)
        if (addInAppCurrency?.status) {
            return { status: true, message: "save Data ", statusCode: 200, data: addInAppCurrency?.message, };
        }
        else {
            const error = addInAppCurrency?.message;
           return returnError(error)
        }
    } catch (error) {
       return returnError(error)
    }
};
exports.inAppCurrencyList = async (body) => {
    try {
        let filter = {};
        if (body.status) {
            filter.status = body.status;
        }
        const page = parseInt(body.page) || 1;
        const limit = parseInt(body.limit) || 10;
        const skip = (page - 1) * limit;
        const inAppCurrency = await find(InAppCurrency, filter = filter, pagination = { skip, limit }, sort = {}, projection = {}, populate = null)

        return {
            status: true, message: "Merchant List ", statusCode: 200,
            data: inAppCurrency,
        };
    } catch (error) {
        console.error(error);
        return returnError(error)
    }
};

exports.approveAndRejected = async (body) => {
    try {
        const { status, inAppCurrencyID } = body;
        if (!mongoose.Types.ObjectId.isValid(inAppCurrencyID)) {
            return { status: false, message: "Invalid ID", statusCode: 400 };
        }
        let filter = { _id: inAppCurrencyID };
        let updateData = { status }
        const updateStatus = await findOneAndUpdate(InAppCurrency, filter, updateData)
        if (updateStatus.status) {
            return { status: true, message: "Status Update", statusCode: 200, data: updateStatus?.message };
        }
        else {
            return returnError(error)
        }

    } catch (error) {
        console.error(error);
        return returnError(error)
    }
};
exports.deleteInAppCurrency = async (body) => {
    try {
        const { inAppCurrencyID } = body;
        if (!mongoose.Types.ObjectId.isValid(inAppCurrencyID)) {
            return { status: false, message: "Invalid ID", statusCode: 400 };
        }
        const deletedinAppCurrency = await findOneAndDelete(InAppCurrency, { _id: inAppCurrencyID },);
        if (deletedinAppCurrency.status) {
            return { status: true, message: "Data deleted", statusCode: 200, data: deletedinAppCurrency?.message };
        }
        else {
            return returnError(error)
        }

    } catch (error) {
        console.error(error);
        return returnError(error)
    }
};

exports.inAppCurrencyUpdate = async (body) => {
    try {
        const inAppCurrencyID = body?.inAppCurrencyID;
        const inAppCurrency = await InAppCurrency.findOne({ _id: inAppCurrencyID });
        if (!inAppCurrency) {
            return { status: false, message: "Currency not found", statusCode: 400, data: {}, };
        }
        const updateData = body;
        const updatedInAppCurrency = await InAppCurrency.findByIdAndUpdate(
            { _id: inAppCurrencyID },
            { $set: updateData },
            { new: true, runValidators: true }
        );
        if (!updatedInAppCurrency) {
            return { status: false, message: "Currency not found", statusCode: 404 };
        }
        return {
            status: true,
            message: "Currency updated",
            statusCode: 200,
            data: updatedInAppCurrency
        };
    } catch (error) {
        console.error(error);
        return { status: false, message: "An error occurred", statusCode: 500, data: error, };
    }
}
