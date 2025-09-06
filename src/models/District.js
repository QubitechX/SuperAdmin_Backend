const mongoose = require('mongoose');

const DistrictSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  city_id: {
    type: Number,
    required: true,
  },
  status: {  
    type: Number,
    required: true,
    default: 0,
    min: 0,
    max: 1  // Example: 0=inactive, 1=active
  }
}, {
  timestamps: true
});

DistrictSchema.index({ city_id: 1 });
DistrictSchema.index({ name: 1 });

module.exports = mongoose.model('District', DistrictSchema);