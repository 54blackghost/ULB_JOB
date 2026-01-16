# ULB JOB Frontend

React v17 frontend for the ULB JOB platform.

## Setup

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Create `.env` file:
```bash
REACT_APP_API_URL=http://localhost:5000/api
```

3. Start the development server:
```bash
npm start
```

The app will run on http://localhost:3000

## Features

- React v17 with React Router v5
- Authentication with JWT
- Job browsing and search
- AI-powered CV builder and optimization
- Job recommendations
- Application tracking
- Dashboard for candidates and recruiters
- Stripe payment integration

## Folder Structure

```
frontend/
├── public/
├── src/
│   ├── components/     # Reusable components
│   ├── pages/          # Page components
│   ├── context/        # React context (Auth)
│   ├── api/            # API service layer
│   ├── App.js          # Main app component
│   ├── index.js        # Entry point
│   └── index.css       # Global styles
└── package.json
