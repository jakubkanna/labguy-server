const asyncHandler = require("express-async-handler");
const User = require("../config/models/user");
const validPassword = require("../middleware/passwordUtils").validPassword;
const { issueJWT } = require("../middleware/jwtUtils");

const userController = {
  // auth

  post_login: asyncHandler(async (req, res) => {
    const user = await User.findOne({ username: req.body.username });
    if (!user)
      res.status(401).json({
        success: false,
        message: "Could not find user " + req.body.username,
      });

    const isValid = validPassword(req.body.password, user.hash, user.salt);

    if (isValid) {
      const jwt = issueJWT(user);
      res.status(200).json({
        success: true,
        user: { username: user.username },
        token: jwt.token,
        expiresIn: jwt.expires,
      });
    } else {
      throw new Error("Wrong password or login");
    }
  }),
};

module.exports = userController;
