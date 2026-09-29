import { fileTypeFromBuffer } from "file-type";

const allowedImageTypes = new Set([
  "image/avif",
  "image/gif",
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export const isAllowedImageUpload = async (file) => {
  const detectedType = await fileTypeFromBuffer(file.buffer);

  return (
    detectedType &&
    allowedImageTypes.has(detectedType.mime) &&
    detectedType.mime === file.mimetype
  );
};