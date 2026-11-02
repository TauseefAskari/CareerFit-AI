# CareerFit Backend

Beginner-friendly Express + MongoDB backend starter for CareerFit, an AI resume analyzer.

## Requirements
- Node.js LTS
- MongoDB Atlas account or local MongoDB
- npm

## Setup
1. Extract this ZIP and open a terminal in `careerfit-backend`.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `.env` and fill in `MONGODB_URI` and `JWT_SECRET`. Add `IMAGEKIT_PRIVATE_KEY` from your ImageKit dashboard to enable profile picture uploads; keep the private key in the backend `.env` only.
4. In MongoDB Atlas, create a database user and allow your development IP address.
5. Start the backend:
   ```bash
   npm run dev
   ```
6. Check `http://localhost:5000/api/health`.

## Profile
- `PUT /api/v1/auth/me` — update the authenticated user's name. Email is read-only.
- `PUT /api/v1/auth/me/avatar` — upload a JPEG, PNG, or WebP profile picture up to 5 MB using the `avatar` multipart field.
- `DELETE /api/v1/auth/me/avatar` — remove the profile picture.

Avatar uploads require `IMAGEKIT_PRIVATE_KEY` in the backend `.env`. Keep this private key on the server and never add it to the frontend environment.

## Current starter endpoints
- `GET /api/health` — server/database health
- `POST /api/v1/resumes/upload` — upload one PDF or DOCX up to 5 MB and extract text

The upload route is not authenticated yet; add authentication before using it with real resumes. Legacy `.doc` files are rejected because they need a separate parser/conversion strategy. Scanned/image-only PDFs need OCR.

## Important
- Never commit `.env`.
- The AI SDK is installed, but the AI analysis route is intentionally not implemented yet.
- Use fictional resumes during development and avoid logging extracted resume text.
