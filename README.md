Cloud Media Gallery Backend

Backend API for the Cloud Media Gallery app, built with Node.js, Express, Sequelize, and PostgreSQL.

## Functionality Implemented

### Auth and user management
- User registration and login
- JWT-protected routes
- Refresh token renewal
- Logout
- User profile fetch and update
- User delete and get-all-users support

### Media management
- Upload multiple media files (up to 10 files per request)
- Store media metadata and file URLs
- Fetch media by user with media-type filtering and pagination
- Fetch single media item by ID
- Update media metadata
- Delete media
- Fetch trashed media list
- Mark/unmark media as favourite
- Fetch all favourite media for a user

### Platform and infrastructure
- CORS enabled for frontend access
- Sequelize database sync at startup
- Docker and Docker Compose files for containerized setup

## API Routes

### User routes (`/api/users/*`)
- `POST /register`
- `POST /login`
- `POST /renew-refresh-token`
- `POST /logout`
- `PUT /:id`
- `DELETE /:id`
- `GET /profile/:id`
- `GET /get-all-users`

### Media routes (`/api/media/*`) - protected
- `POST /upload`
- `PATCH /make-favourite/:id`
- `GET /get-favourite-media/:userId`
- `GET /get-all-media/:userId`
- `GET /get-media/:id`
- `GET /get-trashed-media/:userId`
- `PUT /update-media/:id`
- `DELETE /delete-media/:id`

## Run Locally

1. Install dependencies:
   - `npm install`
2. Configure environment variables in `.env`
3. Start server:
   - `npm start`

Server starts from `app.js` and exposes API under `/api`.



## Deployment Overview

The application is deployed using **two main components**:
### Backend (Node.js App)
* Runs inside a Docker container
* Exposes API on port `3000`
* Handles user and media requests
* Uses environment variables from `.env`

---

### Database (PostgreSQL)

* Runs in a separate Docker container
* Stores user and media data
* Accessible inside Docker network using:
```env
DB_HOST=db
```

---

## ⚙️ Deployment Steps

1. Connect to EC2 and clone the repository
2. Create `.env` file with database configuration
3. Run:

```bash
docker-compose up -d --build

## Access
http://<your-ec2-public-ip>:3000

## Communication

* Backend ↔ Database via Docker network
* Uses service name `db` (not localhost)
---

## Summary

* Backend handles API logic
* Database stores data
* Docker Compose manages both services together
