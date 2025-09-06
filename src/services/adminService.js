const User = require('../models/User');
const jwt = require("jsonwebtoken");
const Setting = require('../models/Setting');
const { returnError, response } = require("../config/helpers");
const OTPModel = require("../models/Otp");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const { findOne, findOneAndUpdate, insertOrUpdate, findOneAndDelete } = require("../queries/adminQueries");
exports.changePassword = async (reqBody) => {
  try {
    const { oldPassword, newPassword, confirmPassword, email } = reqBody;

    if (!email) {
      return {
        status: false,
        message: "Either email or mobile is required.",
        statusCode: 400,
        data: {},
      };
    }

    const user = await User.findOne({
      $or: [{ email: email }, { phone: email }],
    });

    if (!user) {
      return {
        status: false,
        message: "User not found.",
        statusCode: 400,
        data: {},
      };
    }

    if (!oldPassword) {
      return {
        status: false,
        message: "Old Password is required.",
        statusCode: 400,
        data: {},
      };
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return {
        status: false,
        message: "Old password is incorrect.",
        statusCode: 400,
        data: {},
      };
    }

    if (!confirmPassword) {
      return {
        status: false,
        message: "Confirm Password is required.",
        statusCode: 400,
        data: {},
      };
    }

    if (!newPassword) {
      return {
        status: false,
        message: "New Password is required.",
        statusCode: 400,
        data: {},
      };
    }

    if (newPassword !== confirmPassword) {
      return {
        status: false,
        message: "New password and confirm password do not match.",
        statusCode: 400,
        data: {},
      };
    }

    user.password = await bcrypt.hash(confirmPassword, 10);
    await user.save();
    return {
      status: true,
      message: "Password updated successfully",
      statusCode: 200,
      data: {},
    };
  } catch (err) {
    console.error(err);
    return {
      status: false,
      message: "Invalid or expired token",
      statusCode: 500,
      data: err,
    };
  }
};

exports.updateSetting = async (body) => {
  try {
    const addTag = await insertOrUpdate(Setting, body)
    if (addTag?.status) {
      return { status: true, message: "Update setting", statusCode: 200, data: addTag?.message, };
    }
    else {
      const error = addTag?.message;
      return returnError(error);
    }
  } catch (error) {
    console.error(error);
    return returnError(error);
  }
};
exports.loginAdmin = async (data) => {
  try {

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    let query = { role: "admin" };
    if (emailRegex.test(data.email)) {
      query = { email: data.email };
    } else {
      query = { phone: data.email };
    }
    const user = await findOne(User, query);

    if (!user) {
      return { status: false, message: "User not found", statusCode: 400, data: {}, };
    }
    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      return { status: false, message: "Invalid credentials", statusCode: 401, data: {} };
    }
    tokenData = await authToken(data?.email);
    userData = {
      token: tokenData,
    };
    return { status: true, message: "Login successful", statusCode: 200, data: userData };
  } catch (error) {
    console.error(error);
    return returnError(error);
  }
};
const getOtp = () => Math.floor(Math.random() * (9 * Math.pow(10, 6 - 1))) + Math.pow(10, 6 - 1);
exports.forgetPassword = async (body) => {
  try {
    const { email } = body;
    if (!email) {
      return {
        status: false, message: "Email is required.", statusCode: 400, data: {},
      };
    }
    let query = { email: email };
    const user = await findOne(User, query);

    let roleType = "admin";
    if (!user) {
      return { status: false, message: "User not found", statusCode: 400, data: {}, };
    }
    if (user?.roles != roleType) {
      return { status: false, message: "User not found", statusCode: 400, data: {}, };
    }
    const otp = await this.loginUser(user);
    return { status: true, message: "OTP sent to your email.", statusCode: 200, data: { otp: otp?.otp }, };
  } catch (err) {
    console.log("Error:", err);

    return returnError(err);
  }
};
// Validate Phone OTP
exports.validateOtp = async (body) => {
  const { email, code } = body;
  let query = { email: email };
  const user = await findOne(User, query);
  if (!user) {
    return { status: false, message: "User not found", statusCode: 400, data: {}, };
  }
  const otpRecord = await findOne(OTPModel, { email: email, otp: code, type: "email", });
  if (!otpRecord) {
    return { status: false, message: "Invalid OTP", statusCode: 400, data: {}, };
  }
  await findOneAndDelete(OTPModel, { email: email, otp: code, type: "email" });
  const token = await authToken(email);
  return { status: true, message: "Otp validated", statusCode: 200, data: { token } };
};
exports.loginUser = async (user) => {
  const otp = getOtp();
  const otpData = {
    userId: user._id,
    phone: user.email,
    otp,
    type: "email",
  };
  const result = await OTPModel.findOneAndUpdate(
    {
      userId: user._id,
      email: user.email
    },
    {
      $set: otpData,
      $setOnInsert: {
        createdAt: new Date()
      }
    },
    {
      upsert: true,
      new: true,
      returnDocument: 'after'
    }
  );


  return result;
};
exports.resetPassword = async (data) => {
  try {
    let query = { _id: data?.id };
    const user = await findOne(User,query);
    if (!user) {
      return { status: false, message: "User not found!", statusCode: 400, };
    }
    if (!data.password) {
      return { status: false, message: "Password is required", statusCode: 400, };
    }
    if (!data.confirmPassword) {
      return {
        status: false, message: "Confirm Password is required.", statusCode: 400, data: {},
      };
    }
    

    if (data.password !== data.confirmPassword) {
      return {
        status: false, message: "New password and confirm password do not match.", statusCode: 400, data: {},
      };
    }

    user.password = await bcrypt.hash(data.confirmPassword, 10);
    await user.save();
    return {
      status: true,message: "Password Reset",statusCode: 200,data: {},
    };

  } catch (error) {
    console.error(error);
    return {
      status: false,
      message: "An error occurred",
      statusCode: 500,
      data: error,
    };
  }
};

const authToken = async (tokenId, logout = false) => {
  try {
    if (logout) {
      const token = "";
      await findOneAndUpdate(User, { $or: [{ phone: tokenId }, { email: tokenId }] }, { token: null });
      return token;
    } else {
      const token = jwt.sign(
        { tokenId: tokenId.toString() },
        process.env.JWT_SECRET_TOKEN
      );
      await findOneAndUpdate(User, { $or: [{ phone: tokenId }, { email: tokenId }] }, { token: token });
      return token;
    }
  } catch (error) {
    console.log(error);
  }
};