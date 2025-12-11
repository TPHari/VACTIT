This guide is for the development team to set up, test, and deploy the VACTIT application.

## Table of Contents
1. [Local Development Setup](#local-development-setup)
2. [Testing Guide](#testing-guide)
3. [Deployment Guide](#deployment-guide)
4. [Troubleshooting](#troubleshooting)

---

## Local Development Setup

### Prerequisites

Before you begin, ensure you have the following installed:
- Node.js 18.x or higher
- npm or yarn
- Git
- PostgreSQL (or Supabase account)
- Redis (optional, for background jobs)

### Step 1: Clone the Repository

```bash
git clone https://github.com/endy1002/VACTIT.git
cd VACTIT
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Environment Configuration

#### API Service Configuration

Create `src/services/api/.env`:

```env
# Database Configuration
DATABASE_URL="postgresql://user:password@host:5432/database?pgbouncer=true"

# Redis Configuration (optional)
REDIS_URL="redis://localhost:6379"

# Environment
NODE_ENV="development"

# CORS Configuration
FRONTEND_URL="http://localhost:3000"

# Server Port
PORT=3001
```

**Important Notes:**
- For Supabase, use the connection pooling URL (port 6543 with `?pgbouncer=true`)
- Replace `user`, `password`, `host`, and `database` with your actual values
- Redis is optional; if not available, queue features will be disabled

#### Web App Configuration

Create `src/apps/web/.env.local`:

```env
# API Configuration
NEXT_PUBLIC_API_URL="http://localhost:3001"

# NextAuth Configuration
NEXTAUTH_SECRET="generate-a-random-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# Environment
NODE_ENV="development"
```

**Generating NEXTAUTH_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 4: Database Setup

#### Generate Prisma Client

```bash
npm run prisma:generate
```

#### Run Database Migrations

```bash
npm run prisma:migrate
```

This will create all necessary tables in your PostgreSQL database.

#### Verify Database (Optional)

```bash
npm run prisma:studio
```

This opens Prisma Studio at http://localhost:5555 where you can view and edit data.

### Step 5: Start Development Servers

#### Option 1: Run All Services Together

```bash
npm run dev:all
```

This starts:
- Web app on http://localhost:3000
- API service on http://localhost:3001
- Worker service (if Redis is configured)

#### Option 2: Run Services Individually

**Terminal 1 - API Service:**
```bash
npm run dev:api
```

**Terminal 2 - Web App:**
```bash
npm run dev
```

**Terminal 3 - Worker Service (optional):**
```bash
npm run dev:worker
```

### Step 6: Verify Installation

1. **Web App**: Visit http://localhost:3000
2. **API Health**: Visit http://localhost:3001/health
3. **API Endpoints**: Visit http://localhost:3001/api

Expected API health response:
```json
{
  "status": "ok",
  "timestamp": "2025-12-10T...",
  "database": "connected",
  "redis": "connected" | "not configured",
  "uptime": 123.45
}
```

---

## Testing Guide

### Manual Testing

#### 1. Test User Registration

```bash
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "testpassword123"
  }'
```

Expected Response:
```json
{
  "data": {
    "user_id": "test@example.com",
    "email": "test@example.com",
    "name": "Test User",
    "role": "Student"
  }
}
```

#### 2. Test User Login

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpassword123"
  }'
```

Expected Response:
```json
{
  "data": {
    "user": {
      "user_id": "test@example.com",
      "email": "test@example.com",
      "name": "Test User",
      "role": "Student"
    }
  }
}
```

#### 3. Test API Endpoints

**Get All Users:**
```bash
curl http://localhost:3001/api/users
```

**Get All Tests:**
```bash
curl http://localhost:3001/api/tests
```

**Get All Trials:**
```bash
curl http://localhost:3001/api/trials
```

### Frontend Testing Checklist

1. **Authentication Flow**
   - [ ] Visit http://localhost:3000/auth/signup
   - [ ] Register a new user
   - [ ] Verify redirect to login page
   - [ ] Login with created credentials
   - [ ] Verify successful authentication

2. **Test Taking Flow**
   - [ ] Navigate to exam list
   - [ ] Select a test
   - [ ] Complete test questions
   - [ ] Submit test
   - [ ] Verify result display

3. **Responsive Design**
   - [ ] Test on mobile viewport (375px)
   - [ ] Test on tablet viewport (768px)
   - [ ] Test on desktop viewport (1920px)

### Backend Testing Checklist

1. **Database Connection**
   - [ ] Verify Prisma can connect: `npm run prisma:studio`
   - [ ] Check migrations are up to date

2. **API Endpoints**
   - [ ] All endpoints return proper status codes
   - [ ] Error responses are properly formatted
   - [ ] Authentication endpoints work correctly

3. **Background Jobs (if Redis configured)**
   - [ ] Queue accepts jobs: `curl http://localhost:3001/health/queue`
   - [ ] Worker processes jobs
   - [ ] Job status can be queried

### Common Test Scenarios

#### Scenario 1: New User Registration and Test Taking

1. Register new user via signup page
2. Login with credentials
3. Navigate to available tests
4. Start a test
5. Answer questions
6. Submit test
7. View results

#### Scenario 2: Admin Test Management

1. Login as admin user
2. Navigate to admin dashboard
3. Create new test
4. Upload test questions
5. Publish test
6. Verify test appears in student view

---


