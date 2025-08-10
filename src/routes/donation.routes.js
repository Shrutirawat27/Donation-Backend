const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Donation = require("../models/Campaign.model");
const UserDonation = require("../models/UserDonation.model");
const upload = require("../middleware/upload");

// Create a donation campaign
router.post("/donations", upload.single("image"), async (req, res) => {
  try {
    const { title, description, amount, expiration, creatorName, creatorEmail } = req.body;
    const imagePath = req.file ? req.file.path : "";

    const newDonation = new Donation({
      title,
      description,
      amount,
      expiration,
      image: imagePath,
      creatorName,
      creatorEmail,
    });

    await newDonation.save();
    res.status(201).json({ message: "Donation campaign created", data: newDonation });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create campaign" });
  }
});

// Save a donation record by user
router.post("/donate", async (req, res) => {
  try {
    const { name, email, amount, cause, campaignId } = req.body;

    if (!name || !email || !amount || !campaignId) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (!mongoose.Types.ObjectId.isValid(campaignId)) {
      return res.status(400).json({ error: "Invalid campaignId" });
    }

    console.log("New donation for campaign:", campaignId, "Amount:", amount);

    const donation = new UserDonation({ name, email, amount, cause, campaignId });
    await donation.save();

    res.status(201).json({ message: "Donation recorded", donation });
  } catch (err) {
    console.error("Donation Error:", err);
    res.status(500).json({ error: "Failed to record donation" });
  }
});

// Get donations made by a specific user
router.get("/my-donations", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: "Email is required" });

    const records = await UserDonation.find({ email }).sort({ createdAt: -1 });
    res.json(records);
  } catch (err) {
    console.error("Fetch Error:", err);
    res.status(500).json({ error: "Could not fetch donations" });
  }
});

// Get donation campaigns created by a specific user
router.get("/my-campaigns", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: "Email is required" });

    const campaigns = await Donation.find({ creatorEmail: email }).sort({ createdAt: -1 });

    const donationSums = await UserDonation.aggregate([
      {
        $match: {
          campaignId: { $in: campaigns.map(c => c._id) }
        }
      },
      {
        $group: {
          _id: "$campaignId",
          totalDonated: { $sum: "$amount" }
        }
      }
    ]);

    const donationMap = {};
    donationSums.forEach((d) => {
      donationMap[d._id.toString()] = d.totalDonated;
    });

    const result = campaigns.map((c) => {
      const totalDonated = donationMap[c._id.toString()] || 0;
      const expired = new Date(c.expiration) < new Date();
      return {
        ...c._doc,
        totalDonated,
        expired
      };
    });

    res.json(result);
  } catch (err) {
    console.error("Campaign Fetch Error:", err);
    res.status(500).json({ error: "Could not fetch campaigns" });
  }
});

// Delete a donation campaign by ID
router.delete("/donations/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Donation.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ error: "Campaign not found" });
    }

    res.json({ message: "Campaign deleted successfully" });
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ error: "Failed to delete campaign" });
  }
});

// Get all donation campaigns with totalDonated and expiration status
router.get("/donations", async (req, res) => {
  try {
    const campaigns = await Donation.find().sort({ createdAt: -1 });

    const donationSums = await UserDonation.aggregate([
      {
        $group: {
          _id: "$campaignId",
          totalDonated: { $sum: "$amount" }
        }
      }
    ]);

    const donationMap = {};
    donationSums.forEach((d) => {
      if (d._id) {
        donationMap[d._id.toString()] = d.totalDonated;
      }
    });

    const result = campaigns.map((c) => {
      const totalDonated = donationMap[c._id.toString()] || 0;
      const expired = new Date(c.expiration) < new Date();

      return {
        ...c._doc,
        totalDonated,
        expired,
      };
    });

    res.json(result);
  } catch (err) {
    console.error("Fetch all campaigns error:", err);
    res.status(500).json({ error: "Could not fetch campaigns" });
  }
});

// Get a single donation campaign by ID
router.get("/donations/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const campaign = await Donation.findById(id);
    
    if (!campaign) {
      return res.status(404).json({ error: "Campaign not found" });
    }

    res.json(campaign);
  } catch (err) {
    console.error("Fetch by ID Error:", err);
    res.status(500).json({ error: "Failed to fetch campaign" });
  }
});

// Update donation campaign
router.put("/donations/:id", async (req, res) => {
  try {
    const updated = await Donation.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: "Campaign not found" });
    res.json({ message: "Campaign updated", data: updated });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ error: "Failed to update campaign" });
  }
});

module.exports = router;