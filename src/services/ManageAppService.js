const Country = require('../models/Country');
const HotDeal = require('../models/HotDeal');
const State = require('../models/State');
const City = require('../models/City');
const TaskToDoAndAchievement = require('../models/TaskToDoAndAchievement');
const mongoose = require('mongoose');
const District = require('../models/District');
const ManageReward = require('../models/ManageReward');

exports.hotDealStore = async (reqBody) => {
  try {

    const hotDeal = new HotDeal(reqBody);
    await hotDeal.save();

    return {
      status: true,
      message: "Hot Deal created successfully",
      statusCode: 200,
      data: hotDeal
    };
  } catch (err) {
    console.error(err);
    return {
      status: false,
      message: "Failed to create Hot Deal",
      statusCode: 500,
      data: err.message
    };
  }
};

exports.getAllHotDeals = async (filter = {}) => {
  try {
    const data = await HotDeal.find(filter)
      .select('-__v')
      .populate({ path: 'categoryId', select: 'name _id' })
      .sort({ createdAt: -1 })
      .lean();

    // Group by `type` key
    const groupedData = data.reduce((acc, item) => {
      const key = item.type || "Unknown";
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(item);
      return acc;
    }, {});

    return {
      status: true,
      message: "Hot Deals retrieved successfully",
      statusCode: 200,
      data: groupedData
    };
  } catch (error) {
    return {
      status: false,
      message: "Failed to retrieve Hot Deals",
      statusCode: 500,
      data: error.message
    };
  }
};

exports.getHotDealById = async (id) => {
  try {
    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return {
        status: false,
        message: "Invalid Hot Deal ID",
        statusCode: 400,
        data: null
      };
    }

    const data = await HotDeal.findById(id).populate('categoryId');
    if (!data) {
      return {
        status: false,
        message: "Hot Deal not found",
        statusCode: 404,
        data: null
      };
    }

    return {
      status: true,
      message: "Hot Deal retrieved successfully",
      statusCode: 200,
      data: data
    };
  } catch (error) {
    return {
      status: false,
      message: "Failed to retrieve Hot Deal",
      statusCode: 500,
      data: error.message
    };
  }
};

exports.updateHotDeal = async (updateData) => {
  try {
    // Validate ID format
    const id = updateData?.id;
    console.log(updateData)
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return {
        status: false,
        message: "Invalid Hot Deal ID",
        statusCode: 400,
        data: null
      };
    }


    const data = await HotDeal.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('categoryId');

    if (!data) {
      return {
        status: false,
        message: "Hot Deal not found",
        statusCode: 404,
        data: null
      };
    }

    return {
      status: true,
      message: "Hot Deal updated successfully",
      statusCode: 200,
      data: data
    };
  } catch (error) {
    console.log(error)
    return {
      status: false,
      message: "Failed to update Hot Deal",
      statusCode: 500,
      data: error.message
    };
  }
};

exports.deleteHotDeal = async ({ id }) => {
  try {
    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return {
        status: false,
        message: "Invalid Hot Deal ID",
        statusCode: 400,
        data: null
      };
    }

    const data = await HotDeal.findByIdAndDelete(id);
    if (!data) {
      return {
        status: false,
        message: "Hot Deal not found",
        statusCode: 404,
        data: null
      };
    }

    return {
      status: true,
      message: "Hot Deal deleted successfully",
      statusCode: 200,
      data: data
    };
  } catch (error) {
    console.log(error)
    return {
      status: false,
      message: "Failed to delete Hot Deal",
      statusCode: 500,
      data: error.message
    };
  }
};

exports.getAllCountry = async (id) => {
  try {

    const countries = await Country.find();
    if (!countries) {
      return {
        status: false,
        message: "Hot Deal not found",
        statusCode: 404,
        data: []
      };
    }

    return {
      status: true,
      message: "Hot Deal retrieved successfully",
      statusCode: 200,
      data: countries
    };
  } catch (error) {
    return {
      status: false,
      message: "Failed to retrieve Hot Deal",
      statusCode: 500,
      data: error.message
    };
  }
};

exports.getAllCountry = async () => {
  try {

    const countries = await Country.find();
    if (!countries) {
      return {
        status: false,
        message: "Country not found",
        statusCode: 404,
        data: []
      };
    }

    return {
      status: true,
      message: "Country retrieved successfully",
      statusCode: 200,
      data: countries
    };
  } catch (error) {
    return {
      status: false,
      message: "Failed to retrieve Country",
      statusCode: 500,
      data: error.message
    };
  }
};

