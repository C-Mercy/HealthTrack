

# HealthTrack Application

## Overview

HealthTrack is a full-stack health management application with backend built on Node.js, Express, and Prisma, and frontend built with React and Redux Toolkit.

---

## Environment Setup

### Backend

- Copy the `backend/envsample` file to `.env` in the `backend` directory.
- Update the `.env` file with your database connection string and JWT secret.
- Example `.env` variables:


### Prisma Client

- After setting up `.env`, run Prisma migrations and generate the client:
```bash
cd backend
npx prisma migrate dev --name init
npx prisma generate

Running the Application
Concurrently Running Backend and Frontend
A root-level package.json is configured to run both backend and frontend concurrently.

From the root directory, install dependencies:


npm install
Start both servers:


npm start
This runs:
Backend server with hot reload on port 5000.
Frontend React development server on port 3000 with proxy to backend.