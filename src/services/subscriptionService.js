
const Merchant = require('../models/Merchant');
const mongoose = require("mongoose");
const { create, find, findOneAndUpdate, findOneAndDelete } = require("../queries/adminQueries");
const Subscription = require('../models/Subscription');
const { returnError } = require("../config/helpers");
exports.addSubscription = async (body) => {
    try {
        const addSubscription = await create(Subscription, body)
        if (addSubscription?.status) {
            return { status: true, message: "save Data ", statusCode: 200, data: addSubscription?.message, };
        }
        else {
            const error = addSubscription?.message;
            return returnError(error)
        }
    } catch (error) {
        return returnError(error)
    }
};
exports.subscriptionList = async (body) => {
    try {
        let filter = {
            isManageCurrency: false
        };

        if (body.isManageCurrency == true) {
            filter.isManageCurrency = true;
        }
        if (body.status) {
            filter.status = body.status;
        }
        const page = parseInt(body.page) || 1;
        const limit = parseInt(body.limit) || 10;
        const skip = (page - 1) * limit;
        const subscriptions = await find(Subscription, filter = filter, pagination = { skip, limit }, sort = {}, projection = {}, populate = null)

        return {
            status: true, message: "Merchant List ", statusCode: 200,
            data: subscriptions,
        };
    } catch (error) {
        console.error(error);
        return returnError(error)
    }
};

exports.approveAndRejected = async (body) => {
    try {
        const { status, subscriptionID } = body;
        if (!mongoose.Types.ObjectId.isValid(subscriptionID)) {
            return { status: false, message: "Invalid ID", statusCode: 400 };
        }
        let filter = { _id: subscriptionID };
        let updateData = { status }
        const updateStatus = await findOneAndUpdate(Subscription, filter, updateData)
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
exports.deleteSubscription = async (body) => {
    try {
        const { subscriptionID } = body;
        if (!mongoose.Types.ObjectId.isValid(subscriptionID)) {
            return { status: false, message: "Invalid ID", statusCode: 400 };
        }
        const deletedSubscription = await findOneAndDelete(Subscription, { _id: subscriptionID },);
        if (deletedSubscription.status) {
            return { status: true, message: "Data deleted", statusCode: 200, data: deletedSubscription?.message };
        }
        else {
            return returnError(error)
        }

    } catch (error) {
        console.error(error);
        return returnError(error)
    }
};

exports.subscriptionUpdate = async (body) => {
    try {
        const subscriptionID = body?.subscriptionID;
        const subscription = await Subscription.findOne({ _id: subscriptionID });
        if (!subscription) {
            return { status: false, message: "Subscription not found", statusCode: 400, data: {}, };
        }
        const updateData = body;
        const updatedSubscription = await Subscription.findByIdAndUpdate(
            { _id: subscriptionID },
            { $set: updateData },
            { new: true, runValidators: true }
        );
        if (!updatedSubscription) {
            return { status: false, message: "Subscription not found", statusCode: 404 };
        }
        return {
            status: true,
            message: "Subscription updated",
            statusCode: 200,
            data: updatedSubscription
        };
    } catch (error) {
        console.error(error);
        return { status: false, message: "An error occurred", statusCode: 500, data: error, };
    }
}
