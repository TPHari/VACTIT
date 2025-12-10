# VACTIT

A modern online examination platform built with Next.js, designed for scalable and efficient test administration.

## Features

- Modern web interface for online examinations
- Real-time test taking and submission
- Automated scoring and results
- User authentication and authorization
- Responsive design for all devices
- Admin dashboard for test management

## Technology Stack

### Frontend
- Next.js 15 - React framework with App Router
- React 19 - UI library
- TailwindCSS 4 - Utility-first CSS
- TypeScript - Type safety
- NextAuth.js - Authentication

### Backend
- Node.js - Server runtime
- PostgreSQL - Database
- Prisma - Database ORM

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/endy1002/VACTIT.git
cd VACTIT

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Run the development server
npm run dev
```

Visit http://localhost:3000 to see the application.

## Available Scripts

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm start                # Start production server
npm run lint             # Run ESLint
```

## Project Structure

```
VACTIT/
├── src/
│   ├── apps/
│   │   └── web/                  # Main web application
│   ├── packages/                 # Shared packages
│   └── services/                 # Backend services
├── docs/                         # Documentation
└── pa/                           # Project artifacts
```


