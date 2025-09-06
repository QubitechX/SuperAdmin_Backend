const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
 url: {
  type: String,
  required: true
 },
 key: {
  type: String,
  required: true
 },
 type: {
  type: String, // e.g. "image/jpeg", "video/mp4"
  required: true
 },
 originalName: {
  type: String
 },
 size: {
  type: Number // in bytes
 },
 uploadedBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User',
  default: null
 },
 createdAt: {
  type: Date,
  default: Date.now
 },
 deletedAt: {
    type: Date,
    default: null
  }
});

module.exports = mongoose.model('Media', mediaSchema);
