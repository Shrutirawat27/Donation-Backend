const mongoose = require('mongoose'); 

const campaignSchema = new mongoose.Schema({
  title: String,
  description: String,
  amount: Number,
  image: { type: String },
  expiration: Date,
  creatorName: String,
  creatorEmail: String,
  isExpired: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model("Campaign", campaignSchema);