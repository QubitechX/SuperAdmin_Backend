const Ticket = require("../models/Ticket");
const TicketReply = require("../models/TicketReply");
const { returnError } = require("../config/helpers");
const User = require("../models/User");
adminUrl=process.env.BASE_URL;
exports.ticketList = async (data) => {
  try {
    const page = parseInt(data.page) || 1;
    const limit = parseInt(data.limit) || 10;
    const skip = (page - 1) * limit;
    let userType=data.userType|| "Merchants"
    const projection = "ticketId categoryId userId subject description status createdAt";
    const sort = { createdAt: -1 };
    const tickets = await Ticket.find({userType:userType}, projection, {
      skip: skip || 0,
      limit: limit || 10,
      sort: sort || { createdAt: -1 }
    })
      .populate({ path: "categoryId", select: "name" })
      .populate({ path: "userId", select: "user_name phone_no" })
      .select("-__v -updatedAt");
    const ticketList = tickets.map(ticket => ({
      _id: ticket._id,
      ticketId: ticket.ticketId,
      categoryName: ticket.categoryId ? ticket.categoryId.name : null,
      userName: ticket.userId ? ticket.userId.user_name : null,
      userPhone: ticket.userId ? ticket.userId.phone_no : null,
      subject: ticket.subject,
      description: ticket.description,
      status: ticket.status,
      createdAt: ticket.createdAt
    }));
    return { status: true, message: "Ticket List ", statusCode: 200, data: ticketList };
  } catch (error) {
    return returnError(error)
  }
};

exports.ticketReply = async (data) => {
  try {
    const { ticketId, description } = data;
    const checkData = await Ticket.findOne({ _id: ticketId });
    if (!checkData) {
      return { status: false, message: "Ticket not found", statusCode: 400, data: {} };
    }
    if (checkData?.status == "closed") {
      return { status: false, message: "Ticket Closed", statusCode: 400, data: {} };
    }
    const ticketReply = await TicketReply.create({
      ticketId,
      userId: "67c09ae46763540f2ec96efe",
      replyFrom: "Admin",
      description
    });
    return { status: true, message: "Reply added", statusCode: 200, data: ticketReply };
  } catch (error) {
    console.error(error);
    return returnError(error)
  }
};
exports.ticketReplyHistory = async (data) => {
  try {
    const { ticketId } = data;
    const checkData = await Ticket.findOne({ _id: ticketId });
    if (!checkData) {
      return { status: false, message: "Ticket not found", statusCode: 400, data: {} };
    }
    const replydata = await TicketReply.find({ ticketId: ticketId })
      .select("-updatedAt -__v -ticketId");
    const ticketList = await Promise.all(
      replydata.map(async (replyTicket) => {
        let userData=replyTicket.replyFrom=="Admin"?await getUserData("67c09ae46763540f2ec96efe") : await getUserData(checkData?.userId);
        let userProfile=`${adminUrl}${userData?.profileImage?userData?.profileImage:"uploads/noUser.jpg"}`
        return {
          _id: replyTicket?._id,
          description:replyTicket?.description,
          createdAt: replyTicket?.createdAt,
          replyFrom:replyTicket?.replyFrom,
          userName:userData?.user_name,
          userProfile:userProfile
        };
      })
    );
    
    return { status: true, message: "Reply list", statusCode: 200, data: ticketList };
  } catch (error) {
    console.error(error);
    return returnError(error)
  }
};
exports.closeTicketRequest = async (data) => {
  try {
    const { ticketId } = data;
    const checkData = await Ticket.findOne({ _id: ticketId, status: "open" });
    if (!checkData) {
      return { status: false, message: "Ticket not found", statusCode: 400, data: {} };
    }
    await Ticket.updateOne({ _id: ticketId }, { status: "close-ticket-progress" });

    return { status: true, message: "Ticket request send", statusCode: 200, data: {} };
  } catch (error) {
    console.error(error);
    return returnError(error)
  }
};
const getUserData = async (id) => {
  try {
    const userdata = await User.findOne({ _id: id }).select("user_name profileImage");
    return userdata

  } catch (error) {
    console.error(error);
    return returnError(error)
  }
};




