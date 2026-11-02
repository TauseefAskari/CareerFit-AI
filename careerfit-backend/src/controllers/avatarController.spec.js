import test from "node:test";
import assert from "node:assert/strict";
import { detectAvatarMimeType } from "./avatarController.js";

test("detectAvatarMimeType recognizes JPEG, PNG, and WebP signatures", () => {
  const webp = Buffer.alloc(12);
  webp.write("RIFF", 0, "ascii");
  webp.write("WEBP", 8, "ascii");

  assert.equal(detectAvatarMimeType(Buffer.from([0xff, 0xd8, 0xff])), "image/jpeg");
  assert.equal(
    detectAvatarMimeType(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])),
    "image/png"
  );
  assert.equal(detectAvatarMimeType(webp), "image/webp");
});

test("detectAvatarMimeType rejects unsupported and truncated signatures", () => {
  assert.equal(detectAvatarMimeType(Buffer.from("not an image")), null);
  assert.equal(detectAvatarMimeType(Buffer.from([0xff, 0xd8])), null);
});
