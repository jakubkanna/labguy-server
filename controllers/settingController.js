const asyncHandler = require("express-async-handler");
const Setting = require("../config/models/Setting");

const settingController = {
  get_settings: asyncHandler(async (req, res) => {
    const latestSetting = await Setting.find()
      .sort({ modified: -1 })
      .limit(1)
      .populate("general.website.details.favicon")
      .populate("general.website.homepage.background");
    if (!latestSetting) {
      return res.status(404).json({ message: "Settings not found" });
    }

    res.json(latestSetting[0]);
  }),
  update_settings: asyncHandler(async (req, res) => {
    req.body.modified = Date.now();
    const updatedItem = await Setting.findOneAndUpdate(
      { _id: req.body._id },
      { $set: req.body },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedItem)
      return res.status(404).json({ message: "Setting not found" });

    res.status(200).json(updatedItem);
  }),
};

module.exports = settingController;
