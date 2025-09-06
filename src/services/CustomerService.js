
const customer = require('../models/User');
const mongoose = require("mongoose");
const { returnError, staffNextUserID, approvedByDetails } = require("../config/helpers");
const User = require('../models/User');
const dal = require("../queries/adminQueries");
const Store = require('../models/Store');
const s3Url = process.env.AWS_S3_URL

exports.customerList = async (body) => {
    try {
        const filter = {roles:'user'};
        if (body.search) {
            const searchRegex = new RegExp(body.search, "i");
            filter.$or = [
                { fullName: searchRegex },
                { email: searchRegex },
                { phone: searchRegex },
            ];
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
        const users = await User.find(filter)
            .sort(sortOptions)
            .skip(skip)
            .limit(limit)
            .lean();

        const userList = await Promise.all(
            users.map(async (user) => {
                
                return {
                    userName: user.fullName,
                    profileImage: user.profileImage
                        ? s3Url + user.profileImage
                        : null,
                    userId: user._id,
                    userNo: user.userId,
                    email: user.email,
                    phone: user.phone,
                    dob: user.dob,
                    id: user._id,
                    roles: user.roles,
                    accountCreatedBy: user.addedBy,
                };
            })
        );
        const filteredUserList = userList.filter(user => user !== null);

        const totalMerchants = await User.countDocuments(filter);

        return {
            status: true,
            message: "Merchant List",
            statusCode: 200,
            data: {
                total: totalMerchants,
                currentPage: page,
                totalPages: Math.ceil(totalMerchants / limit),
                data: filteredUserList
            }
        };
    } catch (error) {
        console.error("Error in staffList:", error);
        return returnError(error);
    }
};
