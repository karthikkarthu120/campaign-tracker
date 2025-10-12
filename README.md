# Campaign Tracker

This is a small full-stack app (React frontend, Node/Express backend, MySQL optional) that demonstrates adding, listing, updating, and deleting marketing campaigns.

Quick start (development):

1. Backend
   - cd backend
   - npm install
   - create a `.env` file (see `backend/.env.example`) or set `USE_IN_MEMORY=true` to run without MySQL
   - node server.js

2. Frontend
   - cd frontend
   - npm install
   - npm start

Notes
- The backend will perform a DB connectivity check on startup. If MySQL is not available and `USE_IN_MEMORY` is set to `true` (or you are in non-production), the API falls back to an in-memory store so you can still test the UI.
- To use a real DB, start MySQL and import `db.sql` then update `.env`.

Assignment checklist (covered):
- Add a new marketing campaign: implemented
- View list of campaigns: implemented
- Update campaign status: implemented
- Delete campaign: implemented
- Simple dashboard: implemented (counts)
- Search/filter: implemented

*** End of README
