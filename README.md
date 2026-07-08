# 🚀 InterviewAI

> **An AI-powered interview preparation platform that analyzes your resume against a job description and generates personalized interview insights, technical questions, skill-gap analysis, and a structured preparation roadmap using Google Gemini AI.**

---

## 🌐 Live Demo

**🔗 https://interview-ai-five-umber.vercel.app**

---

## 📖 Overview

Preparing for interviews often starts with figuring out **what to study first**. Instead of manually comparing your resume with a job description, **InterviewAI** automates the entire process.

Simply upload your resume (or describe your profile), paste a job description, and receive a comprehensive AI-generated interview report within seconds.

---

## ✨ Key Features

* 🤖 AI-powered interview report generation using **Google Gemini**
* 📄 Upload your resume or provide a self-description
* 💼 Analyze any job description
* 📊 Resume-to-job match score
* 🎯 Personalized technical interview questions
* 💬 Behavioral interview questions
* 📈 Skill gap analysis with improvement suggestions
* 🗓️ Day-by-day interview preparation roadmap
* 🔄 Regenerate individual report sections without creating a new report
* 📥 Download an AI-tailored resume as a PDF
* 📊 Analytics dashboard with report history and trends
* 🔐 Complete authentication system

  * Email OTP verification
  * Login & Logout
  * JWT Access & Refresh Tokens
  * Forgot Password
  * Change Password
  * Edit Profile
  * Delete Account
* 📱 Fully responsive design for desktop, tablet, and mobile

---

## 🛠️ Tech Stack

### Frontend

* React.js
* React Router
* SCSS
* Axios
* Recharts

### Backend

* Node.js
* Express.js

### Database

* MongoDB Atlas
* Mongoose

### Authentication

* JWT Authentication
* Refresh Tokens
* Nodemailer

### AI & Utilities

* Google Gemini API
* Puppeteer

---

## ⚙️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/mridul2172/interview-ai.git
cd interview-ai
```

---

### 2. Backend Setup

```bash
cd Backend
npm install
```

Create a `.env` file inside the **Backend** folder.

```env
PORT=3000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
GOOGLE_GENAI_API_KEY=your_gemini_api_key
EMAIL_USER=your_email
EMAIL_APP_PASSWORD=your_email_app_password
FRONTEND_URL=http://localhost:5173
```

Start the backend:

```bash
npm run dev
```

---

### 3. Frontend Setup

```bash
cd Frontend
npm install
npm run dev
```

The frontend will run at:

```
http://localhost:5173
```

Backend API:

```
http://localhost:3000
```

---

## 📌 Future Enhancements

* 🎙️ AI-powered voice mock interviews
* 🏢 Company-specific interview preparation
* 📅 Progress tracking dashboard
* 📧 Email interview reminders
* 📚 AI-generated learning resources
* 🌍 Multi-language interview support

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 👨‍💻 Author

**Mridul Tiwari**

GitHub: https://github.com/mridul2172

---

## ⭐ Support

If you found this project useful, please consider giving it a **⭐ Star** on GitHub.

Your support helps improve the project and motivates future development.
