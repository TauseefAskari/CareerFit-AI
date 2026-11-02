import { extractResumeText } from "../services/resumeService.js";

export async function uploadResume(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Select one PDF or DOCX resume to upload."
      });
    }

    const resumeText = await extractResumeText(req.file);

    return res.status(200).json({
      message: "Resume text extracted successfully.",
      fileName: req.file.originalname,
      resumeText
    });
  } catch (error) {
    next(error);
  }
}
