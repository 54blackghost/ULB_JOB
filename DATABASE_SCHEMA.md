# ULB JOB Database Schema

## Collections

### users
- _id: ObjectId
- email: string (unique, indexed)
- password: string (hashed)
- name: string
- role: 'candidate' | 'recruiter' | 'admin'
- company: string (optional, for recruiters)
- phone: string (optional)
- location: string (optional)
- bio: string (optional)
- skills: string[] (optional, for candidates)
- experience: string (optional, for candidates)
- subscriptionPlan: 'free' | 'basic' | 'premium'
- subscriptionExpiry: Date (optional)
- createdAt: Date
- updatedAt: Date

### jobs
- _id: ObjectId
- title: string (indexed)
- company: string
- location: string (indexed)
- type: 'full-time' | 'part-time' | 'contract' | 'remote'
- category: string (indexed)
- experienceLevel: 'entry' | 'mid' | 'senior' | 'executive'
- salaryRange: { min: number, max: number, currency: string }
- description: string
- requirements: string[]
- responsibilities: string[]
- benefits: string[] (optional)
- tags: string[] (indexed)
- status: 'pending' | 'approved' | 'rejected' | 'closed' (indexed)
- recruiterId: ObjectId (indexed)
- aiValidation: {
  isValid: boolean,
  suggestions: string[],
  score: number,
  validatedAt: Date
}
- applicants: ObjectId[] (array of candidate IDs)
- views: number
- featured: boolean (indexed)
- expiresAt: Date
- createdAt: Date (indexed)
- updatedAt: Date

### cvs
- _id: ObjectId
- userId: ObjectId (indexed)
- title: string
- content: {
  personalInfo: { name, email, phone, location, summary },
  experience: [{ company, position, startDate, endDate, description }],
  education: [{ institution, degree, field, graduationDate }],
  skills: string[],
  certifications: [{ name, issuer, date }]
}
- aiOptimized: boolean
- aiScore: number (0-100)
- targetJobDomain: string (optional)
- pdfUrl: string (optional)
- createdAt: Date
- updatedAt: Date

### applications
- _id: ObjectId
- jobId: ObjectId (indexed)
- candidateId: ObjectId (indexed)
- cvId: ObjectId
- coverLetter: string (optional)
- status: 'pending' | 'reviewing' | 'shortlisted' | 'rejected' | 'accepted' (indexed)
- appliedAt: Date (indexed)
- updatedAt: Date

## Indexes

### users
- email: unique index
- role: index

### jobs
- status: index
- category: index
- location: index
- featured: index
- createdAt: descending index
- tags: index (for search)

### applications
- jobId: index
- candidateId: index
- status: index
- appliedAt: descending index

### cvs
- userId: index
- createdAt: descending index
