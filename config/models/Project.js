// models/Project.js
var mongoose = require("mongoose");
var tagsValidator = require("./validators/tagsValidator");
var { singleURLValidator } = require("./validators/URL_Validator");

var Schema = mongoose.Schema;

const URLSchema = new Schema({
  url: {
    type: String,
    validate: singleURLValidator,
    default: "https://example.com/dogs",
  },
});

var ProjectSchema = new Schema({
  title: { type: String, required: [true, "Title is required."], minLength: 3 },
  subtitle: String,
  description: String,
  start_date: { type: Date },
  end_date: {
    type: Date,
    validate: {
      validator: function (value) {
        if (this.get("start_date") && value) {
          return value >= this.get("start_date");
        } else {
          return false;
        }
      },
      message: "End date must be equal to or later than start date.",
    },
  },
  venue: { type: String },
  tags: { type: [String], validate: tagsValidator, default: [] },
  images: { type: [Schema.Types.ObjectId], ref: "ImageInstance", default: [] },
  external_urls: [URLSchema],

  slug: { type: String, unique: true },
  metadata: {
    title: {
      type: String,
      default: "Default Title",
    },
    description: {
      type: String,
      default: "Default description for the homepage.",
    },
  },
  tags: { type: [String], default: [] },
  public: { type: Boolean, default: true },
  timestamp: { type: Date, default: Date.now },
  modified: { type: Date },
});

// generate the slug
ProjectSchema.pre("save", async function (next) {
  const formattedTitle = this.title
    .toLowerCase()
    .split(" ")
    .join("-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  //every time formatted title is found, update add it's number on the end
  let slug = formattedTitle;
  let num = 2;
  let schema = await this.constructor.findOne({ slug });

  while (schema) {
    slug = `${formattedTitle}-${num}`;
    schema = await this.constructor.findOne({ slug });
    num++;
  }

  this.slug = slug;

  next();
});
module.exports = mongoose.model("Project", ProjectSchema);
