const mongoose = require("mongoose");
const { Schema } = mongoose;
const s3Url = process.env.AWS_S3_URL;
const rewardSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["store", "field"],
    required: true,
  },
  rank: {
    type: String, 
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    default: null,
    set: function(value) {
      if (value && value.startsWith(s3Url)) {
        return value.replace(s3Url, '');
      }
      return value;
    }
  },
  rewardPoints: {
    todayTop: { type: Number, default: 0.0 },
    weeklyTop: { type: Number, default: 0.0 },
    monthlyTop: { type: Number, default: 0.0 },
  },
  categoryId: { 
    type: Schema.Types.ObjectId, 
    ref: "Industry", 
    required: true 
  },
}, { timestamps: true });

module.exports = mongoose.model("Reward", rewardSchema);
