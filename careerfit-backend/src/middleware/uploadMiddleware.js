import multer from "multer";

const maxUploadMb = Number(process.env.MAX_UPLOAD_MB || 5);
const maxUploadBytes = maxUploadMb * 1024 * 1024;
const allowedExtensions = /\.(pdf|docx)$/i;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: maxUploadBytes,
    files: 1
  },
  fileFilter: (req, file, callback) => {
    if (!allowedExtensions.test(file.originalname)) {
      return callback(
        new Error("Only PDF and DOCX files are supported. Legacy DOC files are not supported.")
      );
    }
    callback(null, true);
  }
});

export default upload;
