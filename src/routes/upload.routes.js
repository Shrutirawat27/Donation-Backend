const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

router.get("/test-upload-route", (req, res) => {
  res.json({ message: "Upload routes are connected" });
});

router.post("/upload-image", upload.single("image"), (req, res) => {
    console.log("Upload endpoint hit");
  try {
    console.log("File upload middleware ran");
    
    if (!req.file) {
      console.log("No file received in req.file");
      return res.status(400).json({ message: "No file uploaded" });
    }

    console.log("File uploaded to Cloudinary at:", req.file.path);
    res.json({ imageUrl: req.file.path });
  } catch (error) {
    console.error("Image upload error:", error);
    res.status(500).json({ message: "Image upload failed" });
  }
});

module.exports = router;
