
const Merchant = require('../models/Merchant');
require('../models/Store');
require('../models/User');
require('../models/Category');
const ApprovalRequest = require('../models/ApprovalRequest');
const mongoose = require("mongoose");
const { returnError, staffNextUserID, approvedByDetails } = require("../config/helpers");
const User = require('../models/User');
const dal = require("../queries/adminQueries");
const Store = require('../models/Store');
const s3Url = process.env.AWS_S3_URL

exports.addStaff = async (body) => {
    try {
        const userId = await staffNextUserID();
        body.userId = userId;
        const staffData = {
            ...body,
            role: ['staff'],
            addedBy: 'admin',
            bankAccountDetails: {
                accountNumber: body.accountNumber || null,
                bankName: body.bankName || null,
                ifscCode: body.ifscCode || null,
                branch: body.branch || null,
            },
        };
        const newStaff = new User(staffData);
        const savedStaff = await newStaff.save();
        let storeId = "680687aaabebf48846bebf22";
        let merchantId = "6805144f51baae0ad5db8fc6";
        if (body?.storeId && body.storeId.trim() !== '') {
            const store = await Store.findOne({ _id: body.storeId }).lean();

            if (store) {
                if (store.merchant) {
                    const merchant = await Merchant.findById(store.merchant).lean();
                    merchantId = merchant?._id || merchantId;
                }
                storeId = store._id;
            }
        }
        const staffDetails = {
            tagsId: body?.tags,
            staffId: savedStaff._id,
            industryType: body?.industryType,
            storeId: storeId,
            merchantId: merchantId,
        };

        const approval = new ApprovalRequest(staffDetails);
        await approval.save();

        return {
            status: true,
            message: "Staff added successfully",
            statusCode: 200,
            data: savedStaff,
        };
    } catch (error) {
        console.error("Error in addStaff:", error);
        return {
            status: false,
            message: error.message,
            statusCode: 500,
            error: error
        };
    }
};


exports.staffList = async (body) => {
    try {
        const filter = {};
        if (body.search) {
            const searchRegex = new RegExp(body.search, "i");
            filter.$or = [
                { fullName: searchRegex },
                { email: searchRegex },
                { phone: searchRegex },
                { 'staffId.fullName': searchRegex }, 
                { 'staffId.userId': searchRegex } 
            ];
        }
        if (body.status) {
            filter.status = body.status;
        }
        if (body.staffStatus) {
            filter['staffId.status'] = body.staffStatus;
        }
        if (body.storeId) {
            filter.storeId = body.storeId;
        }
        if (body.industryType) {
            filter.industryType = body.industryType;
        }
        if (body.startDate || body.endDate) {
            filter.createdAt = {};
            if (body.startDate) {
                filter.createdAt.$gte = new Date(body.startDate);
            }
            if (body.endDate) {
                filter.createdAt.$lte = new Date(body.endDate);
            }
        }
        const sortOptions = {};
        if (body.sortBy) {
            switch (body.sortBy) {
                case 'registeredOn':
                    sortOptions['staffId.createdAt'] = body.sortOrder === 'asc' ? 1 : -1;
                    break;
                case 'approvalAt':
                    sortOptions['staffId.approvalAt'] = body.sortOrder === 'asc' ? 1 : -1;
                    break;
                case 'name':
                    sortOptions['staffId.fullName'] = body.sortOrder === 'asc' ? 1 : -1;
                    break;
                default:
                    sortOptions.createdAt = body.sortOrder === 'asc' ? 1 : -1;
            }
        } else {
            sortOptions.createdAt = -1;
        }
        const page = Math.max(parseInt(body.page) || 1, 1);
        const limit = Math.max(parseInt(body.limit) || 10, 1);
        const skip = (page - 1) * limit;
        const staffs = await ApprovalRequest.find(filter)
            .sort(sortOptions)
            .skip(skip)
            .limit(limit)
            .populate([
                { 
                    path: 'staffId',
                    match: body.staffStatus ? { status: body.staffStatus } : {}
                },
                { path: 'storeId', select: '_id storeName' },
                { path: 'industryType', select: '_id name' },
                { path: 'tagsId', select: '_id name' }
            ])
            .lean();
        const staffList = await Promise.all(
            staffs.map(async (staff) => {
                if (!staff.staffId) return null; 
                
                const approver = staff?.staffId?.approvalBy
                    ? await approvedByDetails(staff.staffId.approvalBy)
                    : null;
                return {
                    staffName: staff.staffId.fullName,
                    profileImage: staff.staffId.profileImage
                        ? s3Url + staff.staffId.profileImage
                        : null,
                    staffId: staff.staffId._id,
                    staffNo: staff.staffId.userId,
                    email: staff.staffId.email,
                    phone: staff.staffId.phone,
                    industryType: staff.industryType,
                    dob: staff.staffId.dob,
                    id: staff._id,
                    storeName: staff.storeId,
                    merchantID: staff.staffId._id,
                    tags: staff.tagsId,
                    accountNumber: staff.staffId.accountNumber,
                    bankName: staff.staffId.bankName,
                    branch: staff.staffId.branch,
                    ifscCode: staff.staffId.ifscCode,
                    registeredOn: staff.staffId.createdAt,
                    approvalBy: approver,
                    status: staff.staffId.status || 0,
                    approvalAt: staff.staffId.approvalAt,
                    accountCreatedBy: staff.staffId.addedBy,
                    reason: staff.staffId.reason || null,
                    modifications: false
                };
            })
        );
        const filteredStaffList = staffList.filter(staff => staff !== null);

        const totalMerchants = await ApprovalRequest.countDocuments(filter);

        return {
            status: true,
            message: "Merchant List",
            statusCode: 200,
            data: {
                total: totalMerchants,
                currentPage: page,
                totalPages: Math.ceil(totalMerchants / limit),
                data: filteredStaffList
            }
        };
    } catch (error) {
        console.error("Error in staffList:", error);
        return returnError(error);
    }
};

