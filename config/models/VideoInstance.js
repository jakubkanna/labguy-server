const mongoose = require("mongoose");
const { singleURLValidator } = require("./validators/URL_Validator");
const Schema = mongoose.Schema;

const VideoInstanceSchema = new Schema({
  type: { type: String, default: "video", enum: ["video"] },
  etag: { type: String, unique: true, required: true },
  yt_url: { type: String, required: true, validate: singleURLValidator },
  title: {
    type: String,
    required: true,
  },
  tags: {
    type: [String],
    default: [],
  },
  thumbnails: {
    default: {
      url: { type: String, required: true },
      width: { type: Number, required: true },
      height: { type: Number, required: true },
    },
    medium: {
      url: { type: String, required: true },
      width: { type: Number, required: true },
      height: { type: Number, required: true },
    },
    high: {
      url: { type: String, required: true },
      width: { type: Number, required: true },
      height: { type: Number, required: true },
    },
    standard: {
      url: { type: String, required: true },
      width: { type: Number, required: true },
      height: { type: Number, required: true },
    },
    maxres: {
      url: { type: String, required: true },
      width: { type: Number, required: true },
      height: { type: Number, required: true },
    },
  },
  description: {
    type: String,
    required: true,
  },
  publishedAt: {
    type: Date,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  definition: {
    type: String,
    required: true,
  },
  timestamp: { type: Date, default: Date.now },
  modified: { type: Date },
});

module.exports = mongoose.model("VideoInstance", VideoInstanceSchema);
