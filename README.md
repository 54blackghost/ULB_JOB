# ULB JOB - Project Setup Guide

Complete AI-powered job platform built with Node.js backend and React v17 frontend.

## Architecture

### Backend (Node.js + Express + MongoDB)
- **Location:** `/backend`
- **Technology:** Express.js, MongoDB with Mongoose, JWT authentication
- **Features:** RESTful API, AI integration (Google Gemini), Stripe payments

### Frontend (React v17)
- **Location:** `/frontend`
- **Technology:** React 17, React Router v5, Axios
- **Features:** SPA architecture, Context API for state management

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Google Gemini API key
- Stripe account (optional, for payments)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
npm install
```

2. Create `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ulb-job
JWT_SECRET=your_super_secret_jwt_key_here
GEMINI_API_KEY=your_gemini_api_key_here
STRIPE_SECRET_KEY=sk_test_your_stripe_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
CLIENT_URL=http://localhost:3000
```

3. Start MongoDB (if running locally):
```bash
mongod
```

4. Start the backend server:
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
npm install
```

2. Create `.env` file:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

3. Start the development server:
```bash
npm start
```

Frontend will run on `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Jobs
- `GET /api/jobs` - Get all jobs (with filters)
- `GET /api/jobs/:id` - Get single job
- `POST /api/jobs` - Create job (recruiter only)
- `PUT /api/jobs/:id` - Update job
- `DELETE /api/jobs/:id` - Delete job

### CVs
- `GET /api/cvs` - Get user's CVs
- `GET /api/cvs/:id` - Get single CV
- `POST /api/cvs` - Create CV
- `PUT /api/cvs/:id` - Update CV
- `DELETE /api/cvs/:id` - Delete CV

### Applications
- `GET /api/applications` - Get applications
- `POST /api/applications` - Apply for job
- `PUT /api/applications/:id` - Update application status (recruiter)

### AI Features
- `POST /api/ai/recommend-jobs` - Get AI job recommendations
- `POST /api/ai/optimize-cv` - Optimize CV with AI
- `POST /api/ai/generate-cover-letter` - Generate cover letter

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

### Payments
- `POST /api/payments/create-checkout` - Create Stripe checkout session
- `POST /api/payments/webhook` - Handle Stripe webhooks

## Features

### For Job Seekers (Candidates)
- Browse and search jobs with advanced filters
- AI-powered job recommendations based on profile
- Create and manage multiple CVs
- AI CV optimization with ATS scoring
- Apply to jobs with one click
- Track application status
- Get AI-generated cover letters

### For Recruiters
- Post and manage job listings
- Review and manage applications
- AI-powered job description optimization
- Applicant tracking system
- Update candidate status (pending, reviewing, shortlisted, interviewed, accepted, rejected)
- Access to candidate profiles and CVs

### AI Features (Powered by Google Gemini)
- Job recommendations with match reasoning
- CV optimization with ATS scoring
- Keyword suggestions for CVs
- Cover letter generation
- Job description validation

### Subscription Plans

**For Candidates:**
- Free: Basic features, 1 CV, limited AI usage
- Basic ($9.99/month): Unlimited CVs, 5 AI optimizations/month
- Premium ($19.99/month): Unlimited AI features, featured profile

**For Recruiters:**
- Starter ($49.99/month): Up to 5 jobs/month
- Professional ($99.99/month): Up to 20 jobs/month, AI features
- Enterprise ($199.99/month): Unlimited jobs, dedicated support

## Environment Variables

### Backend `.env`
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
CLIENT_URL=http://localhost:3000
```

### Frontend `.env`
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## Database Models

### User
- email, password (hashed with bcrypt)
- fullName, role (candidate/recruiter/admin)
- profile (phone, location, bio, skills, experience, education)
- subscription (plan, status, dates, Stripe IDs)
- usage tracking (cvOptimizations, aiRecommendations, jobPosts, applications)

### Job
- title, company, description, requirements
- salary (min, max, currency)
- location, type, category, skills, benefits
- recruiter reference
- status (active/closed/draft)
- applicationsCount, views

### CV
- user reference
- title, personalInfo (name, email, phone, location, summary)
- experience, education, skills, certifications, projects
- atsScore, optimizationSuggestions, keywords

### Application
- job reference, candidate reference, cv reference
- coverLetter
- status (pending/reviewing/shortlisted/interviewed/rejected/accepted)
- notes (for recruiters)

## Deployment

### Backend
1. Deploy to platforms like Heroku, Railway, or DigitalOcean
2. Set up MongoDB Atlas for production database
3. Configure environment variables
4. Set up Stripe webhooks

### Frontend
1. Build the production bundle: `npm run build`
2. Deploy to Vercel, Netlify, or any static hosting
3. Configure environment variables
4. Update API URL to production backend

## Testing

### Backend API Testing
Use Postman or curl to test API endpoints:

```bash
# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","fullName":"Test User","role":"candidate"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## Troubleshooting

### Common Issues

1. **MongoDB connection error**
   - Ensure MongoDB is running
   - Check connection string in `.env`

2. **CORS errors**
   - Verify CLIENT_URL in backend `.env` matches frontend URL
   - Check CORS configuration in `server.js`

3. **API not responding**
   - Check if backend server is running on correct port
   - Verify REACT_APP_API_URL in frontend `.env`

4. **Stripe payment issues**
   - Use test mode keys for development
   - Set up webhook endpoint in Stripe dashboard

## Support

For issues or questions:
- Check the documentation
- Review error logs in console
- Verify environment variables are set correctly
- Ensure all dependencies are installed

## License

Proprietary - All rights reserved
