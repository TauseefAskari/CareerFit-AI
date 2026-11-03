# CareerFit Frontend

React + Vite frontend for CareerFit AI, a resume-to-job analysis experience for job seekers. The app lets users sign in, upload a resume, enter a target role, and review their match score with strengths, gaps, and improvement suggestions.

## Stack
- React 19
- Vite
- React Router
- Axios for API calls
- Lucide icons and motion-based UI polish

## Requirements
- Node.js 18+ (LTS recommended)
- npm
- A running CareerFit backend on http://localhost:5000

## Local setup
1. Open a terminal in `careerfit-frontend`.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in this folder and set the backend URL:
   ```bash
   VITE_API_BASE_URL=http://localhost:5000/api/v1
   APP_URL=http://localhost:3000
   ```
   If your app is deployed elsewhere, point `VITE_API_BASE_URL` to the deployed backend instead.
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open the app at http://localhost:3000.

## Production build
```bash
npm run build
npm run preview -- --host 0.0.0.0 --port 4173
```

## Notes
- The frontend expects the backend to provide authentication, resume upload routes, and analysis results.
- `src/services/api.js` centralizes API configuration and uses `VITE_API_BASE_URL` for requests.
- Do not commit `.env` files or other local secrets.
- This app is designed around the CareerFit backend workflow; some pages may not work fully without the API running.

## Project layout
- `src/pages/` — landing, auth, dashboard, and analysis pages
- `src/context/` — auth and shared app state
- `src/services/` — frontend API clients and helper logic
- `src/components/` — reusable UI building blocks
- `src/routes/` — route configuration
