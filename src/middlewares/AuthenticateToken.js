const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { findOne } = require("../queries/adminQueries");
dotenv.config();
const {response} = require("../config/helpers");
const Users = require("../models/User");
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null || token == undefined) {
    return response(res, req, 401, false, "Invalid Token!!", {});
  } else {
    jwt.verify(token, process.env.JWT_SECRET_TOKEN, async (err, user) => {
      if (err)
        return response(res, req, 401, false, "Invalid Token!", {});
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      let query = { phone: user.tokenId };
      if (emailRegex.test(user.tokenId)) {
        query = { email: user.tokenId };
      }
      
      const userid = await findOne(Users,query);
      if (userid) {
        req.id = userid?._id;
        req.user = {
          id: userid?._id,
          name: userid?.user_name,
          email: userid?.user_email,
          phone: userid?.phone_no,
          role: userid?.role,
        };
        req.token = token;

        next();
      } else {
        return response(res, req, 401, false, "Login First!", {});
      }
    });
  }
};

module.exports = authenticateToken;
