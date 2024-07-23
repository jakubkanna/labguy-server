const asyncHandler = require("express-async-handler");
const VideoInstance = require("../config/models/VideoInstance");

const videoInstanceController = {
  //create
  create_video: asyncHandler(async (req, res) => {
    const { etag } = req.body;

    // Check if an video with the same etag already exists
    const existingVideo = await VideoInstance.findOne({ etag });

    if (existingVideo) {
      // If an video with the same etag exists, update its details
      await VideoInstance.updateOne({ etag }, req.body);

      // Fetch the updated video
      const updatedVideo = await VideoInstance.findOne({ etag });

      res.status(200).json(updatedVideo);
    } else {
      // If no existing video found with the same _id, create a new one
      const newVideo = new VideoInstance(req.body);

      await newVideo.save();

      res.status(201).json(newVideo);
    }
  }),

  //read
  get_videos: asyncHandler(async (req, res) => {
    const videos = await VideoInstance.find().sort({ timestamp: -1 });
    if (!videos || videos.length === 0) {
      return res.status(404).json({ message: "Videos not found" });
    }
    res.status(200).json(videos);
  }),

  //update
  update_video: asyncHandler(async (req, res) => {
    req.body.modified = Date.now();

    const updatedVideo = await VideoInstance.findOneAndUpdate(
      { _id: req.body._id },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedVideo) {
      return res.status(404).json({ message: "Video not found" });
    }

    res.status(200).json(updatedVideo);
  }),

  //delete
  delete_videos: asyncHandler(async (req, res) => {
    const selected = req.body;

    console.log(`Number of videos to delete: ${selected.length}`);
    for (const video of selected) {
      const { _id } = video;

      await VideoInstance.findByIdAndDelete(_id);
    }
    console.log("All selected videos have been deleted.");
    res.status(200).json({ message: "Videos deleted successfully." });
  }),
};

module.exports = videoInstanceController;
