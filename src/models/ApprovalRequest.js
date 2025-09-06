const mongoose = require('mongoose');

const ApprovalRequestSchema = new mongoose.Schema({
  staffId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  merchantId: { type: mongoose.Schema.Types.ObjectId, ref: "Merchant", required: true },
  storeId: { type: mongoose.Schema.Types.ObjectId, ref: "Store", required: true },
  industryType: { type: mongoose.Schema.Types.ObjectId, ref: "Industry", required: true },
  tagsId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tag",
    }
  ],
  comment: { type: String, default: null },
  status: { type: String, enum: ["Pending", "Rejected", "Approved"], default: "Pending" },
  linkedAt: { type: Date, default: null }
}, { timestamps: true });

const ApprovalRequest = mongoose.model("ApprovalRequest", ApprovalRequestSchema);

module.exports = ApprovalRequest;
