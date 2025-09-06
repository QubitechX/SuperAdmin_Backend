const Merchant = require("../models/Merchant");
const User = require("../models/User");

exports.response = (
  res,
  req = null,
  code = 200,
  status = false,
  message = null,
  data = {}
) => {
  console.log(code,status);
  res.status(code).send({ status: status, msg: message, data: data });
};

exports.returnError = (error = null) => {
  if (error?.code === 11000) {
    const duplicateKey = Object.keys(error.keyPattern)[0];
    return {
      status: false, message: `Duplicate entry: The ${duplicateKey} '${error.keyValue[duplicateKey]}' is already in use. Please use a unique value.`, statusCode: 400, data: error,
    };
  }
  return { status: false, message: "An error occurred", statusCode: 500, data: {}, };
};
exports.generateNextUserID = async () => {
  try {
    let lastUser = await Merchant.findOne().sort({ merchantID: -1 });
    let lastID = lastUser ? lastUser.merchantID : null;
    let nextID = "BMPM0001";

    if (lastID) {
      let number = parseInt(lastID.replace("BMPM", ""), 10) + 1;
      nextID = "BMPM" + number.toString().padStart(4, "0");
    }

    return nextID;
  } catch (error) {
    console.error("Error generating User ID:", error);
    return "BMPM0001";
  }
}
exports.approvedByDetails = async (userId) => {
  try {
     
    if (!userId) {
      return {};
    }
    const user = await User.findOne({ _id: userId }).select("fullName userId phone email profileImage");
    
    return user || {};

  } catch (error) {
    console.error("Error getting approvedBy details:", error);
    return {};
  }
};

exports.staffNextUserID = async () => {
  try {
    let lastUser = await User.findOne().sort({ _id: -1 });
    let lastID = lastUser ? lastUser.userId : null;
    let nextID = "BMPU0001";
    if (lastID) {
      let number = parseInt(lastID.replace("BMPU", ""), 10) + 1;
      nextID = "BMPU" + number.toString().padStart(4, "0");
    }
    return nextID;
  } catch (error) {
    console.error("Error generating User ID:", error);
    return "BMPU0001";
  }
}


