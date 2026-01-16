# ULB JOB Backend API

Node.js + Express + MongoDB backend for the ULB JOB platform.

## Setup

1. Install dependencies:
```bash
cd backend
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Update environment variables in `.env`:
- MONGODB_URI: Your MongoDB connection string
- JWT_SECRET: Secret key for JWT tokens
- GEMINI_API_KEY: Google Gemini API key
- STRIPE_SECRET_KEY: Stripe secret key
- CLIENT_URL: Frontend URL (http://localhost:3000)

4. Start the server:
```bash
npm run dev
```

The API will run on http://localhost:5000

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/me` - Get current user
- PUT `/api/auth/profile` - Update profile

### Jobs
- GET `/api/jobs` - Get all jobs (with filters)
- GET `/api/jobs/:id` - Get single job
- POST `/api/jobs` - Create job (recruiter only)
- PUT `/api/jobs/:id` - Update job
- DELETE `/api/jobs/:id` - Delete job

### CVs
- GET `/api/cvs` - Get user's CVs
- GET `/api/cvs/:id` - Get single CV
- POST `/api/cvs` - Create CV
- PUT `/api/cvs/:id` - Update CV
- DELETE `/api/cvs/:id` - Delete CV

### Applications
- GET `/api/applications` - Get applications
- POST `/api/applications` - Apply for job
- PUT `/api/applications/:id` - Update application status

### AI Features
- POST `/api/ai/recommend-jobs` - Get job recommendations
- POST `/api/ai/optimize-cv` - Optimize CV with AI
- POST `/api/ai/generate-cover-letter` - Generate cover letter

### Dashboard
- GET `/api/dashboard/stats` - Get dashboard statistics

### Payments
- POST `/api/payments/create-checkout` - Create Stripe checkout
- POST `/api/payments/webhook` - Stripe webhook handler
