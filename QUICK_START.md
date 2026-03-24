# Quick Start Guide

## Current Status

The application is fully functional and uses **in-memory storage** for development until the Supabase database password is configured.

## ✅ What's Working

- User signup and login
- Session management
- All security features (rate limiting, helmet headers)
- Logging and monitoring
- GDPR endpoints
- Health checks

## 🚀 Running the Application

### Start Development Server

```bash
npm run dev
```

This will start:
- Frontend on `http://localhost:5173`
- Backend API on `http://localhost:5000`

### Test the Authentication

**Signup:**
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

**Health Check:**
```bash
curl http://localhost:5000/health
```

## 📊 Database Configuration (Optional)

The system automatically falls back to in-memory storage when `DATABASE_URL` is not set. This is perfect for development!

### To Enable Persistent Database Storage:

1. Get your Supabase database password from the Supabase dashboard:
   - Go to Project Settings → Database
   - Copy the connection string

2. Update `.env`:
   ```bash
   DATABASE_URL=postgresql://postgres.nbekawtjcmycdcvfygtt:YOUR_ACTUAL_PASSWORD@aws-0-us-west-1.pooler.supabase.com:6543/postgres
   ```

3. Restart the server - it will automatically use the database

## 🎯 Key Features

### Security
- ✅ Helmet security headers
- ✅ Rate limiting (bypassed in test mode)
- ✅ Account lockout after 5 failed attempts
- ✅ Secure session management
- ✅ Password hashing with bcrypt

### Logging
- ✅ Structured Winston logging
- ✅ Correlation IDs for request tracing
- ✅ Audit logging for sensitive operations

### Monitoring
- ✅ `/health` - Service health
- ✅ `/health/db` - Database connectivity
- ✅ `/health/ready` - Readiness probe

### GDPR Compliance
- ✅ `/api/gdpr/export` - Export user data
- ✅ `/api/gdpr/delete-account` - Delete account
- ✅ `/api/gdpr/privacy-policy` - Privacy policy

## 🔄 Switching Between Storage Modes

The system automatically detects whether to use database or in-memory storage:

**In-Memory Mode** (current):
- No `DATABASE_URL` in `.env`
- Perfect for development and testing
- Data resets when server restarts
- All features work normally

**Database Mode**:
- Valid `DATABASE_URL` in `.env`
- Persistent data storage
- Production-ready
- All advanced features available

## 📝 Notes

- The build is successful: `npm run build` ✅
- Frontend tests pass: All 6 test files ✅
- Backend tests need database or mocking (known issue)
- Server starts and runs without database connection

## 🎉 You're Ready!

The application is fully functional right now. Try signing up through the UI and explore the features. When you're ready for persistent storage, just add the DATABASE_URL to your `.env` file.
