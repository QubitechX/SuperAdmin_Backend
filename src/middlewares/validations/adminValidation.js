const Joi = require("joi");
const { response } = require("../../config/helpers");
const mongoose = require('mongoose');
const validateMail = () => ({
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email",
    "any.required": "Email is required.",
  }).messages({
    "string.pattern.base":
      "Invalid fild .",
    "string.empty": "Email is required",
    "any.required": "Fild is required",
  }),
});
const validatePhone = (phone) => ({
  [phone]: Joi.string()
    .pattern(/^[0-9]{7,15}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Phone number is invalid.",
      "string.empty": "Phone number is required",
      "any.required": "Phone number is required",
    }),
});
const validateOptionalString = (product_id) => {
  const formattedFieldName = formatFieldName(product_id);
  return {
    [product_id]: Joi.string()
      .allow("")
      .optional()
      .messages({
        "string.base": `${formattedFieldName} must be a string`,
        "string.pattern.base": `${formattedFieldName} must contain only letters`,
      }),
  };
};

const validateArrayWithValue = (arrayKey) => {
  return Joi.object({
    [arrayKey]: Joi.array()
      .items(
        Joi.string()
          .trim()
          .pattern(/^[a-zA-Z0-9 _./-]+$/)
          .messages({
            'string.pattern.base': `Each item in ${arrayKey} must only contain letters, numbers, spaces, underscores (_), slashes (/), dots (.), or hyphens (-).`,
            'string.empty': `Items in ${arrayKey} cannot be empty.`,
          })
      )
      .required()
      .messages({
        'array.base': `${arrayKey} must be an array.`,
        'array.includesRequiredUnknowns': `${arrayKey} must contain at least one item.`,
        'any.required': `${arrayKey} is required.`,
      })
  });
};
const validateArrayOptionalWithValue = (arrayKey) => {
  return {
    [arrayKey]: Joi.array()
      .items(
        Joi.string()
          .pattern(/^[a-zA-Z0-9 _./-]+$/) // space added after 0-9
          .messages({
            'string.pattern.base': `${arrayKey} can only contain letters, numbers, spaces, underscores, slashes, and dots.`,
          })
      )
      .messages({
        'array.base': `${arrayKey} must be an array.`,
      }),
  };
};




const validateRequiredString = (statingData) => {
  const formattedFieldName = formatFieldName(statingData);

  return {
    [statingData]: Joi.string()
      .pattern(/^[a-zA-Z0-9\s.,-]+$/)
      .required()
      .messages({
        "string.base": `${formattedFieldName} must be a string`,
        "string.empty": `${formattedFieldName} is required.`,
        "string.pattern.base": `${formattedFieldName} can only contain numbers, spaces, dots, hyphens, and commas.`,
      }),
  };
};
const validateBoolean = (bool) => {
  const formattedFieldName = formatFieldName(bool);
  return {
    [bool]: Joi.boolean()
      .required()
      .messages({
        "any.required": `${formattedFieldName} is required`,
        "boolean.base": `${formattedFieldName} must be either true or false`,
      }),
  };
};

const validateTime = (time) => {
  const formattedFieldName = formatFieldName(time);
  return {
    [time]: Joi.string()
      .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/) // HH:mm (24-hour format)
      .allow(null, '') // allow optional or empty values
      .messages({
        'string.pattern.base': `${formattedFieldName} must be in HH:mm format (24-hour time).`
      }),
  };
};
const validateNumber = (number) => {
  const formattedFieldName = formatFieldName(number);
  return {
    [number]: Joi.number()
      .required()
      .messages({
        'number.base': `${formattedFieldName} value must be a number`,
        'any.required': `${formattedFieldName} value is required.`,
      }),
  };
};

exports.validateUpdateSetting = async (req, res, next) => {
  let schema = Joi.object({
    ...validateBoolean('isEmailNotification'),
    ...validateBoolean('isPushNotification'),
  });
  try {
    await schema.validateAsync(req.body);
    next();
  } catch (error) {
    return response(res, req, 400, false, error.message, {});
  }

};
// exports.validateUpdateSetting = async (req, res, next) => {
//   let schema = Joi.object({
//     ...validateBoolean('isEmailNotification'),
//     ...validateBoolean('isPushNotification'),
//   });
//   try {
//     await schema.validateAsync(req.body);
//     next();
//   } catch (error) {
//     return response(res, req, 400, false, error.message, {});
//   }

// };
// const checkValueArrayOrNot=(vale)=>{
//   console.log(JSON.parse(vale));
//   try {

//     return JSON.parse(vale);
// } catch (error) {
//    return {status:false,message:`Invalid data formet`};
// }

