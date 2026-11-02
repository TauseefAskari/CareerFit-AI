import Analysis from "../models/Analysis.js";
import { analyzeResume } from "../services/aiService.js";

export async function createAnalysis(req, res, next) {
  try {
    const { resumeText, jobDescription } = req.body;
    const submittedFileName = req.body.resumeFileName ?? req.body.fileName;
    const resumeFileName = typeof submittedFileName === "string"
      ? submittedFileName.trim().slice(0, 255)
      : "";

    // Validate resume text
    if (
      typeof resumeText !== "string" ||
      resumeText.trim().length < 50
    ) {
      return res.status(400).json({
        message: "Please provide valid extracted resume text."
      });
    }

    if (resumeText.length > 20000) {
      return res.status(400).json({
        message: "Resume text cannot exceed 20000 characters."
      });
    }

    // Validate job description
    if (
      typeof jobDescription !== "string" ||
      jobDescription.trim().length < 30
    ) {
      return res.status(400).json({
        message: "Please provide a job description with at least 30 characters."
      });
    }

    if (jobDescription.length > 12000) {
      return res.status(400).json({
        message: "Job description cannot exceed 12000 characters."
      });
    }

    // Generate AI analysis
    const result = await analyzeResume(
      resumeText.trim(),
      jobDescription.trim()
    );

    // Save analysis for the authenticated user
    const analysis = await Analysis.create({
      userId: req.user._id,
      resumeText: resumeText.trim(),
      resumeFileName,
      jobDescription: jobDescription.trim(),
      matchScore: result.matchScore,
      matchedSkills: result.matchedSkills,
      missingSkills: result.missingSkills,
      strengths: result.strengths,
      improvements: result.improvements,
      suggestedSummary: result.suggestedSummary
    });

    return res.status(201).json({
      message: "Resume analysis created successfully.",
      analysis: {
        id: analysis._id,
        resumeFileName: analysis.resumeFileName,
        matchScore: analysis.matchScore,
        matchedSkills: analysis.matchedSkills,
        missingSkills: analysis.missingSkills,
        strengths: analysis.strengths,
        improvements: analysis.improvements,
        suggestedSummary: analysis.suggestedSummary,
        createdAt: analysis.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
}

// Get all analyses belonging to the logged-in user
export async function getAnalyses(req, res, next) {
  try {
    const analyses = await Analysis.find({
      userId: req.user._id
    })
      .select("-resumeText -jobDescription")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      count: analyses.length,
      analyses
    });
  } catch (error) {
    next(error);
  }
}

// Get one analysis belonging to the logged-in user
export async function getAnalysisById(req, res, next) {
  try {
    const { id } = req.params;

    if (!/^[a-f\d]{24}$/i.test(id)) {
      return res.status(400).json({
        message: "Invalid analysis ID."
      });
    }

    const analysis = await Analysis.findOne({
      _id: id,
      userId: req.user._id
    })
      .select("-resumeText -jobDescription")
      .lean();

    if (!analysis) {
      return res.status(404).json({
        message: "Analysis not found."
      });
    }

    return res.status(200).json({ analysis });
  } catch (error) {
    next(error);
  }
}
