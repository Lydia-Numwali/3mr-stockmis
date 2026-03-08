# Complete Login Troubleshooting Guide

## What I Just Fixed

I've added **detailed logging** to both frontend and backend so we can see exactly where the login is failing.

## How to Get the Error Details

### 1. Open Browser Developer Tools

- Press **F12** on your keyboard
- Go to the **Console** tab
- You should see logs like:
  ```
  🔐 Attempting login with email: admin@example.com
  ```

### 2. Try to Login

- Go to `http://localhost:5002/en/login`
- Enter:
  - Email: `admin@example.com`
  - Password: `Admin@123456`
- Click "Sign In"

### 3. Check Console Logs

You should see one of these scenarios:

#### Scenario A: Successful Login
```
🔐 Attempting login with email: admin@example.com
✅ Login response received: {accessToken: "...", user: {...}}
```
Then you'll be redirected to the dashboard.

#### Scenario B: Backend Error
```
🔐 Attempting login with email: admin@example.com
❌ Login request failed: {
  status: 401,
  statusText: "Unauthorized",
  data: {message: "Invalid credentials"},
  message: "Request failed with status code 401"
}
```

#### Scenario C: Network Error
```
🔐 Attempting login with email: admin@example.com
❌ Login request failed: {
  status: undefined,
  message: "Network Error" or "CORS error"
}
```

#### Scenario D: Backend Not Running
```
🔐 Attempting login with email: admin@example.com
❌ Login request failed: {
  message: "connect ECONNREFUSED 127.0.0.1:3001"
}
```

---

## Troubleshooting by Scenario

### Scenario A: Successful Login ✅
**Status**: Everything is working! You should be on the dashboard.

---

### Scenario B: 401 Unauthorized ❌

**Cause**: Backend rejected the credentials

**Check 1**: Is the admin user in the database?
```bash
curl http://localhost:3001/api/auth/debug/users
```

Should show:
```json
{
  "count": 1,
  "users": [{"id": 1, "email": "admin@example.com", ...}]
}
```

If `count` is 0, seed the user:
```bash
cd backend
npm run verify-db
```

**Check 2**: Is the password correct?
- Try: `admin@example.com` / `Admin@123456`
- If still fails, delete and reseed:
  ```bash
  # In PostgreSQL
  DELETE FROM users WHERE email = 'admin@example.com';
  
  # Restart backend
  cd backend
  npm run start:dev
  ```

**Check 3**: Check backend console logs
When you try to login, you should see:
```
📨 Login request received: { email: 'admin@example.com' }
🔍 Login attempt for email: admin@example.com
✅ User found: admin@example.com
✅ Password valid for: admin@example.com
✅ Login successful for: admin@example.com
```

If you see `❌ User not found`, the user isn't in the database.
If you see `❌ Password mismatch`, the password is wrong.

---

### Scenario C: Network Error ❌

**Cause**: Frontend can't reach backend

**Check 1**: Is backend running?
```bash
curl http://localhost:3001/api/auth/test
```

Should return:
```json
{"message": "Backend is working", "timestamp": "..."}
```

If fails, start backend:
```bash
cd backend
npm run start:dev
```

**Check 2**: Is frontend configured correctly?
Check `frontend/.env`:
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

If changed, restart frontend:
```bash
cd frontend
npm run dev
```

**Check 3**: Check browser console for CORS errors
If you see "CORS error", the backend CORS is misconfigured.
Backend should have: `app.enableCors({ origin: '*' })`

---

### Scenario D: Backend Not Running ❌

**Cause**: Backend is not listening on port 3001

**Solution**:
```bash
cd backend
npm run start:dev
```

Wait for:
```
✅ Server running on port 3001
✅ Admin user already exists
```

---

## Complete Diagnostic Checklist

- [ ] Backend is running on port 3001
- [ ] Frontend is running on port 5002
- [ ] PostgreSQL is running on port 5432
- [ ] Admin user exists in database (check with `/api/auth/debug/users`)
- [ ] Frontend `.env` has `NEXT_PUBLIC_API_URL=http://localhost:3001/api`
- [ ] Backend `.env` has correct database credentials
- [ ] No CORS errors in browser console
- [ ] Backend console shows login attempt logs

---

## Quick Reset

If everything is broken:

```bash
# 1. Stop backend and frontend (Ctrl+C in both terminals)

# 2. Delete and recreate database
dropdb stockmis
createdb stockmis

# 3. Restart backend
cd backend
npm run start:dev

# 4. In another terminal, restart frontend
cd frontend
npm run dev

# 5. Try login with:
# Email: admin@example.com
# Password: Admin@123456
```

---

## Next Steps

1. **Try to login** and check the console logs
2. **Share the console output** from the "❌ Login request failed" message
3. **Share the backend console output** when you try to login
4. I'll help you fix the specific issue

The detailed logging should now tell us exactly what's going wrong!
