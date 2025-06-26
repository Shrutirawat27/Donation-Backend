require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");

const app = express();

// Middleware
app.use(cors({
  origin: "https://donation-frontend-eight.vercel.app",
  credentials: true
}));

app.use(express.json());
app.use(helmet());
app.use('/uploads', (req, res, next) => {
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  next();
}, express.static(path.join(__dirname, 'uploads')));


// Routes
const homeRoutes = require("./src/routes/home.routes");
const checkoutRoutes = require("./src/routes/checkout.routes");
const authRoutes = require("./src/routes/auth.routes");
const donationRoutes = require("./src/routes/donation.routes");

app.use("/api/v1", homeRoutes);
app.use("/api/v1", checkoutRoutes);
app.use("/api/v1", authRoutes);
app.use("/api/v1", donationRoutes);

app.get("/", (req, res) => {
  res.send("API is working...");
});

module.exports = app;
