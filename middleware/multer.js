const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const crypto = require("crypto");
const fs = require("fs");

// Check file type
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Allowed file extensions are (jpeg, jpg, png, gif)");
  }
}

// Storage configuration for Multer
const storage = multer.memoryStorage(); // Store the file in memory temporarily

// Create Multer instance with configured storage and error handling
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB file size limit
  },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).array("files"); // Updated to handle multiple files

// Function to calculate etag
const calculateEtag = (filePath) => {
  const fileBuffer = fs.readFileSync(filePath);
  const hashSum = crypto.createHash("md5");
  hashSum.update(fileBuffer);
  return hashSum.digest("hex");
};

// Middleware to process image with Sharp
const processImage = (req, res, next) => {
  if (!req.files) {
    return next();
  }

  const processedFiles = req.files.map((file) => {
    return new Promise((resolve, reject) => {
      // Get the original filename and extension
      const originalname = file.originalname;

      // Separate and remove spaces
      const parsed = path.parse(originalname);
      const ofilenameSanitized = originalname.replace(/\s/g, "_");
      const extname = parsed.ext;
      const filename = parsed.name.replace(/\s/g, "_");

      // Determine the output path with the correct filename and extension
      const outputPath = path.join(
        __dirname,
        "../public/images",
        ofilenameSanitized
      );

      // Proceed with image processing using Sharp
      sharp(file.buffer)
        .metadata()
        .then((metadata) => {
          const width = metadata.width;
          const height = metadata.height;
          const resizeOptions = {};

          if (width > 2160 || height > 2160) {
            if (width > height) {
              resizeOptions.width = 2160;
            } else {
              resizeOptions.height = 2160;
            }
          }

          return sharp(file.buffer)
            .resize(resizeOptions)
            .toFormat("jpeg")
            .jpeg({ quality: 80 })
            .toFile(outputPath);
        })
        .then((info) => {
          // Calculate etag for the processed file
          const etag = calculateEtag(outputPath);

          // Attach additional properties to req.files for further processing if needed
          file.filename = filename;
          file.path = outputPath;
          file.size = info.size;
          file.format = extname;
          file.etag = etag;
          resolve(file);
        })
        .catch((err) => {
          reject(err);
        });
    });
  });

  Promise.all(processedFiles)
    .then((files) => {
      req.files = files;
      next();
    })
    .catch((err) => {
      next(err); // Pass any errors to the error handling middleware
    });
};

module.exports = { upload, processImage };
