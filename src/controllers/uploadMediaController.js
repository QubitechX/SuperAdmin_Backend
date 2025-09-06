const AWS = require("aws-sdk");
const dotenv = require("dotenv");
const Media = require('../models/Media');
const {softDeleteMultiple,listAllMedia} = require('../services/mediaServices');
const { response } = require("../config/helpers");
dotenv.config();
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});
const s3 = new AWS.S3();
// Allowed MIME types for images and videos
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "video/mp4",
  "video/mpeg",
  "video/quicktime", // .mov files
];

exports.uploadMultipleMedia = async (req, res, next) => {
  try {

    console.log('Access Key:', process.env.AWS_ACCESS_KEY_ID);
    console.log('Secret Key:', process.env.AWS_SECRET_ACCESS_KEY);
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, error: "No files uploaded" });
    }
    const uploadedUrls = [];

    for (const file of req.files) {
      //   // Validate file type
      if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
        return res.status(400).json({ success: false, error: "Only images and videos are allowed" });
      }

      const fileName = `${Date.now()}_${file.originalname}`;
      const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype
      };
      const respons = await s3.upload(params).promise();
      const media = new Media({
        url: `${respons.Bucket}/${respons.Key}`,
        key: respons.Key,
        type: file.mimetype,
        originalName: file.originalname,
        size: file.size,
        uploadedBy: req.user?._id || null
      });
      const saved = await media.save();
      uploadedUrls.push(saved);
    }

    res.json({
      success: true,
      message: "Files uploaded successfully",
      urls: uploadedUrls
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Failed to upload files" });
  }
};
exports.listAllMedia = async (req,res) => {
    const tr = await listAllMedia(req.body);;
    if (tr.status) {
        return response(res, req, tr?.statusCode, true, tr?.message, tr?.data);
    } else {
        return response(res, req, tr?.statusCode, false, tr?.message, {});
    }
};
exports.softDeleteMultiple = async (req,res) => {
    const tr = await softDeleteMultiple(req.body);;
    if (tr.status) {
        return response(res, req, tr?.statusCode, true, tr?.message, tr?.data);
    } else {
        return response(res, req, tr?.statusCode, false, tr?.message, {});
    }
};
// exports.softDeleteMultiple = async (mediaIds) => {
//   try {
     
//       const mediaItems = await Media.findAll({
//           where: {
//               id: mediaIds
//           }
//       });

     
//       if (mediaItems.length === 0) {
//           return {
//               status: false,
//               statusCode: 404,
//               message: "No media found with the provided IDs.",
//               data: {}
//           };
//       }
//       await Media.destroy({ where: { id: mediaIds } });
//       return {
//           status: true,
//           statusCode: 200,
//           message: "Selected media items soft deleted successfully.",
//           data: {}
//       };
//   } catch (error) {
//       console.error("Error during multiple soft delete:", error);
//       return {
//           status: false,
//           statusCode: 500,
//           message: "Something went wrong during media deletion.",
//           data: {}
//       };
//   }
// };
