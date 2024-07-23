var validate = require("mongoose-validator");
var validator = require("validator");

// Validator for array of URLs
var arrayURLValidator = [
  validate({
    validator: function (array) {
      if (!Array.isArray(array)) {
        return false;
      }
      const options = {
        protocols: ["http", "https"], // Only allow http and https protocols
        require_protocol: true, // Require the protocol (e.g., http://)
        require_valid_protocol: true, // Only validate URLs with valid protocols
        require_host: true, // Require the host in the URL
        require_tld: false, // Require top-level domain (e.g., .com, .org)
      };
      return array.every((url) => validator.isURL(url, options));
    },
    message: "Each URL must be valid and follow the required format.",
  }),
];

// Validator for single URL string
var singleURLValidator = [
  validate({
    validator: function (url) {
      const options = {
        protocols: ["http", "https"],
        require_protocol: true,
        require_valid_protocol: true,
        require_host: true,
        require_tld: false,
      };
      return validator.isURL(url, options);
    },
    message: "Must be a valid URL.",
  }),
];

module.exports = {
  arrayURLValidator,
  singleURLValidator,
};
