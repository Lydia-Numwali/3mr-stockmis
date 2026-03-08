# Authentication Migration: Username to Email

## Changes Made

### Backend Changes

1. **User Entity** (`src/entities/user.entity.ts`)
   - Changed `username` field to `email` (unique constraint maintained)
   - Updated default role from `manager` to `super-admin`

2. **Auth Service** (`src/auth/auth.service.ts`)
   - Updated `login()` method to accept `email` instead of `username`
   - JWT payload now includes `email` instead of `username`

3. **Auth Controller** (`src/auth/auth.controller.ts`)
   - Updated `LoginDto` to use `email` field instead of `username`

4. **JWT Strategy** (`src/auth/jwt.strategy.ts`)
   - Updated `validate()` method to return `email` instead of `username`

5. **Main Bootstrap** (`src/main.ts`)
   - Updated seeding logic to use email-based authentication
   - Default admin credentials: `admin@example.com` / `Admin@123456`

### Frontend Changes

1. **Auth Hook** (`hooks/useAuth.ts`)
   - Updated `IUser` interface to use `email` instead of `username`

2. **Login Page** (`app/[locale]/(auth)/login/page.tsx`)
   - Already configured to use email field (no changes needed)

3. **Auth Schema** (`lib/schema/auth.ts`)
   - Already configured for email validation (no changes needed)

## Database Migration

Since `synchronize: true` is enabled in TypeOrmModule, the database schema will be automatically updated on the next application start.

### Manual Migration (if needed)

If you need to manually migrate existing data:

```sql
-- Add email column if it doesn't exist
ALTER TABLE users ADD COLUMN email VARCHAR UNIQUE;

-- Copy username to email (if you have existing users)
UPDATE users SET email = username WHERE email IS NULL;

-- Drop username column
ALTER TABLE users DROP COLUMN username;
```

## Running the Application

1. **Start the backend:**
   ```bash
   cd backend
   npm install
   npm run start:dev
   ```

2. **Seed admin user (optional):**
   ```bash
   npm run seed
   ```

## Default Admin Credentials

- **Email:** `admin@example.com`
- **Password:** `Admin@123456`

The admin user will be automatically seeded when the application starts if it doesn't already exist.

## Testing Login

Use the frontend login page at `http://localhost:3000/[locale]/login` with:
- Email: `admin@example.com`
- Password: `Admin@123456`