exports.staffDetails = async (body) => {
    try {
        if (!body || !body.staffId) {
            return {
                status: false,
                message: "Staff ID is required",
                statusCode: 400,
                data: null
            };
        }
        const requestId = body.staffId;
        const staffs = await ApprovalRequest.findOne({ staffId: requestId })
            .populate('staffId')
            .populate('storeId', '_id storeName')
            .populate('industryType', '_id name')
            .populate({
                path: 'tagsId',
                select: '_id name'
            })
            .lean();
        if (!staffs) {
            return {
                status: false,
                message: "Staff not found",
                statusCode: 404,
                data: null
            };
        }

        if (!staffs.staffId) {
            return {
                status: false,
                message: "Staff details not found",
                statusCode: 404,
                data: null
            };
        }
        const approverPromise = approvedByDetails(staffs.staffId.approvalBy);
        const merchantData = {
            staffName: staffs?.staffId?.fullName,
            profileImage: staffs?.staffId?.profileImage ? s3Url + staffs?.staffId?.profileImage : null,
            staffId: staffs?.staffId?._id,
            staffNo: staffs?.staffId?.userId,
            email: staffs?.staffId?.email,
            phone: staffs?.staffId?.phone,
            industryType: staffs?.industryType,
            dob: staffs?.staffId?.dob,
            id: staffs?._id,
            storeName: staffs?.storeId,
            merchantID: staffs?.staffId?._id,
            tags: staffs?.tagsId,
            accountNumber: staffs?.staffId?.accountNumber,
            bankName: staffs?.staffId?.bankName,
            branch: staffs?.staffId?.branch,
            ifscCode: staffs?.staffId?.ifscCode,
            registeredOn: staffs?.staffs?.createdAt,
            approvalBy: await approverPromise,
            approvalAt: staffs.staffId?.approvalAt,
            accountCreatedBy: staffs?.staffId?.addedBy,
            reason: staffs?.staffId?.reason || null,
            modifications: false,
            status: staffs.staffId.status || 0,
        };

        return {
            status: true,
            message: "Merchant Details",
            statusCode: 200,
            data: merchantData
        };

    } catch (error) {
        console.error("Error in staffDetails:", error);
        return returnError(error);
    }
};
exports.approveAndRejected = async (body) => {
    try {
        const { status, staffId, reason, userId } = body;
        if (!mongoose.Types.ObjectId.isValid(staffId)) {
            return { status: false, message: "Invalid Staff ID", statusCode: 400 };
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
            approvalAt: status === 1 ? new Date() : new Date(),
            approvalBy: userId,
            reason: status === 2 || status === 1 ? reason : undefined
        };
       
        const updatedUser = await User.findByIdAndUpdate(
            staffId,
            { $set: updateData },
            { new: true }
        );

        if (!updatedUser) {
            return { status: false, message: "Staff not found", statusCode: 404 };
        }

        return {
            status: true,
            message: "Staff details updated successfully",
            statusCode: 200,
            data: updatedUser
        };
    } catch (error) {
        console.error(error);
        return returnError(error)
    }
};
exports.deleteStaff = async (body) => {
    try {
        const { staffId } = body;
        if (!mongoose.Types.ObjectId.isValid(staffId)) {
            return {
                status: false,
                message: "Invalid Staff ID",
                statusCode: 400
            };
        }
        const deletedStaff = await User.findByIdAndDelete(staffId);
        
        if (!deletedStaff) {
            return {
                status: false,
                message: "Staff not found",
                statusCode: 404
            };
        }
        ApprovalRequest.deleteMany({ staffId }).catch(console.error);

        return {
            status: true,
            message: "Staff deleted successfully",
            statusCode: 200,
            data: {
                _id: deletedStaff._id,
                name: deletedStaff.fullName,
                email: deletedStaff.email
            }
        };
    } catch (error) {
        console.error("Error in deleteStaff:", error);
        return returnError(error);
    }
};

