# ULB JOB API Documentation

## Authentication Endpoints

### POST /api/auth/register
Register a new user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe",
  "role": "candidate" | "recruiter" | "admin",
  "company": "Company Name" (optional, for recruiters)
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "userId",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "candidate"
  }
}
```

### POST /api/auth/login
Login existing user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": "userId",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "candidate"
  }
}
```

### POST /api/auth/logout
Logout current user.

### GET /api/auth/me
Get current user profile.

**Response:**
```json
{
  "user": {
    "_id": "userId",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "candidate",
    ...
  }
}
```

## Job Endpoints (To be implemented)

### GET /api/jobs
List all approved jobs with filters.

### POST /api/jobs
Create new job (recruiter only).

### GET /api/jobs/[id]
Get job details.

### PATCH /api/jobs/[id]
Update job (recruiter only).

### DELETE /api/jobs/[id]
Delete job (recruiter/admin only).

### POST /api/jobs/[id]/apply
Apply to a job (candidate only).

### POST /api/jobs/[id]/validate
AI validate job posting (admin only).

## CV Endpoints (To be implemented)

### GET /api/cvs
Get user's CVs.

### POST /api/cvs
Create new CV.

### GET /api/cvs/[id]
Get CV details.

### PATCH /api/cvs/[id]
Update CV.

### DELETE /api/cvs/[id]
Delete CV.

### POST /api/cvs/[id]/optimize
AI optimize CV (premium feature).

### POST /api/cvs/[id]/generate-pdf
Generate PDF version of CV.

## AI Endpoints (To be implemented)

### POST /api/ai/recommend-jobs
Get personalized job recommendations.

### POST /api/ai/generate-cover-letter
Generate AI cover letter for specific job.

### POST /api/ai/validate-job
Validate and enhance job posting.
