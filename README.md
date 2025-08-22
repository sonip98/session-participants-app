Session Participants App

A Vue.js + Quasar frontend with Node.js + MongoDB backend to create and manage sessions with participants: Signer, Additional Signers, Witnesses, and Observers.

Features

Create a session with signer (required), additional signers, witnesses, and observers.

Dynamic add/remove participants.

Frontend form validation (required fields, email rules, unique email check).

Backend API with Joi validation and MongoDB integration.

Unit-tested backend (coverage ~91%).

Optional: Display saved sessions and delete them from frontend.

Project Structure
frontend/   # Vue.js + Quasar SPA
backend/    # Node.js + Express + MongoDB
tests/      # Backend unit tests

Setup
1. Backend

Install dependencies:

cd backend
npm install


Set environment variables in .env:

MONGO_URI=mongodb://localhost:27017/sessionApp
PORT=5000


Run backend:

npm run dev


Run tests:

npm run test

2. Frontend

Install dependencies:

cd frontend
npm install


Configure API URL in .env (optional, defaults to localhost):

VITE_API_URL=http://localhost:5000/api


Run frontend:

quasar dev

API Endpoints
Create Session
POST /api/sessions


Body Example:

{
  "signer": {"name": "Alice", "email": "alice@example.com"},
  "additionalSigners": [{"name": "Bob", "email": "bob@example.com"}],
  "witnesses": [{"fullName": "Charlie", "email": "charlie@example.com", "zip": "12345", "address": "123 Street", "state": "NY"}],
  "observers": [{"fullName": "Dave", "email": "dave@example.com", "phone": "1234567890", "role": "Admin"}]
}


Response:

201 Created on success

400 Bad Request on validation errors (missing fields, duplicate emails)

Get All Sessions
GET /api/sessions


Response Example:

{
  "sessions": [
    {
      "signer": { "name": "Alice", "email": "alice@example.com" },
      "additionalSigners": [...],
      "witnesses": [...],
      "observers": [...]
    }
  ]
}

Delete Session
DELETE /api/sessions/:id


Response:

200 OK on success

404 Not Found if session ID does not exist

Testing

Run backend tests:

cd backend
npm run test


Uses Jest with coverage report.

Validates all session API functionality.

Notes

Ensure MongoDB is running before starting backend.

Frontend uses Axios configured in boot/axios.js to connect to backend.

$q.notify() requires Quasar Notify plugin to be enabled in quasar.conf.js.