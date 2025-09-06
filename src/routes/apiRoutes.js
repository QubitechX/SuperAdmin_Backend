const express = require("express");
const admin = require("./adminRoutes");
const router = express();
router.use("/admin", admin);
module.exports = router;
