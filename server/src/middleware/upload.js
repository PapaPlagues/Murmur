import multer from "multer";

const storage = multer.memoryStorage();
const allowedImageTypes = new Set([
  "image/avif",
  "image/gif",
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
    fields: 10,
    parts: 12,
  },
  fileFilter: (req, file, callback) => {
    if (!allowedImageTypes.has(file.mimetype)) {
      const error = new Error("Only raster image uploads are supported");
      error.status = 415;
      return callback(error);
    }

    return callback(null, true);
  },
});

export default upload;
