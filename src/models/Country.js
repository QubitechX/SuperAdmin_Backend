const mongoose = require('mongoose');
const { Schema } = mongoose;

const countrySchema = new Schema({
  _id: {
    type: Number,
    required: true,
    unique: true
  },
  shortname: {
    type: String,
    required: true,
    uppercase: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  phonecode: {
    type: String,
    required: true,
    trim: true,
  },
  
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});
// countrySchema.index({ shortname: 1 }, { unique: true });
// countrySchema.index({ name: 1 }, { unique: true });
// countrySchema.index({ phonecode: 1 });

const Country = mongoose.model('Country', countrySchema);

module.exports = Country;