// }
exports.validateMerchant = async (req, res, next) => {
  let schema = Joi.object({
    ...validateRequiredString('merchantName'),
    ...validateMail(),
    ...validatePhone("contactNumber"),
    ...validateRequiredString("businessType"),
    ...validateRequiredString("location"),
    ...validateTime("openingTime"),
    ...validateTime("closingTime"),
    ...validateOptionalString("profileImage"),
    ...validateOptionalString("merchantID"),
    ...validateNumber("averageCostForTwo"),
    ...validateArrayOptionalWithValue("tags"),
    ...validateArrayOptionalWithValue("imageGallery"),
    ...validateArrayOptionalWithValue("documents"),
    ...validateArrayOptionalWithValue("menuPhotos"),
    ...validateArrayOptionalWithValue("popularDishes"),
    ...validateArrayOptionalWithValue("facilities"),
    ...validateRequiredString("googleMapDirection"),
    ...validateNumber("accountNumber"),
    ...validateRequiredString("bankName"),
    ...validateRequiredString("branch"),
    ...validateRequiredString("ifscCode"),
    ...validateRequiredString("city"),
  });

  try {
    await schema.validateAsync(req.body);
    next();
  } catch (error) {
    return response(res, req, 400, false, error.details.map(err => err.message).join(', '), {});
  }
};
exports.validateStaff = async (req, res, next) => {
  let schema = Joi.object({
    ...validateRequiredString('fullName'),
    ...validateMail(),
    ...validatePhone("phone"),
    ...validateRequiredString("industryType"),
    ...validateOptionalString("dob"),
    ...validateOptionalString("staffId"),
    ...validateOptionalString("storeId"),
    ...validateArrayOptionalWithValue("tags"),
    ...validateNumber("accountNumber"),
    ...validateRequiredString("bankName"),
    ...validateRequiredString("branch"),
    ...validateRequiredString("ifscCode"),
    ...validateOptionalString("profileImage"),

  });


  try {
    await schema.validateAsync(req.body);
    next();
  } catch (error) {
    return response(res, req, 400, false, error.details.map(err => err.message).join(', '), {});
  }
};
exports.validateCategory = async (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    industryId: Joi.array().items(Joi.string()).optional(),
    categoryId: Joi.string().optional()
  });

  try {
    await schema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    const errorMessages = error.details.map(err => err.message).join(', ');
    return response(res, req, 400, false, errorMessages, {});
  }
};

exports.validateTagUpdate = async (req, res, next) => {
  let schema = Joi.object({
    ...validateRequiredString('name'),
    industryId: Joi.array().items(Joi.string()).optional(),
    tagId: Joi.string().optional()
  });
  try {
    await schema.validateAsync(req.body);
    next();
  } catch (error) {
    return response(res, req, 400, false, error.details.map(err => err.message).join(', '), {});
  }
};


exports.validateTag = async (req, res, next) => {

  let schema = Joi.object({
    ...validateRequiredString("tags"),
    industryId: Joi.array().items(Joi.string()).optional(),
  });
  try {
    await schema.validateAsync(req.body);
    next();
  } catch (error) {
    return response(res, req, 400, false, error.details.map(err => err.message).join(', '), {});
  }
};
const formatFieldName = (fieldName) => {
  return fieldName
    .replace(/_/g, " ")        // Replace underscores with spaces
    .replace(/\b\w/g, (c) => c.toUpperCase()); // Capitalize the first letter of each word
};

exports.validateSubscription = async (req, res, next) => {

  let schema = Joi.object({
    ...validateRequiredString('planeName'),
    ...validateRequiredString("subText"),
    features: Joi.string().optional(),
    isManageCurrency: Joi.string().optional(),
    subscriptionID: Joi.string().optional(),
    ...validateNumber("planePrice")

  });

  try {
    await schema.validateAsync(req.body);
    next();
  } catch (error) {
    return response(res, req, 400, false, error.details.map(err => err.message).join(', '), {});
  }
};
const objectId = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid");
  }
  return value;
};
exports.industrySchema = Joi.object({
  name: Joi.string().required(),
  icon: Joi.string().allow(null, ''),
  iconBg: Joi.string().allow(null, ''),
  iconBanner: Joi.string().allow(null, ''),
  tags: Joi.array().items(Joi.custom(objectId)).default([]),
});

