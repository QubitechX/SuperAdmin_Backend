const { hotDealStore, updateHotDeal, deleteHotDeal, getAllHotDeals, getAllCity, getAllState, getAllCountry, storeDistrict, getAllDistrict, updateDistrict, deleteDistrict, papulerOrNotDistrict, staoreTaskToDoAndAchievements,deleteTaskToDoAndAchievements,updateTaskToDoAndAchievements,getAllTaskToDoAndAchievements,deleteManageReward,updateManageReward,getAllManageRewards,createManageReward} = require("../services/ManageAppService");
const { response } = require("../config/helpers");

exports.hotDealStore = async (req, res, next) => {
  try {
    const rfl = await hotDealStore(req.body);
    if (rfl.status) {
      return response(res, req, rfl?.statusCode, true, rfl?.message, rfl?.data);
    } else {
      return response(res, req, rfl?.statusCode, false, rfl?.message, {});
    }
  } catch (err) {
    next(err);
  }
};

exports.updateHotDeal = async (req, res, next) => {
  try {
    const rfl = await updateHotDeal(req.body);
    if (rfl.status) {
      return response(res, req, rfl?.statusCode, true, rfl?.message, rfl?.data);
    } else {
      return response(res, req, rfl?.statusCode, false, rfl?.message, {});
    }
  } catch (err) {
    next(err);
  }
};

exports.getAllHotDeals = async (req, res, next) => {
  try {
    const al = await getAllHotDeals(req.body);
    if (al.status) {
      return response(res, req, al?.statusCode, true, al?.message, al?.data);
    } else {
      return response(res, req, al?.statusCode, false, al?.message, {});
    }
  } catch (err) {
    next(err);
  }
};

exports.deleteHotDeal = async (req, res, next) => {
  try {
    const al = await deleteHotDeal(req.body);
    if (al.status) {
      return response(res, req, al?.statusCode, true, al?.message, al?.data);
    } else {
      return response(res, req, al?.statusCode, false, al?.message, {});
    }
  } catch (err) {
    next(err);
  }
};

exports.getAllCountry = async (req, res, next) => {
  try {
    const al = await getAllCountry(req.body);
    if (al.status) {
      return response(res, req, al?.statusCode, true, al?.message, al?.data);
    } else {
      return response(res, req, al?.statusCode, false, al?.message, {});
    }
  } catch (err) {
    next(err);
  }
};

exports.getAllState = async (req, res, next) => {
  try {
    const al = await getAllState(req.body);
    if (al.status) {
      return response(res, req, al?.statusCode, true, al?.message, al?.data);
    } else {
      return response(res, req, al?.statusCode, false, al?.message, {});
    }
  } catch (err) {
    next(err);
  }
};

exports.getAllCity = async (req, res, next) => {
  try {
    const al = await getAllCity(req.body);
    if (al.status) {
      return response(res, req, al?.statusCode, true, al?.message, al?.data);
    } else {
      return response(res, req, al?.statusCode, false, al?.message, {});
    }
  } catch (err) {
    next(err);
  }
};

exports.storeDistrict = async (req, res, next) => {
  try {
    const al = await storeDistrict(req.body);
    if (al.status) {
      return response(res, req, al?.statusCode, true, al?.message, al?.data);
    } else {
      return response(res, req, al?.statusCode, false, al?.message, {});
    }
  } catch (err) {
    next(err);
  }
};

exports.getAllDistrict = async (req, res, next) => {
  try {
    const al = await getAllDistrict(req.body);
    if (al.status) {
      return response(res, req, al?.statusCode, true, al?.message, al?.data);
    } else {
      return response(res, req, al?.statusCode, false, al?.message, {});
    }
  } catch (err) {
    next(err);
  }
};

exports.updateDistrict = async (req, res, next) => {
  try {
    const al = await updateDistrict(req.body);
    if (al.status) {
      return response(res, req, al?.statusCode, true, al?.message, al?.data);
    } else {
      return response(res, req, al?.statusCode, false, al?.message, {});
    }
  } catch (err) {
    next(err);
  }
};

exports.deleteDistrict = async (req, res, next) => {
  try {
    const al = await deleteDistrict(req.body);
    if (al.status) {
      return response(res, req, al?.statusCode, true, al?.message, al?.data);
    } else {
      return response(res, req, al?.statusCode, false, al?.message, {});
    }
  } catch (err) {
    next(err);
  }
};

exports.papulerOrNotDistrict = async (req, res, next) => {
  try {
    const al = await papulerOrNotDistrict(req.body);
    if (al.status) {
      return response(res, req, al?.statusCode, true, al?.message, al?.data);
    } else {
      return response(res, req, al?.statusCode, false, al?.message, {});
    }
  } catch (err) {
    next(err);
  }
};

exports.staoreTaskToDoAndAchievements = async (req, res, next) => {
  try {
    const al = await staoreTaskToDoAndAchievements(req.body);
    if (al.status) {
      return response(res, req, al?.statusCode, true, al?.message, al?.data);
    } else {
      return response(res, req, al?.statusCode, false, al?.message, {});
    }
  } catch (err) {
    next(err);
  }
};

exports.getAllTaskToDoAndAchievements = async (req, res, next) => {
  try {
    const al = await getAllTaskToDoAndAchievements(req.body);
    if (al.status) {
      return response(res, req, al?.statusCode, true, al?.message, al?.data);
    } else {
      return response(res, req, al?.statusCode, false, al?.message, {});
    }
  } catch (err) {
    next(err);
  }
};

exports.updateTaskToDoAndAchievements = async (req, res, next) => {
  try {
    const al = await updateTaskToDoAndAchievements(req.body);
    if (al.status) {
      return response(res, req, al?.statusCode, true, al?.message, al?.data);
    } else {
      return response(res, req, al?.statusCode, false, al?.message, {});
    }
  } catch (err) {
    next(err);
  }
};

exports.deleteTaskToDoAndAchievements = async (req, res, next) => {
  try {
    const al = await deleteTaskToDoAndAchievements(req.body);
    if (al.status) {
      return response(res, req, al?.statusCode, true, al?.message, al?.data);
    } else {
      return response(res, req, al?.statusCode, false, al?.message, {});
    }
  } catch (err) {
    next(err);
  }
};

exports.getAllManageRewards = async (req, res, next) => {
  try {
    const al = await getAllManageRewards(req.body);
    if (al.status) {
      return response(res, req, al?.statusCode, true, al?.message, al?.data);
    } else {
      return response(res, req, al?.statusCode, false, al?.message, {});
    }
  } catch (err) {
    next(err);
  }
};

exports.createManageReward = async (req, res, next) => {
  try {
    
    const al = await createManageReward(req.body);
    if (al.status) {
      return response(res, req, al?.statusCode, true, al?.message, al?.data);
    } else {
      return response(res, req, al?.statusCode, false, al?.message, {});
    }
  } catch (err) {
    next(err);
  }
};

exports.updateManageReward = async (req, res, next) => {
  try {
    const al = await updateManageReward(req.body);
    if (al.status) {
      return response(res, req, al?.statusCode, true, al?.message, al?.data);
    } else {
      return response(res, req, al?.statusCode, false, al?.message, {});
    }
  } catch (err) {
    next(err);
  }
};

exports.deleteManageReward = async (req, res, next) => {
  try {
    const al = await deleteManageReward(req.body);
    if (al.status) {
      return response(res, req, al?.statusCode, true, al?.message, al?.data);
    } else {
      return response(res, req, al?.statusCode, false, al?.message, {});
    }
  } catch (err) {
    next(err);
  }
};


