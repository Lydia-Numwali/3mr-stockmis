# Troubleshooting Login Issues

## Issue: 401 Unauthorized on Login

### Step 1: Verify Database Connection

Run the database verification script:

```bash
cd backend
npm run verify-db
```

This will:
- Connect to the database
- Show all existing users
- Automatically seed the admin user if it doesn't exist

### Step 2: Check Backend Logs

When you start the backend with `npm run start:dev`, you should see:

```
✅ Server running on port 3001
✅ Admin user already exists
```

Or if seeding:

```
✅ Server running on port 3001
✅ Admin seeded successfully
   Email: admin@example.com
   Password: Admin@123456
   ID: 1
```

### Step 3: Debug Login Endpoint

Check the backend console logs when attempting login. You should see:

```
🔍 Login attempt for email: admin@example.com
✅ User found: admin@example.com
✅ Password valid for: admin@example.com
```

If you see `❌ User not found`, the admin user wasn't seeded.

### Step 4: Check Database Directly

Connect to PostgreSQL and verify:

```sql
-- Connect to stockmis database
\c stockmis

-- Check users table
SELECT id, email, role, "createdAt" FROM users;

-- If empty, manually insert admin
INSERT INTO users (email, "passwordHash", role, "createdAt") 
VALUES ('admin@example.com', '$2b$10$...', 'super-admin', NOW());
```

### Step 5: Verify Frontend Configuration

Check `frontend/.env`:

```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

The endpoint should be: `http://localhost:3001/api/auth/login`

### Step 6: Debug Endpoint

Visit this URL in your browser to see all users:

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
      "role": "super-admin"
    }
  ]
}
```

## Common Issues

### Issue: Database Connection Failed

**Error:** `connect ECONNREFUSED 127.0.0.1:5432`

**Solution:**
1. Ensure PostgreSQL is running
2. Check `.env` file has correct DB credentials:
   ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=postgres
   DB_PASS=123
   DB_NAME=stockmis
   ```

### Issue: User Not Found

**Error:** `❌ User not found: admin@example.com`

**Solution:**
1. Run `npm run verify-db` to seed the user
2. Or manually run the seed script: `npm run seed`

### Issue: Password Mismatch

**Error:** `❌ Password mismatch for: admin@example.com`

**Solution:**
1. Ensure you're using the correct password: `Admin@123456`
2. Delete the user and reseed:
   ```sql
   DELETE FROM users WHERE email = 'admin@example.com';
   ```
3. Restart the backend to auto-seed

### Issue: CORS Error

**Error:** `Access to XMLHttpRequest blocked by CORS policy`

**Solution:**
- Backend already has CORS enabled: `app.enableCors({ origin: '*' })`
- If still failing, check frontend is using correct API URL

## Quick Reset

To completely reset and start fresh:

```bash
# 1. Delete the database
dropdb stockmis

# 2. Recreate the database
createdb stockmis

# 3. Restart backend (will auto-create tables and seed admin)
npm run start:dev

# 4. Verify
npm run verify-db
```

## Login Credentials

After successful setup:

- **Email:** `admin@example.com`
- **Password:** `Admin@123456`
