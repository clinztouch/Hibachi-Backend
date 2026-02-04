Hibachi Backend 🔥

Habit Tracking REST API

Hibachi Backend is a Node.js + Express REST API that powers the Hibachi habit-tracking application. It handles authentication, habit management, completion tracking, and streak calculations, with MongoDB as the database.

This backend is designed as a standalone API, intended to be consumed by a separate frontend application.

🚀 Features

User authentication with JWT

Email verification flow

Habit CRUD operations

Daily habit completion tracking

Current & longest streak calculation

MongoDB integration using Mongoose

Secure environment-based configuration

Deployed on Render

🧱 Tech Stack

Node.js

Express.js

MongoDB

Mongoose

JWT Authentication

Nodemailer

Render (Deployment)

📁 Project Structure
Hibachi-Backend/
├── config/
│   └── database.js
├── middleware/
│   └── auth.js
├── modules/
│   └── utils/
│       └── streakCalculator.js
├── routes/
│   ├── authRoutes.js
│   ├── habitRoutes.js
│   └── verifyRoutes.js
├── utils/
│   └── emailTemplates.js
├── server.js
├── package.json
└── README.md
🔐 Authentication

Users register and log in using email and password

JWT tokens are issued on login

Protected routes require a valid Authorization: Bearer <token> header

Email verification is supported via Nodemailer

📊 Streak Logic

Hibachi calculates both current streak and longest streak for each habit.

Completion dates are normalized to midnight to avoid timezone issues

Consecutive calendar days are detected

Missed days reset the streak

Duplicate same-day entries are ignored

This logic is implemented as a pure utility function:

modules/utils/streakCalculator.js

🛣️ API Endpoints
Auth
POST   /api/auth/register
POST   /api/auth/login

Email Verification
GET    /api/verify/:token

Habits
GET    /api/habits
POST   /api/habits
DELETE /api/habits/:habitId

Habit Completions
POST   /api/habits/:habitId/completions
DELETE /api/habits/:habitId/completions

⚙️ Environment Variables

Create a .env file in the root:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email_address
EMAIL_PASS=your_email_password
BASE_URL=http://localhost:5000

🧪 Local Development
git clone https://github.com/clinztouch/Hibachi-Backend.git
cd Hibachi-Backend
npm install
npm run dev


Server runs on:

http://localhost:5000

🌍 Deployment

The backend is deployed on Render and configured to bind to the port provided by the platform.

Frontend is hosted separately and communicates with this API over HTTP.

📌 Notes

Frontend is maintained in a separate repository

This backend is API-only and does not serve static files

Designed to reflect real-world backend architecture

👤 Author

ClinzTouch
GitHub: https://github.com/clinztouch
