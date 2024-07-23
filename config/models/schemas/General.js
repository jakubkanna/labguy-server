const mongoose = require("mongoose");
const MetaDataSchema = require("./Metadata");
const Schema = mongoose.Schema;

var GeneralSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  slug: { type: String, unique: true },
  public: { type: Boolean, default: true },
  tags: { type: [String], default: [] },
  metadata: MetaDataSchema,
});

module.exports = GeneralSchema;
