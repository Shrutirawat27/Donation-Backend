require("dotenv").config();
const app = require("./app");
const connectDB = require("./src/config/db");

const PORT = process.env.PORT || 8000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((err) => {
    console.error("Failed to connect to MongoDB", err);
});
