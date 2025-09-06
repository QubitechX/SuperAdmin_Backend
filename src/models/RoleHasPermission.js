const mongoose = require('mongoose');

const roleHasPermissionSchema = new mongoose.Schema({
    permissionId: { type: String,ref: "permissions",  required: true },
    roleId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
  }, { timestamps: true });

const RoleHasPermission  = mongoose.model('RoleHasPermission', roleHasPermissionSchema);
module.exports = RoleHasPermission  ;
