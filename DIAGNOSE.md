# Diagnostic Steps - Find the Exact Error

## Step 1: Check Backend is Running

Open your browser and visit:
```
http://localhost:3001/api/auth/test
```

**Expected**: JSON response with `message: "Backend is working"`

**If fails**: Backend is not running. Run: `cd backend && npm run start:dev`

---

## Step 2: Check Admin User Exists

Visit:
```
http://localhost:3001/api/auth/debug/users
```

**Expected**: 
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

**If count is 0**: Run `cd backend && npm run verify-db`

---

## Step 3: Test Backend Login Directly

Run this in your terminal:

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"Admin@123456"}'
```

**Expected**: 
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

**If error**: Share the error response

---

## Step 4: Check Frontend Configuration

Verify `frontend/.env` contains:
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

If changed, restart frontend: `cd frontend && npm run dev`

---

## Step 5: Check Browser Console

1. Open `http://localhost:5002/en/login`
2. Press F12 to open Developer Tools
3. Go to **Console** tab
4. Try to login
5. **Share any error messages you see**

---

## Step 6: Check Network Tab

1. Open `http://localhost:5002/en/login`
2. Press F12 to open Developer Tools
3. Go to **Network** tab
4. Try to login
5. Look for the `login` request
6. Click on it and check:
   - **Status**: Should be 200 (success) or 401 (invalid credentials)
   - **Response**: Should show the error or success message
7. **Share the response**

---

## Step 7: Check Backend Console

When you try to login from the frontend, your backend console should show:

```
📨 Login request received: { email: 'admin@example.com' }
🔍 Login attempt for email: admin@example.com
✅ User found: admin@example.com
✅ Password valid for: admin@example.com
✅ Login successful for: admin@example.com
```

**If you see different messages, share them**

---

## What to Share

To help debug, please provide:

1. **Backend console output** when you try to login
2. **Browser console error** (F12 → Console tab)
3. **Network response** (F12 → Network tab → click login request → Response tab)
4. **Output from curl command** (Step 3)
5. **Output from debug/users endpoint** (Step 2)

This will help identify exactly where the login is failing.
