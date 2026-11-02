import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  avatarUrl: {
    type: String,
    trim: true,
    default: ""
  },
  avatarFileId: {
    type: String,
    trim: true,
    default: ""
  },
  password: {
    type: String,
    required: true
  },
},
  { timestamps: true });

export default mongoose.model("User", userSchema);
