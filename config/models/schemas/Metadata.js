const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var MetaDataSchema = new Schema({
  title: {
    type: String,
    default: "Default Title",
  },
  description: {
    type: String,
    default: "Default description for the homepage.",
  },
});

module.exports = MetaDataSchema;
