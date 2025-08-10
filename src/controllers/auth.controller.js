const User = require("../models/User.model");
const bcrypt = require("bcryptjs");

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ name, email, password: hashedPassword });

        res.status(201).json({ message: "User registered", user: newUser });
    } catch (error) {
        console.error("Register error:", error);
        res.status(500).json({ message: "Error registering user" });
    }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(401).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });

    // Return only necessary user fields to client
    res.json({
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage || null,  // include profileImage here
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Login error" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.params.id; // get user ID from URL
    const { name, profileImage } = req.body; // get updated info from request body

    // Find user by ID and update name and profileImage
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, profileImage },
      { new: true } // return the updated user document
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Send updated user data back to client
    res.json({
      message: "Profile updated successfully",
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        profileImage: updatedUser.profileImage || null,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Error updating profile" });
  }
};


module.exports = { register, login, updateProfile };
