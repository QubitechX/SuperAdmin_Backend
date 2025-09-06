const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
    isEmailNotification: Boolean,
  isPushNotification: Boolean
});

const Category  = mongoose.model('Setting', settingSchema);
module.exports = Category ;
