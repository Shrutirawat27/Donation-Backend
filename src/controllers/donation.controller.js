const Donation = require("../models/Campaign.model");

const createDonation = async (req, res) => {
    try {
        const { title, description, amount, expiration, email } = req.body;
        const image = req.file?.path || "";

        const donation = await Donation.create({
            title,
            description,
            amount,
            expiration,
            email,
            image,
        });

        res.status(201).json({ message: "Campaign created successfully", donation });
    } catch (error) {
        console.error("Campaign creation error:", error);
        res.status(500).json({ message: "Error creating campaign" });
    }
};

module.exports = { createDonation };