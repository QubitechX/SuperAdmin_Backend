const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  guardName: { type: String, required: true },
}, { 
  timestamps: true,
  collection: 'permissions' 
});

const Permission = mongoose.model('Permission', permissionSchema);

module.exports = Permission;
