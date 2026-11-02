import test from "node:test";
import assert from "node:assert/strict";
import { updateProfile } from "./authController.js";

function createResponse() {
  return {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    }
  };
}

test("updateProfile saves only the name and returns the unchanged email", async () => {
  let saveCalls = 0;
  const req = {
    body: { name: "  Alex Candidate  ", email: "change@example.com" },
    user: {
      _id: "user-1",
      name: "Old Name",
      email: "original@example.com",
      avatarUrl: "https://images.example/avatar.jpg",
      async save() {
        saveCalls += 1;
      }
    }
  };
  const res = createResponse();
  let nextError;

  await updateProfile(req, res, (error) => { nextError = error; });

  assert.equal(nextError, undefined);
  assert.equal(saveCalls, 1);
  assert.equal(req.user.name, "Alex Candidate");
  assert.equal(req.user.email, "original@example.com");
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.user.email, "original@example.com");
  assert.equal(res.body.user.avatarUrl, "https://images.example/avatar.jpg");
});

test("updateProfile rejects a blank name without saving", async () => {
  let saveCalls = 0;
  const req = {
    body: { name: "   " },
    user: { name: "Existing Name", async save() { saveCalls += 1; } }
  };
  const res = createResponse();

  await updateProfile(req, res, assert.fail);

  assert.equal(res.statusCode, 400);
  assert.equal(res.body.message, "A non-empty name is required.");
  assert.equal(saveCalls, 0);
});
