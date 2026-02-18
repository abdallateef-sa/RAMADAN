# Ramadan Planner

A simple Ramadan Schedule Planner web application built with Express, React and MongoDB.

## Features
- Login with Email & OTP (Gmail via Nodemailer).
- Persistent schedule tracking for 30 days of Ramadan.
- Track Salah (Fard & Sunan), Azkar, Quran, and Good Deeds.
- Responsive design.

## Setup Instructions

### Backend (Server)
1. Navigate to the `server` folder:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Update `.env` file with your credentials:
   - `MONGO_URI`: Your MongoDB connection string (default: `mongodb://localhost:27017/ramadan_planner`)
   - `EMAIL_USER`: Your Gmail address.
   - `EMAIL_PASS`: Your Gmail **App Password** (Create one at https://myaccount.google.com/apppasswords or enable Less Secure Apps).
4. Start the server:
   ```bash
   node index.js
   ```
   Server will run on `http://localhost:5000`.

### Frontend (Client)
1. Navigate to the `client` folder:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   Client will run on `http://localhost:5173`.

## Usage
1. Open the client URL in your browser.
2. Enter your email to receive an OTP.
3. Check your email for the OTP and enter it to login.
4. Mark your progress in the daily schedule. Data is saved automatically.

## Persistence
- If you logout and login again with the same email, your data will be preserved as it is stored in MongoDB.
