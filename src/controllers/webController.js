const { countryList,addCars} = require("../services/webService");
const { response } = require("../config/helpers");
exports.serverStatus = async (req, res, next) => {
  try {
    return response(res, req, 200, true, "Server is runing ", {});
  } catch (err) {
    next(err);
  }
};
exports.countryList = async (req, res, next) => {
  try {
    const user = await countryList(req.body);
    if (user.status) {
      return response(
        res,
        req,
        user?.statusCode,
        true,
        user?.message,
        user?.data
      );
    } else {
      return response(res, req, user?.statusCode, false, user?.message, {});
    }
  } catch (err) {
    next(err);
  }
};
exports.addCars = async (req, res, next) => {
  try {
    
    const user = await addCars(req);
    if (user.status) {
      return response(
        res,
        req,
        user?.statusCode,
        true,
        user?.message,
        user?.data
      );
    } else {
      return response(res, req, user?.statusCode, false, user?.message, {});
    }
  } catch (err) {
    next(err);
  }
};