exports.staffUpdate = async (body) => {
    try {
        // Validate staffID exists in the body
        if (!body?.staffId) {
            return {
                status: false,
                message: "Staff ID is required",
                statusCode: 400,
                data: {}
            };
        }

        const staff = await User.findOne({ _id: body.staffId });
        if (!staff) {
            return {
                status: false,
                message: "Staff not found",
                statusCode: 404,
                data: {}
            };
        }

        // Prepare staff data for update\
        delete body?.phone;
        delete body?.email;
        const staffData = {
            ...body,
            bankAccountDetails: {
                accountNumber: body.accountNumber || null,
                bankName: body.bankName || null,
                ifscCode: body.ifscCode || null,
                branch: body.branch || null,
            },
        };

        // Update user
        const updatedUser = await User.findByIdAndUpdate(
            body.staffId,  // No need for { _id: } object here
            { $set: staffData },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return {
                status: false,
                message: "Failed to update staff",
                statusCode: 500
            };
        }

        // Handle store and merchant logic
        let storeId = "680687aaabebf48846bebf22";
        let merchantId = "6805144f51baae0ad5db8fc6";

        if (body?.storeId && body.storeId.trim() !== '') {
            const store = await Store.findOne({ _id: body.storeId }).lean();

            if (store) {
                storeId = store._id;
                if (store.merchant) {
                    const merchant = await Merchant.findById(store.merchant).lean();
                    merchantId = merchant?._id || merchantId;
                }
            }
        }
        const staffDetails = {
            tagsId: body?.tags,
            staffId: body.staffId,
            industryType: body?.industryType,
            storeId: storeId,
            merchantId: merchantId,
        };


        // Update approval request - fixed this line which was incorrect
        const updatedRequest = await ApprovalRequest.findOneAndUpdate(
            { staffId: staffDetails.staffId },  // Query by staffId
            { $set: staffDetails },            // Update data
            {
                new: true,                       // Return the updated document
                runValidators: true,             // Run schema validators
                populate: [                      // Optionally populate references
                    'staffId',
                    'merchantId',
                    'storeId',
                    'industryType',
                    'tagsId'
                ]
            }
        );
        console.log(updatedRequest)

        return {
            status: true,
            message: "Staff updated successfully",
            statusCode: 200,
            data: updatedUser
        };

    } catch (error) {
        console.error("Error in staffUpdate:", error);
        return returnError(error);
    }
};