const { changePassword,updateSetting,loginAdmin,forgetPassword,validateOtp,resetPassword} = require("../services/adminService");
const { response } = require("../config/helpers");
exports.changePassword = async (req, res, next) => {
    try {
      const rfl = await changePassword(req.body);
      if (rfl.status) {
        return response(res, req, rfl?.statusCode, true, rfl?.message, rfl?.data);
      } else {
        return response(res, req, rfl?.statusCode, false, rfl?.message, {});
      }
    } catch (err) {
      next(err);
    }
  };
  exports.updateSetting = async (req, res, next) => {
    try {
      const rfl = await updateSetting(req.body);
      if (rfl.status) {
        return response(res, req, rfl?.statusCode, true, rfl?.message, rfl?.data);
      } else {
        return response(res, req, rfl?.statusCode, false, rfl?.message, {});
      }
    } catch (err) {
      next(err);
    }
  };
  exports.loginAdmin = async (req, res, next) => {
    try {
      const al = await loginAdmin(req.body);
      if (al.status) {
        return response(res, req, al?.statusCode, true, al?.message, al?.data);
      } else {
        return response(res, req, al?.statusCode, false, al?.message, {});
      }
    } catch (err) {
      next(err);
    }
  };
  exports.forgetPassword = async (req, res, next) => {
    try {
      const al = await forgetPassword(req.body);
      if (al.status) {
        return response(res, req, al?.statusCode, true, al?.message, al?.data);
      } else {
        return response(res, req, al?.statusCode, false, al?.message, {});
      }
    } catch (err) {
      next(err);
    }
  };
  exports.forgetPassword = async (req, res, next) => {
    try {
      const al = await forgetPassword(req.body);
      if (al.status) {
        return response(res, req, al?.statusCode, true, al?.message, al?.data);
      } else {
        return response(res, req, al?.statusCode, false, al?.message, {});
      }
    } catch (err) {
      next(err);
    }
  };
  exports.validateOtp = async (req, res, next) => {
    try {
      const al = await validateOtp(req.body);
      if (al.status) {
        return response(res, req, al?.statusCode, true, al?.message, al?.data);
      } else {
        return response(res, req, al?.statusCode, false, al?.message, {});
      }
    } catch (err) {
      next(err);
    }
  };
  exports.resetPassword = async (req, res, next) => {
    try {
      req.body.id=req.id;
      const al = await resetPassword(req.body);
      if (al.status) {
        return response(res, req, al?.statusCode, true, al?.message, al?.data);
      } else {
        return response(res, req, al?.statusCode, false, al?.message, {});
      }
    } catch (err) {
      next(err);
    }
  };

  
  
  