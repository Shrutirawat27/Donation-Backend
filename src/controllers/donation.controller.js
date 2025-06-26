const Donation = require("../models/Donation.model");

const submitDonation = async (req, res) => {
    try {
        const { name, email, amount } = req.body;
        const donation = await Donation.create({ name, email, amount });
        res.status(201).json({ message: "Donation recorded", donation });
    } catch (error) {
        console.error("Donation error:", error);
        res.status(500).json({ message: "Error saving donation" });
    }
};

module.exports = { submitDonation };
