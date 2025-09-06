const mongoose = require('mongoose');
const TicketSchema = new mongoose.Schema({
    ticketId: { type: String, unique: true, default: null },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    subject: { type: String, required: true },
    // Merchants,Staff,Users
    userType: { type: String, default: null, },
    description: { type: String, default: null },
    status: { type: String, enum: ["open", "close-ticket-progress", "closed"], default: "open" },
  },{ timestamps: true });
  const Ticket = mongoose.model("Ticket", TicketSchema);

  module.exports = Ticket;