require("dotenv").config();
const express = require("express");
const apiRoutes = require("./src/routes/apiRoutes");
const Helpers = require("./src/config/helpers.js");
const multer = require("multer");
const bodyParser = require("body-parser");
const upload = multer({ dest: "uploads/" });
const cors = require("cors");
const path = require("path");
const connectDB = require('./src/config/database.js');
connectDB();
//const generateModels = require("./src/models/generateModels.js");
const app = express();
app.set("views", path.join(__dirname, "views"));
var dir = path.join(__dirname, 'public');
app.use(express.static(dir));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));
app.use(
  cors({
    origin: true,
  })
);
// API Key Middleware
// function apiKeyMiddleware(req, res, next) {
//   if (req.originalUrl.startsWith('/api/v1/callback')) {
//     return next();
//   }


//   const apiKey = req.headers["api-key"];
//   const userType = req.headers["user-type"];
//   if (!apiKey) {
//     return res
//       .status(403)
//       .json({ message: "Unauthorized: API Key is missing" });
//   }
//   if (apiKey !== process.env.API_KEY) {
//     return res.status(403).json({ message: "Unauthorized: Invalid API Key" });
//   }
//   next();
// }
// // Route for sizeImage.png with middleware

//app.use(apiKeyMiddleware);


// Serve other static assets
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use("/api/v1", apiRoutes);

// Handle unsupported routes
app.all("*", (req, res) => {
  return Helpers.response(res, req, 404, false, "Page Not Found !!", {});
});

// Start the server
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  server.close(() => {
    console.log("Process terminated gracefully");
  });
});
