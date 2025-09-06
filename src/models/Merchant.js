const mongoose = require('mongoose');

const MerchantSchema = new mongoose.Schema({
  merchantName: {
    type: String,
    required: true
  },
  merchantID: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  profileImage: {
    type: String,
    default: null
  },
  contactNumber: {
    type: String,
    required: true
  },
  businessType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Industry",
    required: true
  },
 
  location: {
    type: String,
    required: true
  },
  timings: {
    openingTime: {
      type: String
    },
    closingTime: {
      type: String
    }
  },
  averageCostForTwo: {
    type: Number
  },
  tags: [{
    type: String
  }],
  popularDishes: [{
    type: String
  }],
  googleMapDirection: {
    type: String
  },
  facilities: [{
    type: String
  }],
  menuPhotos: {
    type: [String],
    default: []
  },
  imageGallery: {
    type: [String],
    default: []
  },
  documents: {
    type: [String],
    default: []
  },
  reason: {
    type: String
  },
  city: {
    type: String
  },
  // Status: 0 = Pending, 1 = Approved, 2 = Rejected
  status: {
    type: Number,
    enum: [0, 1, 2],
    default: 0
  },
  bankAccountDetails: {
    accountNumber: {
      type: String
    },
    bankName: {
      type: String
    },
    branch: {
      type: String
    },
    ifscCode: {
      type: String
    }
  },
  approvalAt: {
    type: Date,
    default: null
  },
  addedBy: {
    type: String,
    default: 'User'
  },
  approvalBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    default: null
  },
  deletedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

const Merchant = mongoose.model('Merchant', MerchantSchema);

module.exports = Merchant;
