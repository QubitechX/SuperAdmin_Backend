
const Merchant = require('../models/Merchant');
const mongoose = require("mongoose");
const { create, find, findOneAndDelete, findOneAndUpdate } = require("../queries/adminQueries");
const Category = require('../models/Category');
const { returnError } = require("../config/helpers");
const User = require('../models/User');
exports.addCategory = async (body) => {
    try {
        const { name, industryId, description } = body;

        if (!name) throw new Error('Category name is required');

        if (industryId && !Array.isArray(industryId)) {
            throw new Error('Industry IDs must be an array');
        }
        const industries = industryId ? industryId.map(id => new mongoose.Types.ObjectId(id)) : [];

        const newCategory = new Category({
            name,
            description,
            industryId: industries,
        });

        await newCategory.save();

        return {
            status: true,
            message: "Category saved successfully",
            data: newCategory
        };
    } catch (error) {
        return returnError(error);
    }
};

exports.categoriesList = async (body) => {
    try {
        const { 
            status, 
            industryId, 
            categoryId, 
            search, 
            page = 1, 
            limit = 10,
            dataTypeAll = false 
        } = body;
        
        const filter = {};

        if (status) filter.status = status;
        if (categoryId) filter._id = categoryId;
        if (industryId) {
            filter.industryId = Array.isArray(industryId) 
                ? { $in: industryId } 
                : industryId;
        }
        if (search?.trim()) {
            filter.name = { $regex: search.trim(), $options: 'i' };
        }

        const skip = (page - 1) * limit;
        
        // Base query
        let query = Category.find(filter)
            .populate('industryId', 'name _id')
            .sort({ createdAt: -1 });

        // Apply pagination only if dataTypeAll is false
        if (!dataTypeAll) {
            query = query.skip(skip).limit(limit);
        }

        const [categories, total] = await Promise.all([
            query.lean(),
            Category.countDocuments(filter),
        ]);

        const categoryList = await Promise.all(
            categories.map(async (cat) => {
                const userCount = await User.countDocuments({ category: cat._id });
                return {
                    ...cat,
                    userCount,
                };
            })
        );

        return {
            status: true,
            message: "Category List",
            statusCode: 200,
            data: {
                categories: categoryList,
                pagination: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit),
                },
            },
        };
    } catch (error) {
        console.error("Error in categoriesList:", error);
        return returnError(error);
    }
};
exports.deleteCategory = async (body) => {
    try {
        const { categoryID } = body;
        if (!mongoose.Types.ObjectId.isValid(categoryID)) {
            return { status: false, message: "Invalid ID", statusCode: 400 };
        }
        const deletedCategory = await findOneAndDelete(Category, { _id: categoryID },);
        if (!deletedCategory) {
            return { status: false, message: "Data not found", statusCode: 404, data: {} };
        }

        if (deletedCategory.status) {
            return { status: true, message: "Data deleted", statusCode: 200, data: deletedCategory?.message };
        }
        else {
            return returnError(error)
        }

    } catch (error) {
        console.error(error);
        return returnError(error)
    }
};
exports.categoryUpdate = async (body) => {
    try {
        const categoryID = body?.categoryId;
        const categoryData = await Category.findOne({ _id: categoryID });
        if (!categoryData) {
            return { status: false, message: "Category not found", statusCode: 400, data: {}, };
        }
        const updatedCategory = await findOneAndUpdate(Category, { _id: categoryID }, body);
        if (!updatedCategory) {
            return { status: false, message: "Category not found", statusCode: 404 };
        }
        return {
            status: true,
            message: "Category updated",
            statusCode: 200,
            data: updatedCategory
        };
    } catch (error) {
        console.error(error);
        return returnError(error)
    }
}
