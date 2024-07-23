require("dotenv").config();
var jsonwebtoken = require("jsonwebtoken");

function issueJWT(user) {
  const _id = user._id;

  const expiresIn = 60000 * 60; //1h

  const payload = {
    sub: _id,
  };

  const signedToken = jsonwebtoken.sign(payload, process.env.SECRET, {
    expiresIn: expiresIn,
    // algorithm: "RS256",
  });

  return {
    token: "Bearer " + signedToken,
    expires: expiresIn,
  };
}

function jwtVerify(req, res, next) {
  const authHeader = req.headers.authorization;

  // Check if the authorization header is present
  if (!authHeader) {
    return res
      .status(401)
      .json({ error: { message: "Authorization header missing" } });
  }

  // The authorization header includes the token in the format "Bearer <token>"
  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: { message: "No auth token" } });
  }

  // Verify the token
  jsonwebtoken.verify(token, process.env.SECRET, function (err) {
    if (err) {
      return res.status(401).json({ error: { message: err.message } });
    }
    // Attach the decoded payload to the request object for use in subsequent middleware/routes
    // req.user = decoded;

    // Proceed to the next middleware or route handler
    next();
  });
}

module.exports = { issueJWT, jwtVerify };
