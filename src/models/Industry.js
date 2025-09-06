const mongoose = require('mongoose');

const IndustrySchema = new mongoose.Schema({
  name: { type: String, required: true },
  icon: { type: String, default: null },
  iconBg: { type: String, default: null },
  iconBanner: { type: String, default: null },
}, { timestamps: true });

const Industry = mongoose.model('Industry', IndustrySchema);
module.exports = Industry;
