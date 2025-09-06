const {ticketList,ticketReply,closeTicketRequest,ticketReplyHistory} = require("../services/ticketService");
const { response } = require("../config/helpers");
exports.ticketList = async (req,res) => {
    //createTicket("65e7c1a4f9a7e8d3b45b9a12", "65e7c1a4f9a7e8d3b45b9b23", "Payment Issue");
    const tl = await ticketList(req.body);;
    if (tl.status) {
        return response(res, req, tl?.statusCode, true, tl?.message, tl?.data);
    } else {
        return response(res, req, tl?.statusCode, false, tl?.message, {});
    }
};
exports.ticketReply = async (req,res) => {
    const tr = await ticketReply(req.body);;
    if (tr.status) {
        return response(res, req, tr?.statusCode, true, tr?.message, tr?.data);
    } else {
        return response(res, req, tr?.statusCode, false, tr?.message, {});
    }
};
exports.ticketReplyHistory = async (req,res) => {
    const tr = await ticketReplyHistory(req.body);;
    if (tr.status) {
        return response(res, req, tr?.statusCode, true, tr?.message, tr?.data);
    } else {
        return response(res, req, tr?.statusCode, false, tr?.message, {});
    }
};

exports.closeTicketRequest = async (req,res) => {
    const ctr = await closeTicketRequest(req.body);;
    if (ctr.status) {
        return response(res, req, ctr?.statusCode, true, ctr?.message, ctr?.data);
    } else {
        return response(res, req, ctr?.statusCode, false, ctr?.message, {});
    }
};

