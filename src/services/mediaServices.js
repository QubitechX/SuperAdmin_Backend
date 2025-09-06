const Media = require('../models/Media');
exports.listAllMedia = async (req, res) => {
  try {
    const page = parseInt(req?.query?.page) || 1;
    const limit = parseInt(req?.query?.limit) || 10;
    const skip = (page - 1) * limit;
    const filter = { deletedAt: null };
    const [total, mediaFiles] = await Promise.all([
      Media.countDocuments(filter),
      Media.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('_id url originalName mimeType')
    ]);
    return {
      status: true,
      statusCode: 200,
      message: "Media Datas.",
      data: {
        mediaFiles: mediaFiles.map(file => ({
          id: file._id,
          url: `${process.env.AWS_S3_URL}/${file.url}`,
          name: file.originalName,
          type: file.mimeType
        })),
        totalItems: total,
        currentPage: page,
        itemsPerPage: limit,
        totalPages: Math.ceil(total / limit)
      }
    };

  } catch (error) {
    console.error("Error listing media files:", error);

    if (error.name === 'CastError') {
      return {
        status: false,
        statusCode: 400,
        message: "Invalid query parameters",
        data: {}
      };

    }
    return {
      status: false,
      statusCode: 500,
      message: "Failed to retrieve media files",
      data: {}
    };
  }
};
exports.softDeleteMultiple = async ({mediaIds}) => {
  try {
    if (!mediaIds || !Array.isArray(mediaIds) || mediaIds.length === 0) {
      return res.status(400).json({
        status: false,
        statusCode: 400,
        message: "Please provide an array of valid media IDs",
        data: {}
      });
    }
    const mediaItems = await Media.find({
      _id: { $in: mediaIds }
    });
    console.log(mediaItems, ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
    if (mediaItems.length === 0) {
      return {
        status: false,
        statusCode: 404,
        message: "No media found with the provided IDs.",
        data: {}
      };
    }
    const result = await Media.updateMany(
      { _id: { $in: mediaIds } },
      { $set: { deletedAt: new Date() } }
    );

    return {
      status: true,
      statusCode: 200,
      message: "Selected media items deleted successfully.",
      data: {
        modifiedCount: result.modifiedCount
      }
    };
  } catch (error) {
    console.error("Error during multiple soft delete:", error);
    return {
      status: false,
      statusCode: 500,
      message: "Something went wrong during media deletion.",
      data: {}
    };
  }
};
