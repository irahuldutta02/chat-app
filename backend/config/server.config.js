const dotenv = require("dotenv");
dotenv.config();
const PORT = process.env.PORT || 3001;
const CLIENT_BASE_URL= process.env.CLIENT_BASE_URL || "http://localhost:5173";

module.exports = { PORT, CLIENT_BASE_URL };
