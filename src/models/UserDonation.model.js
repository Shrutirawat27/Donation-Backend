const mongoose = require("mongoose");

const userDonationSchema = new mongoose.Schema({
  name: String,
  email: String,
  amount: Number,
  cause: String,
  campaignId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Campaign",
    required: true
  },
}, { timestamps: true });

module.exports = mongoose.model("UserDonation", userDonationSchema);
