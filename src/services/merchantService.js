
const Merchant = require('../models/Merchant');
const mongoose = require("mongoose");
const { returnError, generateNextUserID, approvedByDetails } = require("../config/helpers");
const User = require('../models/User');
const s3Url = process.env.AWS_S3_URL;
exports.userList = async (body) => {
    try {
        const totalMerchants = await Merchant.countDocuments();
        const totalUsers = await User.countDocuments({ role: 'user' });
        const totalStaffs = await User.countDocuments({ roles: 'staff' });

        return {
            status: true, message: "Users List ", statusCode: 200, data: { merchantsCount: totalMerchants, usersCount: totalUsers, staffsCount: totalStaffs },
        };
    } catch (error) {
        console.error(error);
        return returnError(error)

    }
}
exports.addMerchant = async (body) => {
    try {
        body.merchantID = await generateNextUserID();
        const merchantData = {
            ...body,
            bankAccountDetails: { accountNumber: body?.accountNumber, bankName: body?.bankName, ifscCode: body?.ifscCode, branch: body?.branch },
            timings: { openingTime: body?.openingTime, closingTime: body?.closingTime },
            addedBy: "Admin"
        };
        console.log(merchantData,"%%%%%%%%%%%%%%%%%%%%%%%%");
        const newMerchant = new Merchant(merchantData);
        const savedMerchant = await newMerchant.save();
        return { status: true, message: "Merchant saved ", statusCode: 200, data: savedMerchant, };
    } catch (error) {
        console.error(error);
        return returnError(error)

    }
};
exports.merchantList = async (body) => {
    try {
        let filter = {};
        if (body.search) {
            const searchRegex = new RegExp(body.search, "i");
            filter.$or = [
                { merchantName: searchRegex },
                { email: searchRegex }
            ];
        }
        if (body.city) {
            filter.city = { $regex: body.city, $options: "i" };
        }
        if (body.status!='' && body.status!=null) {
        filter.status = body.status;
        }
        const page = Math.max(parseInt(body.page) || 1, 1); 
        const limit = Math.max(parseInt(body.limit) || 10, 1); 
        const skip = (page - 1) * limit;
        const merchants = await Merchant.find(filter)
        .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate({
                path: 'businessType',
                select: '_id name',
                options: { strictPopulate: false }
            })
            .lean(); 
        const merchantList = await Promise.all(
            merchants.map(async (merchant) => {
                const approver = merchant.approvalBy ? await approvedByDetails(merchant.approvalBy) : null;

                if (approver) {
                    approver.reason = merchant?.reason || null;
                }
                return {
                    imageGallery: merchant?.imageGallery?.map(path => path ? s3Url + path : null) || [],
                    documents: merchant?.documents?.map(path => path ? s3Url + path : null) || [],
                    profileImage: merchant?.profileImage ? s3Url + merchant.profileImage : null,
                    city: merchant?.city || null,
                    status: merchant?.status || null,
                    verifiedBy: merchant?.approvalBy || null,
                    verifiedByName: approver?.name || null,
                    approvalAt: merchant?.approvalAt || null,
                    id: merchant?._id || null,
                    merchantName: merchant?.merchantName || null,
                    merchantID: merchant?.merchantID || null,
                    email: merchant?.email || null,
                    contactNumber: merchant?.contactNumber || null,
                    businessType: merchant?.businessType || null,
                    location: merchant?.location || null,
                    averageCostForTwo: merchant?.averageCostForTwo || null,
                    tags: merchant?.tags || [],
                    popularDishes: merchant?.popularDishes || [],
                    googleMapDirection: merchant?.googleMapDirection || null,
                    facilities: merchant?.facilities || [],
                    menuPhotos: merchant?.menuPhotos?.map(path => path ? s3Url + path : null) || [],
                    registeredOn: merchant?.createdAt || null,
                    approvalByDetails: approver || null,
                    reason: merchant?.reason || null,
                    modifications: false
                };
            })
        );
        const totalMerchants = await Merchant.countDocuments(filter);
        const totalPages = Math.ceil(totalMerchants / limit);

        return {
            status: true,
            message: "Merchant List",
            statusCode: 200,
            data: {
                total: totalMerchants,
                currentPage: page,
                totalPages: totalPages,
                data: merchantList
            },
        };
    } catch (error) {
        console.error("Error in merchantList:", error);
        return returnError(error);
    }
};
exports.merchantDetails = async (body) => {
    try {
        const merchantID = body?.merchantID;
        const merchant = await Merchant.findOne({ _id: merchantID }).populate({
                path: 'businessType',
                select: '_id name',
                options: { strictPopulate: false }
            })
            .lean();
        if (!merchant) {
            return { status: false, message: "Merchant not found", statusCode: 400, data: {}, };
        }
        const approver = await approvedByDetails(merchant.approvalBy);
        if (approver) {
            approver.reason = merchant?.reason || null;
        }
        const merchantData = {
            imageGallery: merchant?.imageGallery.map(path => s3Url + path),
            documents: merchant?.documents.map(path => s3Url + path),
            profileImage: merchant?.profileImage ? s3Url + merchant.profileImage : null,
            city: merchant?.city,
            status: merchant?.status,
            verifiedBy: merchant?.verifiedBy || null,
            approvalAt: merchant?.approvalAt,
            id: merchant?._id,
            merchantName: merchant?.merchantName,
            merchantID: merchant?.merchantID,
            accountNumber: merchant?.bankAccountDetails?.accountNumber,
            branch: merchant?.bankAccountDetails?.branch,
            bankName: merchant?.bankAccountDetails?.bankName,
            ifscCode: merchant?.bankAccountDetails?.ifscCode,
            openingTime: merchant?.timings?.openingTime,
            closingTime: merchant?.timings?.closingTime,
            averageCostForTwo: merchant?.averageCostForTwo,
            email: merchant?.email,
            contactNumber: merchant?.contactNumber,
            businessType: merchant?.businessType,
            location: merchant?.location,
            averageCostForTwo: merchant?.averageCostForTwo,
            tags: merchant?.tags,
            popularDishes: merchant?.popularDishes,
            googleMapDirection: merchant?.googleMapDirection,
            facilities: merchant?.facilities,
            menuPhotos: merchant?.menuPhotos.map(path => s3Url + path),
            registeredOn: merchant?.createdAt,
            approvalAt: merchant?.approvalAt,
            employeeAssignedAt: null,
            accountCreatedBy: merchant?.addedBy,
            reason: merchant?.reason || null,
            approvalByDetails: approver || null
        }
        return {
            status: true, message: "Merchant Details ", statusCode: 200, data: merchantData,
        };
    } catch (error) {
        console.error(error);
        return returnError(error)
    }
}
exports.approveAndRejected = async (body) => {
    try {
        const { status, merchantID, reason, userId } = body;
        if (!mongoose.Types.ObjectId.isValid(merchantID)) {
            return { status: false, message: "Invalid Merchant ID", statusCode: 400 };
        }
        if (!status || status == undefined) {
            return { status: false, message: "Status is required", statusCode: 400 };
        }
        if (status === 2) {
            if (!reason) {
                return { status: false, message: "Reason field is required", statusCode: 400 };
            }
        }
        const updateData = {
            status,
            approvalAt: new Date(),
            approvalBy: userId,
            reason: status === 2 || status === 1 ? reason : undefined
        };
        const updatedMerchant = await Merchant.findByIdAndUpdate(
            merchantID,
            { $set: updateData },
            { new: true }
        );

        if (!updatedMerchant) {
            return { status: false, message: "Merchant not found", statusCode: 404 };
        }

        return {
            status: true,
            message: "Merchant details updated successfully",
            statusCode: 200,
            data: updatedMerchant
        };
    } catch (error) {
        console.error(error);
        return returnError(error)
    }
};
exports.deleteMerchant = async (body) => {
    try {
        const { merchantID } = body;
        if (!mongoose.Types.ObjectId.isValid(merchantID)) {
            return { status: false, message: "Invalid Merchant ID", statusCode: 400 };
        }
        const deletedMerchant = await Merchant.findByIdAndDelete({ _id: merchantID },);
        if (!deletedMerchant) {
            return { status: false, message: "Merchant not found", statusCode: 404 };
        }

        return {
            status: true,
            message: "Merchant details updated successfully",
            statusCode: 200,
            data: deletedMerchant
        };
    } catch (error) {
        console.error(error);
        return returnError(error)
    }
};

exports.merchantUpdate = async (body) => {
    try {
        const { merchantID, ...updateData } = body;
        const merchant = await Merchant.findOne({ _id: merchantID });
        if (!merchant) {
            return { status: false, message: "Merchant not found", statusCode: 400, data: {}, };
        }
        const updatedMerchant = await Merchant.findByIdAndUpdate(
            { _id: merchantID },
            { $set: updateData },
            { new: true, runValidators: true }
        );
        if (!updatedMerchant) {
            return { status: false, message: "Merchant not found", statusCode: 404 };
        }
        return {
            status: true,
            message: "Merchant details updated successfully",
            statusCode: 200,
            data: updatedMerchant
        };

    } catch (error) {
        console.error(error);
        return returnError(error)
    }
}