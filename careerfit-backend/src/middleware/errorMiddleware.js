import multer from "multer";

export function notFound(req, res, next) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

export function errorHandler(error, req, res, next) {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      if (error.field === "avatar") {
        return res.status(413).json({ message: "Profile pictures must be 5 MB or smaller." });
      }
      return res.status(413).json({ message: "File size must not exceed the configured upload limit." });
    }
    if (error.code === "LIMIT_FILE_COUNT" || error.code === "LIMIT_UNEXPECTED_FILE") {
      if (error.field === "avatar") {
        return res.status(400).json({ message: "Upload one profile picture using the 'avatar' field." });
      }
      return res.status(400).json({ message: "Upload only one resume file using the field name 'resume'." });
    }
    return res.status(400).json({ message: "Invalid file upload." });
  }

  if (
    error.message?.includes("Only PDF") ||
    error.message?.includes("Legacy .doc") ||
    error.message?.includes("not a valid") ||
    error.message?.includes("Very little readable") ||
    error.message?.includes("Unsupported file format") ||
    error.message?.includes("Only JPEG, PNG, and WebP profile pictures")
  ) {
    return res.status(400).json({ message: error.message });
  }

  if (Number.isInteger(error.statusCode) && error.statusCode >= 400 && error.statusCode < 600) {
    if (error.statusCode >= 500) console.error(error);
    return res.status(error.statusCode).json({ message: error.message });
  }

  console.error(error);
  return res.status(500).json({ message: "An unexpected server error occurred." });
}
