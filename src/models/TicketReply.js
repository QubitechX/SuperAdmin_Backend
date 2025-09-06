const mongoose = require("mongoose");
const TicketReplySchema = new mongoose.Schema(
    {
        ticketId: {type: mongoose.Schema.Types.ObjectId,ref: "Ticket",required: true},
        replyFrom: {type: String,enum: ["User", "Admin"],required: true},
        description: {type: String,required: true,trim: true}
    },
    { timestamps: true }
);

module.exports = mongoose.model("TicketReply", TicketReplySchema);
