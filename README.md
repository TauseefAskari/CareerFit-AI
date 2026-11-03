# CareerFit AI

CareerFit AI is a full-stack resume analysis application that helps job seekers compare their resume against a target job description. It combines a React frontend with an Express + MongoDB backend and uses Gemini to generate a match score, strengths, skill gaps, and actionable improvement suggestions.

## Project structure

```text
careerfit-ai/
├── README.md                  # Project overview
├── careerfit-frontend/        # React + Vite app
│   ├── README.md
│   ├── src/
│   ├── public/
│   └── package.json
├── careerfit-backend/         # Express + MongoDB API
│   ├── README.md
│   ├── src/
│   └── package.json
└── .gitignore
```

## What this app does

- User sign-up and login
- Profile management and avatar upload
- Resume upload (PDF and DOCX)
- Job description input
- Resume-to-role compatibility analysis
- Summary of matched and missing skills
- Improvement recommendations and suggested summary
- Saved analysis history for authenticated users

## Tech stack

### Frontend
- React 19
- Vite
- React Router
- Axios
- Tailwind-inspired design system

### Backend
- Node.js
- Express
- MongoDB + Mongoose
- JWT auth with cookies
- Multer + PDF/DOCX parsing
- ImageKit avatar uploads
- Google Gemini API integration

## Quick start

### 1. Install dependencies

Frontend:
```bash
cd careerfit-frontend
npm install
```

Backend:
```bash
cd careerfit-backend
npm install
```

### 2. Configure environment variables

Frontend `.env` in `careerfit-frontend`:
```bash
VITE_API_BASE_URL=http://localhost:5000/api/v1
APP_URL=http://localhost:3000
```

Backend `.env` in `careerfit-backend`:
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
- `MONGODB_URI` is required for the backend to start.
- `JWT_SECRET` should be kept private and unique per environment.
- `IMAGEKIT_PRIVATE_KEY` is only needed for profile avatar uploads.
- Do not commit `.env` files.

### 3. Run the apps

Start backend:
```bash
cd careerfit-backend
npm run dev
```

Start frontend:
```bash
cd careerfit-frontend
npm run dev
```

Then open:
- Frontend: http://localhost:3000
- Backend health check: http://localhost:5000/api/health

## Main API endpoints

### Auth
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/me`
- `PUT /api/v1/auth/me`
- `PUT /api/v1/auth/me/avatar`
- `DELETE /api/v1/auth/me/avatar`

### Resume upload
- `POST /api/v1/resumes/upload`

### Analysis
- `POST /api/v1/analysis`
- `GET /api/v1/analysis`
- `GET /api/v1/analysis/:id`

## Development notes

- Frontend API calls are centralized in `careerfit-frontend/src/services/api.js`.
- The backend uses HTTP-only cookies for authentication.
- Resume uploads accept supported file types and respect configured size thresholds.
- `.doc` files are intentionally rejected because they need conversion handling.
- AI-generated analysis should be treated as an estimate, not a guaranteed hiring or ATS prediction.

## Documentation

- Frontend docs: [careerfit-frontend/README.md](careerfit-frontend/README.md)
- Backend docs: [careerfit-backend/README.md](careerfit-backend/README.md)

## License

This project currently does not include a formal license file. If you plan to distribute or deploy it publicly, add a license before release.
