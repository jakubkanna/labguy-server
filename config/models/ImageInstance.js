const mongoose = require("mongoose");
var { singleURLValidator } = require("./validators/URL_Validator");
const tagsValidator = require("./validators/tagsValidator");

const Schema = mongoose.Schema;

const ImageInstanceShema = new Schema({
  type: { type: String, default: "image", enum: ["image"] },
  etag: { type: String, unique: true, required: true },
  public_id: { type: String, unique: true, required: true },
  original_filename: { type: String, required: true },
  filename: { type: String },
  path: { type: String, required: true },
  format: { type: String },
  dimensions: { height: Number, width: Number },
  bytes: { type: Number },
  url: { type: String, validate: singleURLValidator, required: true },
  secure_url: { type: String, validate: singleURLValidator },
  cld_url: { type: String, validate: singleURLValidator },
  cld_secure_url: { type: String, validate: singleURLValidator },
  tags: { type: [String], validate: tagsValidator, default: [] },
  alt: { type: String, default: "" },
  timestamp: { type: Date, default: Date.now },
  modified: { type: Date },
});

// Pre-save hook to derive fields from original_path
ImageInstanceShema.pre("save", function (next) {
  if (this.original_path) {
    const parts = this.original_path.split(".");
    this.original_filename = parts[0];
    this.format = parts[1];
    this.public_id = this.filename;
  }
  next();
});

module.exports = mongoose.model("ImageInstance", ImageInstanceShema);
// Importing in another file
