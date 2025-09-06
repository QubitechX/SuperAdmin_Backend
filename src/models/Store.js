const mongoose = require('mongoose');

const StoreSchema = new mongoose.Schema({
    merchant: { type: mongoose.Schema.Types.ObjectId, ref: 'Merchants', required: true },
    storeName: { type: String, required: true },
    storeLogo: { type: String, required: true },
    category:[{ type: String }],
    location: { type: String },
    city: { type: String },
    storeContactNumber:{type:String,required:true},
    storeAlternateNumber:{type:String,required:true},
    storeEmailAddress:{type:String,required:true},
    storeMapLocation: {
        lat: { type: String },
        lng: { type: String },
        location: { type: String }
    },
    googleMapReviewAndRating: { type: String },
    googleMapDirection: { type: String },
    openingSchedule: [
        {
            day: {
                type: String,
                enum: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                required: true
            },
            openingDateTime: { type: String, required: true },
            closingDateTime: { type: String },
            status: { type: String, enum: ["Open", "Closed"], default: "Open" },
        },
    ],
    averageCostForTwo: { type: Number },
    indicativePricing: {
        pricing: { type: String, default: "" },
        noOfUnit: { type: String, default: "" },
    },
    tags: [{ type: String }],
    bestSellers: [{ type: String }],
    facilities: [{ type: String }],
    menuPhotos: [{ type: String }],
    imageGallery: [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model('Store', StoreSchema);
