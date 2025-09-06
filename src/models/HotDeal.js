const mongoose = require("mongoose");
const { Schema } = mongoose;
const s3Url = process.env.AWS_S3_URL;

const HotDealSchema = new Schema({
  type: {
    type: String,
    required: true,
    enum: ['Hot Deals', 'What Are You Looking For', 'other'],
    default: 'Hot Deals'
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  startingDate: {
    type: Date,
    required: true
  },
  endingDate: {
    type: Date,
    required: true,
  },
  shortDescription: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
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
  categoryId: { 
    type: Schema.Types.ObjectId, 
    ref: "Industry", 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
}, {
  toJSON: { virtuals: true }, 
  toObject: { virtuals: true } 
});

HotDealSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});
HotDealSchema.virtual('fullImageUrl').get(function() {
  if (this.imageUrl) {
    if (this.imageUrl.startsWith('http')) {
      return this.imageUrl;
    }
    return `${s3Url}${this.imageUrl}`;
  }
  return null;
});
HotDealSchema.index({ categoryId: 1 });
HotDealSchema.index({ startingDate: 1 });
HotDealSchema.index({ endingDate: 1 });

const HotDeal = mongoose.model('HotDeal', HotDealSchema);

module.exports = HotDeal;