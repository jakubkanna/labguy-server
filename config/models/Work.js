const mongoose = require("mongoose");
const tagsValidator = require("./validators/tagsValidator");
const { singleURLValidator } = require("./validators/URL_Validator");

const Schema = mongoose.Schema;

var WorkSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  medium: [
    {
      type: String,
      default: "",
    },
  ],
  dimensions: String,
  year: {
    type: Number,
    max: 9999,
  },
  images: { type: [Schema.Types.ObjectId], ref: "ImageInstance", default: [] },
  projects: [
    {
      type: Schema.Types.ObjectId,
      ref: "Project",
    },
  ],

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
WorkSchema.pre("save", async function (next) {
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
module.exports = mongoose.model("Work", WorkSchema);
