var validate = require("mongoose-validator");
var validator = require("validator");

var tagsValidator = [
  validate({
    validator: function (tags) {
      // Check if all tags are lowercase strings
      const areLowercase = tags.every(
        (tag) => typeof tag === "string" && validator.isLowercase(tag)
      );
      // Check for duplicates in the tags array
      const uniqueTags = [...new Set(tags)];
      const areUnique = uniqueTags.length === tags.length;

      // Check if all tags are not empty strings
      const areNotEmpty = tags.every((tag) => tag.trim().length > 0);

      // Check if all tags contain only letters and numbers
      const areAlphanumeric = tags.every((tag) => /^[a-zA-Z0-9]+$/.test(tag));

      if (!areLowercase) {
        return false;
      }

      if (!areUnique) {
        return false;
      }

      if (!areNotEmpty) {
        return false;
      }

      if (!areAlphanumeric) {
        return false;
      }

      // All conditions passed
      return true;
    },
    message:
      "Tags should be lowercase strings, not empty, unique, and contain only letters and numbers.",
  }),
];

module.exports = tagsValidator;
