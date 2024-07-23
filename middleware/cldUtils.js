const cloudinary = require("cloudinary").v2;
require("dotenv").config();

function generateSignature(public_id, eager) {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const signature = cloudinary.utils.api_sign_request(
    { timestamp, eager, public_id },
    process.env.CLD_API_SECRET
  );
  return signature;
}

module.exports = { generateSignature };
