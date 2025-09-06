const mongoose = require('mongoose');
const allRoutes = [];
const Permission = require("../models/Permission");
const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/businessMarketPlace', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        // const roles = [
        //     { name: 'admin', guardName: 'web',},
        //     { name: 'admin/create', guardName: 'web'},
        //     { name: 'admin/update', guardName: 'web'},
        //     { name: 'admin/delete', guardName: 'web'},
        //     { name: 'merchant/merchant-details', guardName: 'web'},
        //     { name: 'merchant/approve-and-rejected', guardName: 'web'},
        //     { name: 'subscription', guardName: 'web'},
        //     { name: 'subscription/create', guardName: 'web'},
        //     { name: 'subscription/update', guardName: 'web'},
        //     { name: 'subscription/delete', guardName: 'web'},
        //     { name: 'subscription/approve-and-rejected', guardName: 'web'},
        //     { name: 'in-app-currency', guardName: 'web'},
        //     { name: 'in-app-currency/create', guardName: 'web'},
        //     { name: 'in-app-currency/update', guardName: 'web'},
        //     { name: 'in-app-currency/delete', guardName: 'web'},
        //     { name: 'icategory', guardName: 'web'},
        //     { name: 'icategory/create', guardName: 'web'},
        //     { name: 'icategory/update', guardName: 'web'},
        //     { name: 'icategory/delete', guardName: 'web'},
        //     { name: 'tag', guardName: 'web'},
        //     { name: 'tag/create', guardName: 'web'},
        //     { name: 'tag/update', guardName: 'web'},
        //     { name: 'tag/delete', guardName: 'web'},
        //     { name: 'ticket', guardName: 'web'},
        //     { name: 'ticket/create', guardName: 'web'},
        //     { name: 'ticket/update', guardName: 'web'},
        //     { name: 'ticket/delete', guardName: 'web'},
            
        //   ];
        //   await Permission.insertMany(roles);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1); // Exit process if connection fails
    }
};

module.exports = connectDB;
