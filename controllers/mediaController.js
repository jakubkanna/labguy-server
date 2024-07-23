const asyncHandler = require("express-async-handler");
const ImageInstance = require("../config/models/ImageInstance");
const VideoInstance = require("../config/models/VideoInstance");

const mediaController = {
  get_all_media: asyncHandler(async (req, res) => {
    const images = await ImageInstance.find();
    const videos = await VideoInstance.find();

    if (!images && !videos) {
      return res.status(404).json({ message: "Media not found" });
    }

    const allMedia = [...images, ...videos];

    res.status(200).json(allMedia);
  }),
};

module.exports = mediaController;
