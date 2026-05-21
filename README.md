# TaskFlow

A simple, secure Kanban task board application built with a Node.js/Express backend and a React (Vite) frontend.

## Features
- **Authentication**: User registration and login using bcryptjs for password hashing and JSON Web Tokens (JWT) for session management.
- **Roles**: Support for both `user` and `admin` roles. Admins can view and delete all tasks in the system, while standard users can only view and modify their own tasks.
- **Validation**: Strict request validation using `express-validator` and database-level validation using Mongoose.
- **Minimal Frontend**: A clean, distraction-free flat-white React UI for registering, logging in, and managing tasks.

## Tech Stack
- **Backend**: Node.js, Express, MongoDB (Mongoose), jsonwebtoken, bcryptjs
- **Frontend**: React, Vite, Vanilla CSS
- **API Versioning**: Prefix `/api/v1` for all routes

## Getting Started

### Prerequisites
- Node.js installed locally
- A running MongoDB instance (local or remote)

### Setup Instructions

1. **Backend Setup**
   Navigate to the `backend` folder and install dependencies:
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file inside the `backend` folder and add:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/taskflow
   JWT_SECRET=some_secret_key_here
   ```
   Run the backend development server:
   ```bash
   npm run dev
   ```

2. **Frontend Setup**
   Open a new terminal window, navigate to the `frontend` folder, and install dependencies:
   ```bash
   cd frontend
   npm install
   ```
   Start the frontend development server:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173`.

## API Documentation

All routes are versioned under `/api/v1`.

### Authentication

#### 1. Register User
- **URL**: `POST /api/v1/auth/register`
- **Body**:
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "mypassword123"
  }
  ```
- **Response (201)**:
  ```json
  {
    "success": true,
    "message": "User successfully registered",
    "token": "JWT_TOKEN_HERE",
    "user": {
      "id": "60d5ec...",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "role": "user"
    }
  }
  ```

#### 2. Login User
- **URL**: `POST /api/v1/auth/login`
- **Body**:
  ```json
  {
    "email": "jane@example.com",
    "password": "mypassword123"
  }
  ```
- **Response (200)**:
  ```json
  {
    "success": true,
    "message": "Login successful",
    "token": "JWT_TOKEN_HERE",
    "user": {
      "id": "60d5ec...",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "role": "user"
    }
  }
  ```

### Tasks (JWT Token required in Authorization header: `Bearer <token>`)

#### 3. Create a Task
- **URL**: `POST /api/v1/tasks`
- **Body**:
  ```json
  {
    "title": "Setup database indexes",
    "description": "Index the creator field to optimize search speeds.",
    "status": "pending"
  }
  ```
- **Response (201)**:
  ```json
  {
    "success": true,
    "message": "Task created"
  }
  ```

#### 4. Get Tasks
- **URL**: `GET /api/v1/tasks`
- **Response (200)**:
  - If logged in as user: returns tasks created by this user.
  - If logged in as admin: returns all tasks with creator info populated.
  ```json
  {
    "success": true,
    "count": 1,
    "tasks": [
      {
        "_id": "60d5f2...",
        "title": "Setup database indexes",
        "description": "Index the creator field to optimize search speeds.",
        "status": "pending",
        "createdBy": "60d5ec...",
        "createdAt": "2026-05-21T12:00:00Z"
      }
    ]
  }
  ```

#### 5. Update Task Status
- **URL**: `PUT /api/v1/tasks/:id`
- **Body**:
  ```json
  {
    "status": "in-progress"
  }
  ```
- **Response (200)**:
  ```json
  {
    "success": true,
    "message": "Task updated successfully",
    "updatedTask": {
      "_id": "60d5f2...",
      "status": "in-progress"
    }
  }
  ```

#### 6. Delete Task
- **URL**: `DELETE /api/v1/tasks/:id`
- **Response (200)**:
  ```json
  {
    "success": true,
    "message": "Task deleted successfully"
  }
  ```

## Scalability Rationale

When scaling this system to handle high volume (millions of tasks/users), here is the architecture I would recommend:

1. **Database Layer (MongoDB)**:
   - Implement database indexing on high-query fields like `createdBy` and `status` to ensure fast query executions.
   - Use MongoDB replica sets to offload read operations to secondary nodes while primary handles write operations.

2. **Caching Layer (Redis)**:
   - Implement caching on task retrieval. Since task updates are discrete events (creating, status moves, deletion), we can cache `GET /api/v1/tasks` responses by user ID and invalidate the cache key when a write operation occurs.
   - Use Redis to implement token denylists (for logout/revocation) and API rate limiting on routes like authentication.

3. **Application Server Horizontal Scaling**:
   - The Express application is stateless since it uses signed JWTs instead of server-side sessions. This allows us to scale horizontally by running multiple API instances behind a load balancer (such as Nginx or AWS ALB).
   - In production, we can run process clustering (e.g., via PM2 or Node cluster module) to utilize all available CPU cores.

4. **Service Decomposition**:
   - If the codebase grows, split the services into smaller microservices: an auth service, a task service, and an email/notification service using a message broker (like RabbitMQ) to handle background events asynchronously.
