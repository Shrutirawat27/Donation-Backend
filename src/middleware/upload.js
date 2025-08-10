const multer = require("multer");
const { storage } = require("../config/cloudinary");

const upload = multer({ storage });
console.log("Upload middleware loaded");

module.exports = upload;