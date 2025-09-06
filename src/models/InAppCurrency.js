const mongoose = require('mongoose');

const InAppCurrencySchema = new mongoose.Schema({
    planeName: {
        type: String,
        required: true,
        unique: true
    },
    planePrice: {
        type: String,
        required: true,
    },
    features: {
        type: String,
        required: true,
    },
    status:{
        type: Number, 
        enum: [0, 1],
        default: 1
    },
}, { timestamps: true });

const InAppCurrency = mongoose.model('InAppCurrency', InAppCurrencySchema);

module.exports = InAppCurrency;
