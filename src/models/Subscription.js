const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
    planeName: {
        type: String,
        required: true,
    },
    planePrice: {
        type: String,
        required: true,
    },
    subText: {
        type: String,
        required: true,
    },
    features: {
        type: String,
        required: true,
    },
    status: {
        type: Number,
        enum: [0, 1],
        default: 1
    },
    isManageCurrency: {
        type: Boolean,
        default: false
    }

}, { timestamps: true });

const Subscription = mongoose.model('Subscription', SubscriptionSchema);

module.exports = Subscription;
