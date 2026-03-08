# Debug Login Issues - Step by Step

## What We Fixed

1. **Backend response format**: Changed from `access_token` to `accessToken` to match frontend expectations
2. **Frontend error handling**: Now shows actual error messages from the backend
3. **Added logging**: Both backend and frontend now log detailed information

## Step 1: Check Backend Logs

When you try to login, check your backend console (`npm run start:dev`). You should see:

```
🔍 Login attempt for email: admin@example.com
✅ User found: admin@example.com
✅ Password valid for: admin@example.com
```

If you see `❌ User not found`, the admin user doesn't exist in the database.

## Step 2: Verify Admin User Exists

Run this command in the backend folder:

```bash
npm run verify-db
```

Expected output:

```
🔌 Connecting to database...
✅ Database connected

📊 Found 1 user(s):
   - ID: 1, Email: admin@example.com, Role: super-admin

✅ Admin user already exists
✅ Database verification complete
```

If no users are found, the script will automatically seed the admin user.

## Step 3: Check Frontend Console

Open your browser's developer console (F12) at `http://localhost:5002/en/login` and look for:

1. **Network tab**: Check the POST request to `http://localhost:3001/api/auth/login`
   - Status should be 200 (success) or 401 (invalid credentials)
   - Response should contain `accessToken`

2. **Console tab**: Look for any error messages2. **Console tab**: Look for any error messages

## Step 4: Manual Test with curl

Test the login endpoint directly:

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

## Step 5: Check Debug Endpoint

Visit this URL in your browser:

```
http://localhost:3001/api/auth/debug/users
```

Should show:

```json
{
  "count": 1,
  "users": [
    {
      "id": 1,
      "email": "admin@example.com",
      "role": "super-admin"
    }
  ]
}
```

## Common Issues & Solutions

### Issue: "User not found"

**Cause**: Admin user not in database

**Solution**:
```bash
cd backend
npm run verify-db
```

### Issue: "Password mismatch"

**Cause**: Wrong password or password hash corrupted

**Solution**:
1. Delete the user from database:
   ```sql
   DELETE FROM users WHERE email = 'admin@example.com';
   ```
2. Restart backend to auto-seed with correct password

### Issue: "Login failed" (generic error)

**Cause**: Could be any error

**Solution**:
1. Check browser console for detailed error message
2. Check backend console logs
3. Check network tab in browser DevTools

### Issue: Database connection error

**Cause**: PostgreSQL not running or wrong credentials

**Solution**:
1. Verify PostgreSQL is running
2. Check `.env` file in backend folder:
   ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=postgres
   DB_PASS=123
   DB_NAME=stockmis
   ```

## Complete Reset

If everything is broken, do a complete reset:

```bash
# 1. Stop the backend (Ctrl+C)

# 2. Delete and recreate database
dropdb stockmis
createdb stockmis

# 3. Restart backend
cd backend
npm run start:dev

# 4. Verify
npm run verify-db

# 5. Try login with:
# Email: admin@example.com
# Password: Admin@123456
```

## Login Credentials

- **Email**: `admin@example.com`
- **Password**: `Admin@123456`

## Files Modified

- `backend/src/auth/auth.service.ts` - Changed response format
- `frontend/app/[locale]/(auth)/login/page.tsx` - Updated to handle new response format
- `backend/src/main.ts` - Added better logging
- `backend/src/auth/auth.controller.ts` - Added debug endpoint
