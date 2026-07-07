# InterviewAI

A full-stack app that helps you prepare for interviews. Upload your resume and paste in a job description, and it generates a match score, likely technical and behavioral questions, your skill gaps, and a day-by-day prep plan — all using Gemini AI.

I built this to actually solve my own problem: staring at a job posting with no idea what to study first. This automates that first hour of prep work.

## What it does

- Upload a resume (or just describe yourself) + paste a job description → get a personalized interview report
- Regenerate just one part of a report (e.g. only the technical questions) instead of starting over
- Download an AI-tailored version of your resume as a PDF
- Track trends across all your reports on an analytics page — average match score, recurring skill gaps, etc.
- Full account system: OTP email verification, login/logout with refresh tokens, forgot password, change password, edit profile, delete account

## Stack

**Frontend:** React, React Router, SCSS, Recharts, Axios
**Backend:** Node.js, Express, MongoDB, JWT, Puppeteer, Nodemailer, Google Gemini API

## Running it locally

Clone the repo, then set up both sides:

```bash
cd Backend
npm install
```

Add a `.env` file in `Backend/`:

```
PORT=3000
MONGO_URI=your_mongodb_uri
JWT_SECRET=some_random_string
JWT_REFRESH_SECRET=another_random_string
GOOGLE_GENAI_API_KEY=your_gemini_key
EMAIL_USER=your_gmail
EMAIL_APP_PASSWORD=your_gmail_app_password
FRONTEND_URL=http://localhost:5173
```

```bash
npm run dev
```

Then the frontend:

```bash
cd Frontend
npm install
npm run dev
```

App runs at `localhost:5173`, talking to the API at `localhost:3000`.

## A few things I'd add next

- A voice-based mock interview mode using the browser's speech APIs
- Letting the AI factor in the specific company, not just the job description
- Checklist-style progress tracking on the prep roadmap

## License

MIT

## Author

[mridul2172](https://github.com/mridul2172)