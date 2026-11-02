import mongoose from "mongoose";

const analysisSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  resumeText: { type: String, required: true, maxlength: 20000 },
  resumeFileName: { type: String, trim: true, maxlength: 255, default: "" },
  jobDescription: { type: String, required: true, maxlength: 12000 },
  matchScore: { type: Number, min: 0, max: 100 },
  matchedSkills: [String],
  missingSkills: [String],
  strengths: [String],
  improvements: [String],
  suggestedSummary: String
}, { timestamps: true });

export default mongoose.model("Analysis", analysisSchema);
