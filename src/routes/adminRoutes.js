const express = require("express");
const router = express.Router();
const multer = require("multer");
// const upload = require('../middlewares/upload');
const authenticateToken = require('../middlewares/AuthenticateToken');
require("express-group-routes");
const { storeListBasedOnStaff } = require("../controllers/storeController");
const { serverStatus, addMerchant, merchantList, merchantDetails, approveAndRejected, deleteMerchant, merchantUpdate, userList } = require("../controllers/merchantController");
const { addStaff, staffList, staffDetails, deleteStaff, staffUpdate, approveAndRejectedStaff } = require("../controllers/staffController");
const { customerList } = require("../controllers/customerController");
const { addSubscription, subscriptionList, subscriptionUpdate, deleteSubscription, approveAndRejectedSubscription } = require("../controllers/subscriptionController");
const { addInAppCurrency, inAppCurrencyList, inAppCurrencyUpdate, deleteInAppCurrency, approveAndRejectedInAppCurrency } = require("../controllers/inAppCurrencyController");
const { addCategory, categoriesList, categoryUpdate, deleteCategory } = require("../controllers/categoryController");
const { addTag, tagsList, deleteTag, tagUpdate } = require("../controllers/tagController");
const { addIndustry, industryList, deleteIndustry, industryUpdate } = require("../controllers/industryController");
const { changePassword, updateSetting, loginAdmin, forgetPassword, validateOtp, resetPassword } = require("../controllers/adminController");
const { hotDealStore, getAllHotDeals, getHotDealById, updateHotDeal, deleteHotDeal, getAllCity, getAllState, getAllCountry, storeDistrict, getAllDistrict, updateDistrict, deleteDistrict, papulerOrNotDistrict, staoreTaskToDoAndAchievements, deleteTaskToDoAndAchievements, updateTaskToDoAndAchievements, deleteManageReward, updateManageReward, getAllManageRewards, createManageReward,getAllTaskToDoAndAchievements } = require("../controllers/manageAppController");
const { ticketList, ticketReply, closeTicketRequest, ticketReplyHistory } = require("../controllers/ticketController");
const { validateResetPassword, validateUpdateSetting, validateMerchant, validateCategory, validateTag, validateTagUpdate, validateSubscription, validateStaff, validateHotDeal, validateTask, validateManageReward } = require("../middlewares/validations/adminValidation")
const { uploadMultipleMedia, listAllMedia, softDeleteMultiple } = require("../controllers/uploadMediaController");
const storage = multer.memoryStorage();
const upload = multer({ storage });
router.get("/", serverStatus);
router.post("/admin-login", loginAdmin);
router.post("/forgot-password", forgetPassword);
router.post("/validate-otp", validateOtp);
router.use(authenticateToken);
router.post("/reset-password", resetPassword);
router.post("/change-password", changePassword);
router.post("/update-setting", validateUpdateSetting, updateSetting);
// Middleware to validate uploaded files
// const validateUploads = (req, res, next) => {
//   upload.fields([
//       { name: "menuPhotos", maxCount: 10 },
//       { name: "imageGallery", maxCount: 10 },
//       { name: "profileImage", maxCount: 1 }
//   ])(req, res, (err) => {
//       if (err instanceof multer.MulterError) {
//           if (err.code === "LIMIT_FILE_SIZE") {
//               return res.status(400).json({ success: false, message: "File size must be less than 5MB" });
//           }
//           if (err.code === "LIMIT_UNEXPECTED_FILE") {
//               return res.status(400).json({ success: false, message: "Unexpected file field" });
//           }
//           return res.status(400).json({ success: false, message: err.message });
//       } else if (err) {
//           return res.status(400).json({ success: false, message: err.message });
//       }
//       next();
//   });
// };
router.post("/upload", upload.array("media", 10), uploadMultipleMedia);
router.post("/delete-media", softDeleteMultiple);

router.get('/media-list', listAllMedia);
//merchant
router.get("/user-list", userList);
router.group("/merchant", (router) => {
  router.post("/", merchantList);
  router.post("/create", validateMerchant, addMerchant);
  router.post("/update", validateMerchant, merchantUpdate);
  router.post("/delete", deleteMerchant);
  router.post("/merchant-details", merchantDetails);
  router.post("/approve-and-rejected", approveAndRejected);
});
router.group("/store", (router) => {
  router.get("/staff", storeListBasedOnStaff);
});
router.group("/staff", (router) => {
  router.post("/", staffList);
  router.post("/create", validateStaff, addStaff);
  router.post("/update", validateStaff, staffUpdate);
  router.post("/delete", deleteStaff);
  router.post("/staff-details", staffDetails);
  router.post("/approve-and-rejected", approveAndRejectedStaff);
});
router.group("/customer", (router) => {
  router.post("/", customerList);
});
//Subscription
router.group("/subscription", (router) => {
  router.post("/", subscriptionList);
  router.post("/create", validateSubscription, addSubscription);
  router.post("/update", validateSubscription, subscriptionUpdate);
  router.post("/delete", deleteSubscription);
  router.post("/approve-and-rejected", approveAndRejectedSubscription);
});
//In App Currency Management
router.group("/in-app-currency", (router) => {
  router.post("/", inAppCurrencyList);
  router.post("/create", validateSubscription, addInAppCurrency);
  router.post("/update", validateSubscription, inAppCurrencyUpdate);
  router.post("/delete", deleteInAppCurrency);
});
//category management
router.group("/category", (router) => {
  router.post("/", categoriesList);
  router.post("/create", validateCategory, addCategory);
  router.post("/update", validateCategory, categoryUpdate);
  router.post("/delete", deleteCategory);
});
//Tag management
router.group("/tag", (router) => {
  router.post("/", tagsList);
  router.post("/create", validateTag, addTag);
  router.post("/update", validateTagUpdate, tagUpdate);
  router.post("/delete", deleteTag);
});
//Ticket Management
router.group("/ticket", (router) => {
  router.post("/", ticketList);
  router.post("/create-reply", ticketReply);
  router.post("/close-ticket-request", closeTicketRequest);
  router.post("/ticketReply-history", ticketReplyHistory);

});
router.group("/industry", (router) => {
  router.post("/", industryList);
  router.post("/create", addIndustry);
  router.post("/update", industryUpdate);
  router.post("/delete", deleteIndustry);
});

router.group("/customer-manage", (router) => {
  router.group("/hot-deals", (router) => {
    router.post("/", getAllHotDeals);
    router.post("/create", validateHotDeal, hotDealStore);
    router.post("/update", validateHotDeal, updateHotDeal);
    router.post("/delete", deleteHotDeal);
  });
});
router.post("/country", getAllCountry);
router.post("/state", getAllState);
router.post("/city", getAllCity);
router.group("/district", (router) => {
  router.post("/", getAllDistrict);
  router.post("/create", storeDistrict);
  router.post("/update", updateDistrict);
  router.post("/delete", deleteDistrict);
  router.post("/papuler", papulerOrNotDistrict);
});

router.group("/staff-manage", (router) => {
  router.post("/", getAllTaskToDoAndAchievements);
  router.post("/create", validateTask, staoreTaskToDoAndAchievements);
  router.post("/update", validateTask, updateTaskToDoAndAchievements);
  router.post("/delete", deleteTaskToDoAndAchievements);
});
router.group("/manage-reward", (router) => {
  router.post("/", getAllManageRewards);
  router.post("/create", validateManageReward, createManageReward);
  router.post("/update", validateManageReward, updateManageReward);
  router.post("/delete", deleteManageReward);
});

module.exports = router;
