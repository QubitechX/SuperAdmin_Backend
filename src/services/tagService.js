
const Merchant = require('../models/Merchant');
const mongoose = require("mongoose");
const { create, find, findOneAndDelete, findOneAndUpdate } = require("../queries/adminQueries");
const Tag = require('../models/Tag');
const User = require('../models/User');
const { returnError } = require("../config/helpers");

exports.addTag = async (body) => {
  try {
    const { tags, industryId } = body;

    const industries = industryId
      ? industryId.map(id => new mongoose.Types.ObjectId(id))
      : [];

    const newTag = await Tag.create({
      name: tags,
      industryId: industries,
    });

    return {
      status: true,
      message: "Tag created successfully",
      statusCode: 200,
      data: newTag
    };
  } catch (error) {
    console.error("Error creating tag:", error);
    return returnError(error);
  }
};
exports.tagsList = async (body) => {
  try {
    const {
      industryId,
      tagId,
      search,
      page = 1,
      limit = 10,
      dataTypeAll = false
    } = body;

    const filter = {};

    // Filter by industry ID(s)
    if (industryId) {
      filter.industryId = Array.isArray(industryId)
        ? { $in: industryId.map(id => new mongoose.Types.ObjectId(id)) }
        : new mongoose.Types.ObjectId(industryId);
    }

    // Filter by specific tag ID
    if (tagId) {
      filter._id = new mongoose.Types.ObjectId(tagId);
    }

    // Search by name
    if (search?.trim()) {
      filter.name = { $regex: search.trim(), $options: 'i' };
    }

    const skip = (page - 1) * limit;
    let query = Tag.find(filter)
      .populate('industryId', 'name _id')
      .sort({ createdAt: -1 });

    if (!dataTypeAll) {
      query = query.skip(skip).limit(limit);
    }

    const [tags, total] = await Promise.all([
      query.lean(),
      Tag.countDocuments(filter)
    ]);

    // Get user counts for each tag
    const tagsWithUserCount = await Promise.all(
      tags.map(async (tag) => {
        const userCount = await User.countDocuments({ tags: tag._id });
        return {
          ...tag,
          userCount
        };
      })
    );

    return {
      status: true,
      message: "Tags list retrieved successfully",
      statusCode: 200,
      data: {
        tags: tagsWithUserCount,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      }
    };
  } catch (error) {
    console.error("Error fetching tags list:", error);
    return returnError(error);
  }
};

exports.deleteTag = async (body) => {
  try {
    const { tagID } = body;
    if (!mongoose.Types.ObjectId.isValid(tagID)) {
      return { status: false, message: "Invalid ID", statusCode: 400 };
    }
    const deletedTag = await findOneAndDelete(Tag, { _id: tagID },);
    if (deletedTag.status) {
      return { status: true, message: "Data deleted", statusCode: 200, data: deletedTag?.message };
    }
    else {
      return returnError(error)
    }
  } catch (error) {
    console.error(error);
    return returnError(error)
  }
};

exports.tagUpdate = async (body) => {
  try {
    const tagID = body?.tagId;
    const tag = await Tag.findOne({ _id: tagID });
    if (!tag) {
      return { status: false, message: "Tag not found", statusCode: 400, data: {}, };
    }
    const updatedTag = await findOneAndUpdate(Tag, { _id: tagID }, body);
    if (!updatedTag) {
      return { status: false, message: "Merchant not found", statusCode: 404 };
    }
    return {
      status: true,
      message: "Merchant details updated successfully",
      statusCode: 200,
      data: updatedTag
    };
  } catch (error) {
    console.error(error);
    return returnError(error)
  }
}
