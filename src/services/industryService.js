
const Merchant = require('../models/Merchant');
const mongoose = require("mongoose");
const { create, find, findOneAndDelete, findOneAndUpdate } = require("../queries/adminQueries");
const Industry = require('../models/Industry');
const User = require('../models/User');
const { returnError } = require("../config/helpers");
exports.addIndustry = async (body) => {
    try {
        await create(Industry, body);
        return { status: true, message: "Saved Data ", statusCode: 200, data: {} };
    } catch (error) {
        console.log(error);
        return returnError(error);
    }
};
exports.industryList = async (body) => {
    try {
        const { 
            industryId, 
            categoryId,  // Fixed typo from categoryID to categoryId
            search, 
            page = 1, 
            limit = 10,
            dataTypeAll = false 
        } = body;

        const filter = {};

        // Filter by industry ID
        if (industryId) {
            filter._id = industryId;
        }

        // Filter by category
        if (categoryId) {
            filter.category = categoryId;
        }

        // Search by name (case-insensitive)
        if (search?.trim()) {
            filter.name = { $regex: search.trim(), $options: 'i' };
        }

        const skip = (page - 1) * limit;
        
        // Base query
        let query = Industry.find(filter)
            .select('_id name icon iconBg iconBanner tags createdAt')
            .sort({ createdAt: -1 });

        // Apply pagination only if dataTypeAll is false
        if (!dataTypeAll) {
            query = query.skip(skip).limit(limit);
        }

        const [industries, total] = await Promise.all([
            query.lean(),
            Industry.countDocuments(filter)
        ]);

        // Add user count to each industry
        const enrichedIndustries = await Promise.all(
            industries.map(async (industry) => {
                const userCount = await User.countDocuments({ industry_id: industry._id });
                return {
                    ...industry,
                    userCount,
                };
            })
        );

        return {
            status: true,
            message: "Industries List",
            statusCode: 200,
            data: {
                list: enrichedIndustries,
                pagination: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit),
                }
            },
        };
    } catch (error) {
        console.error("Error in industryList:", error);
        return returnError(error);
    }
};


exports.deleteIndustry = async (body) => {
    try {
        const { industryId } = body;

        if (!mongoose.Types.ObjectId.isValid(industryId)) {
            return { status: false, message: "Invalid ID", statusCode: 400 };
        }

        const industry = await Industry.findByIdAndDelete({ _id:industryId });

        if (industry) {
            return { status: true, message: "Data deleted", statusCode: 200, data: {} };
        } else {
            return { status: false, message: "Industry not found", statusCode: 404 };
        }

    } catch (error) {
        console.error(error);
        return returnError(error);
    }
};

exports.industryUpdate = async (body) => {
    try {
        const industryID = body?.industryId;
        const industry = await Industry.findByIdAndUpdate(industryID, body, { new: true });
        if (!industry) {
            return { status: false, message: "Tag not found", statusCode: 400, data: {}, };
        }
        return {
            status: true,
            message: "Industry updated",
            statusCode: 200,
            data: industry
        };
    } catch (error) {
        console.error(error);
        return returnError(error)
    }
}
