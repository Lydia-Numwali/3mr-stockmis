# Quick Start - 5 Minutes to Login

## Terminal 1: Backend

```bash
cd backend
npm install
npm run verify-db
npm run start:dev
```

Wait for: `✅ Server running on port 3001`

## Terminal 2: Frontend

```bash
cd frontend
npm install
npm run dev
```

Wait for: `▲ Next.js ... ready - started server on 0.0.0.0:5002`

## Browser

1. Open: `http://localhost:5002/en/login`
2. Email: `admin@example.com`
3. Password: `Admin@123456`
4. Click "Sign In"

## If It Doesn't Work

### Backend console shows "User not found"
```bash
cd backend
npm run verify-db
npm run start:dev
```

### Still getting "Login failed"
```bash
# Test the endpoint
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"Admin@123456"}'
```

Check the response for error details.

### Database connection error
```bash
# Make sure PostgreSQL is running
# Check backend/.env has correct credentials
# Default: postgres/123 on localhost:5432
```

## That's It!

You should now be logged in and see the dashboard.

For detailed troubleshooting, see `SETUP_GUIDE.md` or `DEBUG_LOGIN.md`
