import {
  deleteProfilePicture,
  uploadProfilePicture
} from "../services/imagekitService.js";

export function detectAvatarMimeType(buffer) {
  if (
    buffer.length >= 3 &&
    buffer[0] === 0xff &&
    buffer[1] === 0xd8 &&
    buffer[2] === 0xff
  ) {
    return "image/jpeg";
  }

  if (
    buffer.length >= 8 &&
    buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
  ) {
    return "image/png";
  }

  if (
    buffer.length >= 12 &&
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP"
  ) {
    return "image/webp";
  }

  return null;
}

export async function updateAvatar(req, res, next) {
  let uploadedFile;

  try {
    if (!req.file) {
      return res.status(400).json({ message: "Choose a profile picture to upload." });
    }

    const mimeType = detectAvatarMimeType(req.file.buffer);
    if (!mimeType) {
      return res.status(400).json({
        message: "The selected file is not a valid JPEG, PNG, or WebP image."
      });
    }

    const previousFileId = req.user.avatarFileId;
    uploadedFile = await uploadProfilePicture({
      buffer: req.file.buffer,
      mimeType,
      userId: req.user._id.toString()
    });

    req.user.avatarUrl = uploadedFile.url;
    req.user.avatarFileId = uploadedFile.fileId;
    await req.user.save();

    let warning;
    if (previousFileId && previousFileId !== uploadedFile.fileId) {
      try {
        await deleteProfilePicture(previousFileId);
      } catch (cleanupError) {
        console.error("Failed to remove replaced ImageKit profile picture:", cleanupError.message);
        warning = "Your new picture is saved, but the previous picture could not be removed from ImageKit.";
      }
    }

    return res.status(200).json({
      message: "Profile picture updated successfully.",
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        avatarUrl: req.user.avatarUrl
      },
      warning
    });
  } catch (error) {
    if (uploadedFile) {
      try {
        await deleteProfilePicture(uploadedFile.fileId);
      } catch (cleanupError) {
        console.error("Failed to clean up an unlinked ImageKit profile picture:", cleanupError.message);
      }
    }

    next(error);
  }
}

export async function removeAvatar(req, res, next) {
  const previousFileId = req.user.avatarFileId;

  try {
    req.user.avatarUrl = "";
    req.user.avatarFileId = "";
    await req.user.save();

    let warning;
    if (previousFileId) {
      try {
        await deleteProfilePicture(previousFileId);
      } catch (cleanupError) {
        console.error("Failed to remove ImageKit profile picture:", cleanupError.message);
        warning = "Your profile picture was removed, but its ImageKit file could not be deleted.";
      }
    }

    return res.status(200).json({
      message: "Profile picture removed.",
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        avatarUrl: ""
      },
      warning
    });
  } catch (error) {
    next(error);
  }
}