exports.getAllState = async ({ countryId = 102 }) => {
  try {
    const states = await State.find({ country_id: countryId });
    if (!states) {
      return {
        status: false,
        message: "State not found",
        statusCode: 404,
        data: []
      };
    }

    return {
      status: true,
      message: "State retrieved successfully",
      statusCode: 200,
      data: states
    };
  } catch (error) {
    console.log(error)
    return {
      status: false,
      message: "Failed to retrieve State",
      statusCode: 500,
      data: error.message
    };
  }
};

exports.getAllCity = async ({ stateId = 1313 }) => {
  try {

    const cities = await City.find({ state_id: stateId });
    if (!cities) {
      return {
        status: false,
        message: "City not found",
        statusCode: 404,
        data: []
      };
    }

    return {
      status: true,
      message: "City retrieved successfully",
      statusCode: 200,
      data: cities
    };
  } catch (error) {
    console.log(error)
    return {
      status: false,
      message: "Failed to retrieve City",
      statusCode: 500,
      data: error.message
    };
  }
};

exports.storeDistrict = async (reqBody) => {
  try {
    const cityExists = await City.exists({ _id: reqBody.cityId });
    if (!cityExists) {
      return {
        status: false,
        message: "City not found",
        statusCode: 404,
        data: null
      };
    }

    const district = new District({
      name: reqBody.name,
      city_id: reqBody.cityId
    });

    const savedDistrict = await district.save();
    return {
      status: true,
      message: "District created successfully",
      statusCode: 201, // 201 for resource creation
      data: savedDistrict
    };
  } catch (err) {
    console.error(err);
    return {
      status: false,
      message: "Failed to create District",
      statusCode: 500,
      data: err.message
    };
  }
};

exports.getAllDistrict = async (reqBody) => {
  try {
    const cityExists = await City.exists({ _id: reqBody.cityId });
    if (!cityExists) {
      return {
        status: false,
        message: "City not found",
        statusCode: 404,
        data: null
      };
    }

    const districts = await District.find({ city_id: reqBody.cityId });

    return {
      status: true,
      message: "Districts fetched successfully",
      statusCode: 200,
      data: districts
    };
  } catch (err) {
    console.error(err);
    return {
      status: false,
      message: "Failed to fetch Districts",
      statusCode: 500,
      data: err.message
    };
  }
};

exports.updateDistrict = async (reqBody) => {
  try {
    if (!reqBody?.id) {
      return {
        status: false,
        message: "District ID is required",
        statusCode: 400,
        data: null
      };
    }

    const updatedDistrict = await District.findByIdAndUpdate(
      { _id: reqBody.id },
      reqBody,
      { new: true, runValidators: true }
    );

    if (!updatedDistrict) {
      return {
        status: false,
        message: "District not found",
        statusCode: 404,
        data: null
      };
    }

    return {
      status: true,
      message: "District updated successfully",
      statusCode: 200,
      data: updatedDistrict
    };
  } catch (err) {
    console.error(err);
    return {
      status: false,
      message: "Failed to update District",
      statusCode: 500,
      data: err.message
    };
  }
};

exports.deleteDistrict = async (reqBody) => {
  try {
    if (!reqBody?.id) {
      return {
        status: false,
        message: "District ID is required",
        statusCode: 400,
        data: null
      };
    }

    const deletedDistrict = await District.findByIdAndDelete(reqBody.id);

    if (!deletedDistrict) {
      return {
        status: false,
        message: "District not found",
        statusCode: 404,
        data: null
      };
    }

    return {
      status: true,
      message: "District deleted successfully",
      statusCode: 200,
      data: deletedDistrict
    };
  } catch (err) {
    console.error(err);
    return {
      status: false,
      message: "Failed to delete District",
      statusCode: 500,
      data: err.message
    };
  }
};

exports.papulerOrNotDistrict = async (reqBody) => {
  try {
    if (!reqBody?.id) {
      return {
        status: false,
        message: "District ID is required",
        statusCode: 400,
        data: null
      };
    }

    const district = await District.findById(reqBody.id);
    if (!district) {
      return {
        status: false,
        message: "District not found",
        statusCode: 404,
        data: null
      };
    }

    const updatedStatus = !district.status;
    const updatedDistrict = await District.findByIdAndUpdate(
      reqBody.id,
      { status: updatedStatus },
      { new: true, runValidators: true }
    );

    return {
      status: true,
      message: `District marked as ${updatedStatus ? 'popular' : 'not popular'}`,
      statusCode: 200,
      data: updatedDistrict
    };
  } catch (err) {
    console.error(err);
    return {
      status: false,
      message: "Failed to update District status",
      statusCode: 500,
      data: err.message
    };
  }
};

