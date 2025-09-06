const multer = require('multer');
const path = require('path');
const AWS = require("aws-sdk");
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "video/mp4",
  "video/mpeg",
  "video/quicktime", // .mov files
];
exports.upload = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({success:false, error: "No file uploaded" });
    }

    // Validate file type
    if (!ALLOWED_MIME_TYPES.includes(req.file.mimetype)) {
      return res.status(400).json({ error: "Only images and videos are allowed" });
    }

    const fileName = `${Date.now()}_${req.file.originalname}`;
    const uploadParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: fileName,
      Body: req.file.buffer,
      ContentType: req.file.mimetype
    };

    const data = await s3.upload(uploadParams).promise();
    return data;
    //res.json({ success:true,message:"image uploaded successfully",url: data.Location });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success:false,error: "Failed to upload file" });
  }
};
