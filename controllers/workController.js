const asyncHandler = require("express-async-handler");
const Work = require("../config/models/Work");

const workController = {
  get_works: asyncHandler(async (req, res) => {
    const works = await Work.find()
      .sort({ timestamp: -1 })
      .populate("projects")
      .populate("images");
    if (!works || works.length === 0) {
      return res.status(404).json({ message: "Works not found" });
    }
    res.status(200).json(works);
  }),

  get_images: asyncHandler(async (req, res) => {
    const work = await Work.findById(req.params.id).populate("images");

    if (!work) return res.status(404).json({ msg: "Work not found" });

    const images = work.images;
    res.status(200).json([...images]);
  }),

  update_work: asyncHandler(async (req, res) => {
    req.body.modified = Date.now();

    const updatedWork = await Work.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("projects");

    if (!updatedWork) {
      return res.status(404).json({ message: "Work not found" });
    }
    res.status(200).json(updatedWork);
  }),

  create_work: asyncHandler(async (req, res) => {
    const newWork = new Work(req.body);
    await newWork.save();
    res.status(201).json(newWork);
  }),

  delete_work: asyncHandler(async (req, res) => {
    const deletedWork = await Work.findByIdAndDelete(req.params.id);
    if (!deletedWork) {
      return res.status(404).json({ message: "Work not found" });
    }
    res.status(200).json({ message: "Work deleted successfully" });
  }),

  get_medium_list: asyncHandler(async (req, res) => {
    const workMediums = await Work.distinct("medium");
    const allMediums = Array.from(new Set([...workMediums]));
    if (!allMediums) res.status(404).json({ error: { message: "Not found" } });
    res.status(200).json(allMediums);
  }),
};

module.exports = workController;
