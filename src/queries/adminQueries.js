
const { mongoose } = require("mongoose");

// create
exports.create = async (Model, body) => {
    try {
        
        const newModel = new Model(body);
        const saveData= await newModel.save();
        console.log(saveData,"%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
        return {status:true,message:saveData}
    } catch (error) {
        return {status:false,message:error}
    }
};
// create Many
exports.createMany = async (model, body) => {
    return await model.insertMany(body);
};

exports.upsertMany = async (model,filter, body) => {
    return await model.updateMany(filter,body);
};

// find and filter
exports.find = async (model, filter = {}, pagination = {}, sort = {}, projection = {} ,populate=null) => {
    
    return await model.find(filter, projection, {
        populate: populate
    })
    .skip(pagination.skip)
    .limit(pagination.limit)
    .sort(sort)
    .select('-__v -updatedAt');
};

exports.findOne = async (model, filter, projection = {}) => {
    return await model.findOne(filter, projection);
};

exports.findByID = async (model, id) => {
    return await model.findById(id);
};

exports.countDocuments = async (model, filter) => {
    return await model.countDocuments(filter);
};

exports.bulkWrite = async (model, body) => {
    return await model.bulkWrite(body);
}
// updates
exports.findOneAndUpdate = async (model, filter, body) => {
    try {
        const saveData=  await model.findOneAndUpdate(filter, body, { new: true });;
        return {status:true,message:saveData}
    } catch (error) {
        return {status:false,message:error}
    }
    
};

exports.findOneAndUpsert = async (model, filter, body) => {
    return await model.findOneAndUpdate(filter, body, { new: true, upsert: true, runValidators: true, context: "query", setDefaultsOnInsert: true });
};

exports.updateMany = async (model, filter, body) => {
    return await model.updateMany(filter, body, { new: true, upsert:true});
};

// delete
exports.findOneAndDelete = async (model, filter) => {
    try {
        const deleteData= await model.findOneAndDelete(filter);
        return {status:true,message:deleteData}
    } catch (error) {
        return {status:false,message:error}
    }
    
};

exports.deleteMany = async (model, filter) => {
    return await model.deleteMany(filter);
};

// aggregation
exports.aggregate = async (model, query) => {
    return await model.aggregate(query);
};

//distinct values
exports.distinct = async (model, field, query = {}, options = {}) => {
    return await model.distinct(field, query);
};
//distinct values
exports.insertOrUpdate = async (model,body) => {
    try {
        const updateData = await model.updateOne({}, { $set: body }, { upsert: true });
        return {status:true,message:updateData}
    } catch (error) {
        return {status:false,message:error}
    }
    
};
 