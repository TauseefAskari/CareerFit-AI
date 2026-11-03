# CareerFit Backend

Express + MongoDB API for CareerFit AI. The backend handles authentication, profile updates, resume upload parsing, and AI-powered resume-to-job analysis through the Gemini API.

## Stack
- Node.js
- Express
- MongoDB + Mongoose
- JWT-based auth with HTTP-only cookies
- Multer for file uploads
- `pdf-parse` and `mammoth` for resume text extraction
- ImageKit for avatar storage
- Google Gemini for analysis scoring and recommendations

## Requirements
- Node.js 18+ (LTS recommended)
- MongoDB Atlas account or a local MongoDB instance
- npm
- A Gemini API key
- An ImageKit private key if you want avatar uploads enabled

## Environment variables
Create a `.env` file in `careerfit-backend` with values similar to:

```bash
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
MONGODB_URI=mongodb://localhost:27017/careerfit
JWT_SECRET=replace-with-a-long-random-secret
GEMINI_API_KEY=your-gemini-api-key
GEMINI_MODEL=gemini-2.5-flash
MAX_UPLOAD_MB=5
IMAGEKIT_PRIVATE_KEY=your-imagekit-private-key
```

Notes:
- `MONGODB_URI` is required for the API to start.
- `JWT_SECRET` should be unique and private for each environment.
- `IMAGEKIT_PRIVATE_KEY` is only needed for avatar upload support and should stay on the backend server.
- Never commit `.env` files to source control.

## Setup
1. Open a terminal in `careerfit-backend`.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the API in development mode:
   ```bash
   npm run dev
   ```
4. Check the health endpoint:
   ```bash
   http://localhost:5000/api/health
   ```

For production-style startup, use:
```bash
npm start
```

## API overview
### Health
- `GET /api/health` — service/check status endpoint

### Authentication
- `POST /api/v1/auth/register` — create a new user account
- `POST /api/v1/auth/login` — log in and receive a secure cookie session
- `POST /api/v1/auth/logout` — sign the user out
- `GET /api/v1/auth/me` — fetch the current authenticated user
- `PUT /api/v1/auth/me` — update profile details such as name
- `PUT /api/v1/auth/me/avatar` — upload a profile avatar
- `DELETE /api/v1/auth/me/avatar` — remove the current avatar

### Resume uploads
- `POST /api/v1/resumes/upload` — upload a PDF or DOCX resume and extract text for analysis

### Analysis
- `POST /api/v1/analysis` — analyze a resume against a job description and return a compatibility score plus recommendations
- `GET /api/v1/analysis` — list saved analyses for the authenticated user
- `GET /api/v1/analysis/:id` — fetch a specific saved analysis

## Important implementation notes
- The backend uses HTTP-only cookies for auth, so the frontend must be configured to send credentials.
- Resume uploads are restricted to supported file types and size limits.
- `.doc` files are intentionally rejected because they require a separate conversion strategy.
- Scanned or image-only PDFs may need OCR support before they can be analyzed reliably.
- Use fictional resume data during local development and avoid logging raw extracted resume text in production logs.
