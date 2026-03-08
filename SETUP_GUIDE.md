# Complete Setup Guide - Email-Based Login

## What Was Changed

1. **Authentication**: Changed from username to email-based login
2. **Database**: User entity now uses `email` instead of `username`
3. **Backend**: Added `/auth/profile` endpoint for frontend validation
4. **Frontend**: Updated to use email and handle new response format
5. **Redirect**: Fixed dashboard redirect path

## Prerequisites

- PostgreSQL running on localhost:5432
- Node.js installed
- Two terminal windows (one for backend, one for frontend)

## Step 1: Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Verify database connection and seed admin user
npm run verify-db

# You should see:
# ✅ Database connected
# 📊 Found 1 user(s):
#    - ID: 1, Email: admin@example.com, Role: super-admin
# ✅ Admin user already exists
```

## Step 2: Start Backend

```bash
cd backend
npm run start:dev
```

You should see:
```
✅ Server running on port 3001
✅ Admin user already exists
```

## Step 3: Test Backend Endpoints

In a new terminal, test these endpoints:

### Test 1: Backend Health Check
```bash
curl http://localhost:3001/api/auth/test
```

Expected response:
```json
{
  "message": "Backend is working",
  "timestamp": "2024-03-08T..."
}
```

### Test 2: Check Users
```bash
curl http://localhost:3001/api/auth/debug/users
```

Expected response:
```json
{
  "count": 1,
  "users": [
    {
      "id": 1,
      "email": "admin@example.com",
      "role": "super-admin",
      "hasPasswordHash": true
    }
  ]
}
```

### Test 3: Test Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"Admin@123456"}'
```

Expected response:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "admin@example.com",
    "role": "super-admin"
  }
}
```

## Step 4: Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Frontend .env is already configured to use localhost:3001
```

## Step 5: Start Frontend

```bash
cd frontend
npm run dev
```

Frontend will be available at: `http://localhost:5002`

## Step 6: Test Login

1. Open browser: `http://localhost:5002/en/login`
2. Enter credentials:
   - Email: `admin@example.com`
   - Password: `Admin@123456`
3. Click "Sign In"
4. You should be redirected to the dashboard

## Troubleshooting

### Issue: "Login failed" message

**Check 1**: Backend console shows `❌ User not found`
- Solution: Run `cd backend && npm run verify-db`

**Check 2**: Backend console shows `❌ Password mismatch`
- Solution: Delete user and reseed:
  ```bash
  # In PostgreSQL
  DELETE FROM users WHERE email = 'admin@example.com';
  
  # Restart backend
  npm run start:dev
  ```

**Check 3**: Backend not responding
- Solution: Make sure backend is running on port 3001
- Check: `curl http://localhost:3001/api/auth/test`

**Check 4**: Frontend can't reach backend
- Solution: Check `frontend/.env` has:
  ```
  NEXT_PUBLIC_API_URL=http://localhost:3001/api
  ```

### Issue: Stuck on loading screen after login

**Cause**: `/auth/profile` endpoint not working

**Solution**:
1. Check backend console for errors
2. Verify JWT token is valid
3. Check browser console (F12) for error details

### Issue: Database connection error

**Cause**: PostgreSQL not running or wrong credentials

**Solution**:
1. Start PostgreSQL
2. Check `backend/.env`:
   ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=postgres
   DB_PASS=123
   DB_NAME=stockmis
   ```

## Complete Reset

If everything is broken:

```bash
# 1. Stop both backend and frontend (Ctrl+C)

# 2. Delete and recreate database
dropdb stockmis
createdb stockmis

# 3. Restart backend
cd backend
npm run start:dev

# 4. Verify setup
npm run verify-db

# 5. In another terminal, start frontend
cd frontend
npm run dev

# 6. Try login with:
# Email: admin@example.com
# Password: Admin@123456
```

## Files Modified

### Backend
- `src/entities/user.entity.ts` - Changed username to email
- `src/auth/auth.service.ts` - Updated login logic
- `src/auth/auth.controller.ts` - Added profile endpoint
- `src/auth/jwt.strategy.ts` - Updated JWT payload
- `src/main.ts` - Updated seeding logic
- `package.json` - Added verify-db script

### Frontend
- `app/[locale]/(auth)/login/page.tsx` - Updated response handling
- `hooks/useAuth.ts` - Updated IUser interface
- `services/utils.service.ts` - Fixed redirect path
- `.env` - Updated API URL to localhost:3001

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/login` | No | Login with email/password |
| GET | `/api/auth/profile` | Yes | Get current user profile |
| GET | `/api/auth/test` | No | Health check |
| GET | `/api/auth/debug/users` | No | List all users (debug only) |

## Default Credentials

- **Email**: `admin@example.com`
- **Password**: `Admin@123456`

## Next Steps

After successful login:
1. Change the default password
2. Create additional users
3. Configure role-based access control
4. Remove debug endpoints in production
