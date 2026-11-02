import ImageKit, { toFile } from "@imagekit/nodejs";
import { randomUUID } from "node:crypto";

export class ImageKitStorageError extends Error {
  constructor(message, statusCode, cause) {
    super(message, { cause });
    this.name = "ImageKitStorageError";
    this.statusCode = statusCode;
  }
}

function getImageKitClient() {
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  if (!privateKey) {
    throw new ImageKitStorageError(
      "Profile picture storage is not configured. Set IMAGEKIT_PRIVATE_KEY in the backend environment.",
      503
    );
  }

  return new ImageKit({ privateKey });
}

export async function uploadProfilePicture({ buffer, mimeType, userId }) {
  const extensions = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp"
  };
  const extension = extensions[mimeType];

  if (!extension) {
    throw new ImageKitStorageError("Unsupported profile picture format.", 400);
  }

  try {
    const fileName = `careerfit-avatar-${userId}-${randomUUID()}.${extension}`;
    const file = await toFile(buffer, fileName, { type: mimeType });
    const result = await getImageKitClient().files.upload({
      file,
      fileName,
      folder: "/careerfit/avatars",
      useUniqueFileName: false,
      tags: ["careerfit-avatar"]
    });

    if (!result.fileId || !result.url) {
      throw new Error("ImageKit returned an incomplete upload response.");
    }

    return { fileId: result.fileId, url: result.url };
  } catch (error) {
    if (error instanceof ImageKitStorageError) throw error;

    throw new ImageKitStorageError(
      "ImageKit could not upload the profile picture. Please try again.",
      502,
      error
    );
  }
}

export async function deleteProfilePicture(fileId) {
  if (!fileId) return;

  try {
    await getImageKitClient().files.delete(fileId);
  } catch (error) {
    if (error.status === 404 || error.statusCode === 404) return;
    if (error instanceof ImageKitStorageError) throw error;

    throw new ImageKitStorageError(
      "ImageKit could not delete the previous profile picture.",
      502,
      error
    );
  }
}
