const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  guardName: { type: String, required: true },
  systemReserve: { type: Number, default: 0 },
}, { 
  timestamps: true,
  collection: 'roles' 
});

const Role = mongoose.model('Role', roleSchema);

module.exports = Role;
