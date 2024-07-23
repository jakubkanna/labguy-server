const asyncHandler = require("express-async-handler");
const ImageInstance = require("../config/models/ImageInstance");
const sizeOf = require("image-size");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;

const uploadImage = asyncHandler(async (file, host) => {
  const dimensions = sizeOf(file.path);
  const newImage = {
    public_id: file.filename,
    original_filename: file.originalname,
    filename: file.filename,
    path: file.path,
    format: file.mimetype.split("/")[1],
    dimensions: dimensions,
    url: `http://${host}/images/${file.filename}.${file.format}`,
    secure_url: `https://${host}/images/${file.filename}.${file.format}`,
    bytes: file.size,
    etag: file.etag,
  };

  let imageInstance = await ImageInstance.findOne({
    public_id: newImage.public_id,
  });

  if (imageInstance) {
    // Update the existing image instance
    imageInstance = await ImageInstance.findOneAndUpdate(
      { public_id: newImage.public_id },
      newImage,
      { new: true }
    );
  } else {
    // Create a new image instance
    imageInstance = new ImageInstance(newImage);
    imageInstance = await imageInstance.save();
  }

  // Upload to Cloudinary
  const cloudinaryResponse = await cloudinary.uploader.upload(file.path, {
    public_id: newImage.public_id,
    overwrite: true,
  });

  // Update the image instance with Cloudinary URLs
  imageInstance = await ImageInstance.findOneAndUpdate(
    { public_id: newImage.public_id },
    {
      cld_url: cloudinaryResponse.url,
      cld_secure_url: cloudinaryResponse.secure_url,
      etag: cloudinaryResponse.etag,
    },
    { new: true }
  );

  return imageInstance; // Return the updated image instance
});

const imageInstanceController = {
  //create
  create_image: asyncHandler(async (req, res) => {
    const { public_id } = req.body;

    // Check if an image with the same public_id already exists
    const existingImage = await ImageInstance.findOne({ public_id });

    if (existingImage) {
      // If an image with the same public_id exists, update its details
      await ImageInstance.updateOne({ public_id }, req.body);

      // Fetch the updated image
      const updatedImage = await ImageInstance.findOne({ public_id });

      res.status(200).json(updatedImage);
    } else {
      // If no existing image found with the same public_id, create a new one
      const newImage = new ImageInstance(req.body);
      await newImage.save();

      res.status(201).json(newImage);
    }
  }),

  // Upload images
  upload_image: asyncHandler(async (req, res) => {
    const files = req.files;
    const host = req.get("host");

    console.log("Received files:", files); // Check if files are properly received

    if (files.length < 1) throw new Error("No files received");

    const imageInstances = await Promise.all(
      files.map((file) => uploadImage(file, host))
    );

    console.log("Uploaded image instances:", imageInstances);

    res.status(201).json(imageInstances);
  }),

  //read
  get_images: asyncHandler(async (req, res) => {
    const images = await ImageInstance.find().sort({ timestamp: -1 });
    if (!images || images.length === 0) {
      return res.status(404).json({ message: "Images not found" });
    }
    res.status(200).json(images);
  }),

  //update
  update_image: asyncHandler(async (req, res) => {
    req.body.modified = Date.now();

    const updatedImage = await ImageInstance.findOneAndUpdate(
      { _id: req.body._id },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedImage) {
      return res.status(404).json({ message: "Image not found" });
    }

    res.status(200).json(updatedImage);
  }),

  //delete
  delete_images: asyncHandler(async (req, res) => {
    const selectedImages = req.body;

    for (const image of selectedImages) {
      const { public_id } = image;

      //  Delete from Cloudinary
      await cloudinary.uploader.destroy(public_id);

      // Delete the file
      await fs.promises.unlink(image.path);

      // Delete the image instance from the database
      await ImageInstance.deleteOne({ public_id });
    }

    res.status(200).json({ message: "Images deleted successfully." });
  }),
};

module.exports = imageInstanceController;
