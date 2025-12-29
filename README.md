# VACTIT

A modern online examination platform built with Next.js, designed for scalable and efficient test administration.

## Project Structure

This is a **monorepo** project organized using npm workspaces, containing multiple applications and services:

```
VACTIT/
├── src/
│   ├── apps/                    # Frontend Applications
│   │   └── web/                 # Next.js Web Application
│   │       ├── app/             # Next.js App Router pages
│   │       ├── components/      # React components
│   │       ├── features/        # Feature-specific code
│   │       ├── lib/             # Utility libraries
│   │       └── prisma/          # Database schema & client
│   │
│   ├── services/                # Backend Services
│   │   ├── api/                 # REST API Server
│   │   │   ├── src/             # API source code
│   │   │   └── prisma/          # Database migrations & schema
│   │   └── worker/              # Background Workers
│   │       └── src/             # Worker scripts (scoring, etc.)
│   │
│   ├── packages/                # Shared Packages
│   │   ├── config/              # Shared configuration
│   │   ├── types/               # Shared TypeScript types
│   │   └── ui/                  # Shared UI components
│   │
│   └── infra/                   # Infrastructure
│       └── docker/              # Docker configurations
│           ├── Dockerfile.api   # API container
│           ├── Dockerfile.web   # Web container
│           ├── Dockerfile.worker # Worker container
│           └── docker-compose.yml
│
├── docs/                        # Documentation
├── pa/                          # Project artifacts
└── public/                      # Static assets
    └── uploads/                 # User-uploaded files
```

### Main Components

#### Web Application (`src/apps/web/`)
- **Frontend**: Next.js 15 with React 19
- **Routing**: App Router with dynamic routes
- **Features**: Exam taking, results, admin dashboard, authentication
- **Styling**: TailwindCSS 4

#### API Service (`src/services/api/`)
- **Backend**: Node.js REST API
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT-based auth
- **Routes**: Admin, auth, exam management

#### Worker Service (`src/services/worker/`)
- **Purpose**: Background task processing
- **Tasks**: Exam scoring, data processing

####Shared Packages (`src/packages/`)
- **config**: Environment & app configuration
- **types**: Shared TypeScript interfaces
- **ui**: Reusable UI components

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


