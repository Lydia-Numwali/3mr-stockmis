# Middleware Fix - Role Field Mismatch

## The Problem

The middleware was checking for `decoded.user_type` but the backend JWT token contains `role` field instead.

**Backend JWT payload:**
```json
{
  "sub": 2,
  "email": "admin@example.com",
  "role": "super-admin",  // ← This field
  "iat": 1772969461,
  "exp": 1773574261
}
```

**Middleware was checking:**
```javascript
if (decoded.user_type === "SUPER_ADMIN")  // ← This doesn't exist!
```

This caused the middleware to redirect to `/unauthorized` because the role check failed.

## The Solution

Updated middleware to check BOTH fields:
```javascript
const userType = decoded.user_type || decoded.role;

if (userType === "SUPER_ADMIN" || userType === "super-admin") {
  // Allow access
}
```

Now it checks:
1. `decoded.user_type` (old format)
2. `decoded.role` (new format from backend)
3. Both uppercase and lowercase variants

## What Changed

**File:** `frontend/middleware.ts`

1. **Auth route redirect** - Now checks both `user_type` and `role`
2. **Protected route validation** - Now checks both fields with case-insensitive matching

## How to Test

1. **Restart frontend** (middleware runs on server):
   ```bash
   cd frontend
   npm run dev
   ```

2. **Try login**:
   - URL: `http://localhost:5002/en/login`
   - Email: `admin@example.com`
   - Password: `Admin@123456`

3. **You should now see the dashboard** ✅

## Expected Flow

```
Login
  ↓
Backend returns JWT with role: "super-admin"
  ↓
Frontend stores token
  ↓
Redirect to /super-admin/dashboard
  ↓
Middleware checks token
  ↓
Finds role: "super-admin"
  ↓
Allows access ✅
  ↓
Dashboard loads
```

## If Still Not Working

Check:
1. Is token being stored? (Check Application tab → Cookies)
2. Is middleware running? (Check server logs)
3. Is role in JWT? (Decode token at jwt.io)

The middleware should now allow access to the dashboard!