exports.getAllTaskToDoAndAchievements = async (filter={}) => {
  try {
    const data = await TaskToDoAndAchievement.find(filter)
      .select('-__v')
      .populate({ path: 'categoryId', select: 'name _id' })
      .sort({ createdAt: -1 })
      .lean();
    const groupedData = data.reduce((acc, item) => {
      const key = item.type || "Unknown";
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(item);
      return acc;
    }, {});

    return {
      status: true,
      message: "Manage reward Datas",
      statusCode: 200,
      data: groupedData
    };
  } catch (err) {
    console.log(err)
    return {
      status: false,
      message: "Failed to  get data",
      statusCode: 500,
      data: err.message
    };
  }
};

exports.staoreTaskToDoAndAchievements = async (reqBody) => {
  try {

    const hotDeal = new TaskToDoAndAchievement(reqBody);
    await hotDeal.save();

    return {
      status: true,
      message: "Task to do created successfully",
      statusCode: 200,
      data: hotDeal
    };
  } catch (err) {
    console.error(err);
    return {
      status: false,
      message: "Failed to create Hot Deal",
      statusCode: 500,
      data: err.message
    };
  }
};

exports.updateTaskToDoAndAchievements = async (reqBody) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(reqBody?.id)) {
      return {
        status: false,
        message: "Invalid task ID format",
        statusCode: 400,
        data: null
      };
    }
    const updatedTask = await TaskToDoAndAchievement.findByIdAndUpdate(
      reqBody?.id,
      reqBody,
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return {
        status: false,
        message: "Task not found",
        statusCode: 404,
        data: null
      };
    }
    return {
      status: true,
      message: "Task Updated successfully",
      statusCode: 200,
      data: updatedTask
    };
  } catch (err) {
    console.error(err);
    return {
      status: false,
      message: "Failed to Update",
      statusCode: 500,
      data: err.message
    };
  }
};

exports.deleteTaskToDoAndAchievements = async (reqBody) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(reqBody.id)) {
      return {
        status: false,
        message: "Invalid task ID format",
        statusCode: 400,
        data: null
      };
    }

   const deletedTask = await TaskToDoAndAchievement.findByIdAndDelete(reqBody.id);

    if (!deletedTask) {
      return {
        status: false,
        message: "Task not found",
        statusCode: 404,
        data: null
      };
    }

    return {
      status: true,
      message: "Task deleted successfully",
      statusCode: 200,
      data: deletedTask
    };
  } catch (err) {
    console.error("Error deleting task:", err);
    return {
      status: false,
      message: "Failed to delete task",
      statusCode: 500,
      data: err.message
    };
  }
};

exports.createManageReward = async (reqBody) => {
  try {
    const reward = new ManageReward(reqBody);
    await reward.save();
    return {
      status: true,
      message: "Manage reward created successfully",
      statusCode: 200,
      data: reward
    };
  } catch (err) {
    return {
      status: false,
      message: "Failed to delete task",
      statusCode: 500,
      data: err.message
    };
  }
};

exports.getAllManageRewards = async (filter={}) => {
  try {
    const data = await ManageReward.find(filter)
      .select('-__v')
      .populate({ path: 'categoryId', select: 'name _id' })
      .sort({ createdAt: -1 })
      .lean();
    const groupedData = data.reduce((acc, item) => {
      const key = item.type || "Unknown";
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(item);
      return acc;
    }, {});

    return {
      status: true,
      message: "Manage reward Datas",
      statusCode: 200,
      data: groupedData
    };
  } catch (err) {
    console.log(err)
    return {
      status: false,
      message: "Failed to  get data",
      statusCode: 500,
      data: err.message
    };
  }
};

exports.updateManageReward = async (reqBody) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(reqBody?.id)) {
      return {
        status: false,
        message: "Invalid ID format",
        statusCode: 400,
        data: null
      };
    }
    const reward = await ManageReward.findByIdAndUpdate(reqBody.id, reqBody, { new: true });
    if (!reward) {
      return {
        status: false,
        message: "Manage reward not found",
        statusCode: 404,
        data: null
      };
    }
    return {
      status: true,
      message: "Manage reward Updated successfully",
      statusCode: 200,
      data: reward
    };
  } catch (err) {
    return {
      status: false,
      message: "Failed to delete task",
      statusCode: 500,
      data: err.message
    };
  }
};

exports.deleteManageReward = async (reqBody) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(reqBody?.id)) {
      return {
        status: false,
        message: "Invalid ID format",
        statusCode: 400,
        data: null
      };
    }
    const reward = await ManageReward.findByIdAndDelete(reqBody.id);
    if (!reward) {
      return {
        status: false,
        message: "Manage reward not found",
        statusCode: 404,
        data: null
      };
    }
    return {
      status: true,
      message: "Deleted successfully",
      statusCode: 200,
      data: reward
    };
  } catch (err) {
    return {
      status: false,
      message: "Failed to delete task",
      statusCode: 500,
      data: err.message
    };
  }
};