const express = require("express");
const router = express.Router();
const { jwtVerify } = require("../middleware/jwtUtils");
const { generateSignature } = require("../middleware/cldUtils");

// Route to generate signature
router.get("/signature/:public_id/:eager?", jwtVerify, (req, res) => {
  const { public_id, eager } = req.params;

  // Check if public_id parameter is provided
  if (!public_id) {
    return res
      .status(400)
      .json({ error: "Missing required parameter: public_id" });
  }

  try {
    // Generate the signature using the provided parameters
    const signature = generateSignature(public_id, eager);

    // Respond with the generated signature
    res.status(200).json({ signature });
  } catch (error) {
    // Handle any errors that occur during signature generation
    res.status(500).json({ error: "Error generating signature" });
  }
});

module.exports = router;
