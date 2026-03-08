# Test Login - Step by Step

## Step 1: Test Backend Connection

Open your browser and visit:
```
http://localhost:3001/api/auth/test
```

You should see:
```json
{
  "message": "Backend is working",
  "timestamp": "2024-03-08T..."
}
```

If this doesn't work, the backend isn't running or the URL is wrong.

## Step 2: Check Users in Database

Visit:
```
http://localhost:3001/api/auth/debug/users
```

You should see:
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

If `count` is 0, the admin user doesn't exist. Run:
```bash
cd backend
npm run verify-db
```

## Step 3: Test Login with curl

Run this command in your terminal:

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

If you get an error, check the backend console for logs.

## Step 4: Check Backend Console

When you run the curl command above, your backend console should show:

```
📨 Login request received: { email: 'admin@example.com' }
🔍 Login attempt for email: admin@example.com
✅ User found: admin@example.com
✅ Password valid for: admin@example.com
✅ Login successful for: admin@example.com
```

If you see `❌ User not found`, the admin user isn't in the database.
If you see `❌ Password mismatch`, the password is wrong.

## Step 5: Try Frontend Login

Once curl works, try the frontend login page:
```
http://localhost:5002/en/login
```

Use:
- Email: `admin@example.com`
- Password: `Admin@123456`

## Troubleshooting

### Backend not responding
- Make sure backend is running: `cd backend && npm run start:dev`
- Check it's on port 3001

### No users in database
- Run: `cd backend && npm run verify-db`
- This will seed the admin user

### Password mismatch
- Delete the user: `DELETE FROM users WHERE email = 'admin@example.com';`
- Restart backend to auto-seed with correct password

### Still getting "Login failed"
- Check browser console (F12) for error details
- Check backend console for logs
- Share the error message from either console