const hotDealSchema = Joi.object({
  type: Joi.string().valid('Hot Deals', 'What Are You Looking For', 'other').required()
    .messages({
      'any.only': 'Type must be either "Hot Deals", "What Are You Looking For", or "other"',
      'string.empty': 'Type is required'
    }),
  title: Joi.string().max(100).required()
    .messages({
      'string.empty': 'Title is required',
      'string.max': 'Title cannot exceed 100 characters'
    }),
  startingDate: Joi.date().required()
    .messages({
      'date.base': 'Starting date must be a valid date'
    }),
  endingDate: Joi.date().greater(Joi.ref('startingDate')).required()
    .messages({
      'date.greater': 'Ending date must be after starting date',
      'date.base': 'Ending date must be a valid date'
    }),
  shortDescription: Joi.string().max(200).required()
    .messages({
      'string.empty': 'Short description is required',
      'string.max': 'Short description cannot exceed 200 characters'
    }),
  imageUrl: Joi.string().required()
    .messages({
      'string.uri': 'Image URL must be a valid URL',
      'string.pattern.base': 'Image URL must end with .jpg, .jpeg, .png, or .gif',
      'string.empty': 'Image URL is required'
    }),
  ...validateOptionalString("id"),
  categoryId: Joi.string().hex().required()
    .messages({
      'string.hex': 'Category ID must be a valid hexadecimal value',
      'string.length': 'Category ID must be 24 characters long',
      'string.empty': 'Category ID is required'
    })
});

exports.validateHotDeal = async (req, res, next) => {
  try {
    await hotDealSchema.validateAsync(req.body, {
      abortEarly: false,
      allowUnknown: false
    });
    next();
  } catch (error) {
    const errorMessages = error.details.map(detail => detail.message);

    return response(res, req, 400, false, 'Validation failed', {
      errors: errorMessages
    });
  }
};

exports.validateTask = async (req, res, next) => {
  const schema = Joi.object({
    type: Joi.string().valid('Task To Do', 'Achievements', 'other').required(),
    title: Joi.string().max(100).required(),
    points: Joi.number().default(0),
    id: Joi.string().optional(),
    categoryId: Joi.string().hex().required()
      .messages({
        'string.hex': 'Category ID must be a valid hexadecimal value',
        'string.empty': 'Category ID is required'
      }),
    duration: Joi.when('type', {
      is: 'Task To Do',
      then: Joi.string().valid('Daily', 'Weekly', 'Monthly').required(),
      otherwise: Joi.forbidden(),
    }),
    startingRange: Joi.when('type', {
      is: 'Achievements',
      then: Joi.number().required(),
      otherwise: Joi.forbidden(),
    }),
    endingRange: Joi.when('type', {
      is: 'Achievements',
      then: Joi.number().greater(Joi.ref('startingRange')).required()
        .messages({
          'number.greater': 'EndingRange must be greater than startingRange',
        }),
      otherwise: Joi.forbidden(),
    }),
    imageUrl: Joi.when('type', {
      is: 'Achievements',
      then: Joi.string().required()
        .messages({
          'string.pattern.base': 'Image URL must end with .jpg, .jpeg, .png, or .gif',
          'string.empty': 'Image URL is required',
        }),
      otherwise: Joi.forbidden(),
    }),
  });

  try {
    const validatedData = await schema.validateAsync(req.body, { abortEarly: false });
    req.validatedData = validatedData;
    next();
  } catch (error) {
    return res.status(400).json({
      status: false,
      message: "Validation error",
      errors: error.details.map(err => err.message),
    });
  }
};
exports.validateManageReward = async (req, res, next) => {
  const schema = Joi.object({
    type: Joi.string().valid('store', 'field').required()
      .messages({
        'any.required': 'Reward type is required',
        'any.only': 'Type must be either "store" or "field"'
      }),
    id: Joi.string().optional(),
    rank: Joi.string().required()
      .messages({
        'string.empty': 'Rank cannot be empty'
      }),
    title: Joi.string().required()
      .messages({
        'string.empty': 'Title cannot be empty'
      }),
      categoryId: Joi.string().hex().required()
    .messages({
      'string.hex': 'Category ID must be a valid hexadecimal value',
      'string.length': 'Category ID must be 24 characters long',
      'string.empty': 'Category ID is required'
    }),
    imageUrl: Joi.string().required()
      .messages({
        'string.uri': 'Image URL must be a valid URL'
      }),
    rewardPoints: Joi.object({
      todayTop: Joi.number().min(0).default(1.5),
      weeklyTop: Joi.number().min(0).default(3.0),
      monthlyTop: Joi.number().min(0).default(10.0)
    }).default()
  });

  try {
    const validatedData = await schema.validateAsync(req.body, {
      abortEarly: false,
      allowUnknown: false
    });
    req.validatedData = validatedData;
    next();
  } catch (error) {
    return res.status(400).json({
      status: false,
      message: "Validation error",
      errors: error.details.map(err => err.message)
    });
  }
};
