const asyncHandler = require("express-async-handler");
const Project = require("../config/models/Project");

const ProjectController = {
  get_Projects: asyncHandler(async (req, res) => {
    const Projects = await Project.find()
      .sort({ timestamp: -1 })
      .populate("images");
    if (!Projects) {
      return res.status(404).json({ message: "Projects not found" });
    }
    res.status(200).json(Projects);
  }),

  get_Project: asyncHandler(async (req, res) => {
    const Project = await Project.findById(req.params.id).populate("images");
    if (!Project) return res.status(404).json({ message: "Project not found" });
    res.status(200).json(Project);
  }),

  get_images: asyncHandler(async (req, res) => {
    const Project = await Project.findById(req.params.id).populate("images");

    if (!Project) {
      return res.status(404).json({ msg: "Project not found" });
    }

    const images = Project.images;
    res.status(200).json([...images]);
  }),

  update_Project: asyncHandler(async (req, res) => {
    req.body.modified = Date.now();

    if (req.body.post === "") req.body.post = null;

    const updatedProject = await Project.findOneAndUpdate(
      { _id: req.params.id },
      { $set: req.body },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedProject)
      return res.status(404).json({ message: "Project not found" });

    res.status(200).json(updatedProject);
  }),

  create_Project: asyncHandler(async (req, res) => {
    const newProject = new Project(req.body);
    await newProject.save();
    res.status(201).json(newProject);
  }),

  delete_Project: asyncHandler(async (req, res) => {
    const deletedProject = await Project.findByIdAndDelete(req.params.id);
    if (!deletedProject)
      return res.status(404).json({ message: "Project not found" });

    res.status(200).json({ message: "Project deleted successfully" });
  }),
};
module.exports = ProjectController;
