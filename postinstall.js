require("dotenv").config();

const mongoose = require("mongoose");
const Setting = require("./config/models/Setting");

// MongoDB connection URI
const mongoURI = process.env.DB_STRING;

// Connect to MongoDB
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create a function to set default settings
async function createDefaultSettings() {
  console.log("Creating default settings document");
  try {
    const defaultSettings = new Setting({});
    const savedSetting = await defaultSettings.save();
    console.log(
      "Default settings created. Document:",
      JSON.stringify(savedSetting, null, 2)
    );
  } catch (error) {
    console.error("Error creating default settings:", error);
  } finally {
    mongoose.disconnect();
  }
}

// Execute the function to create default settings
createDefaultSettings();
