# Project Scripts

This document describes the available scripts for managing your application.

## User Management

### Create User

Create a new user account without using the signup form. This is useful for creating admin accounts or seeding initial users.

**Usage:**
```bash
npm run create-user <email> <password> [name]
```

**Arguments:**
- `email` (required) - User's email address
- `password` (required) - User's password (will be hashed automatically)
- `name` (optional) - User's display name (defaults to part before @ in email)

**Examples:**

Create a user with email, password, and name:
```bash
npm run create-user admin@example.com SecurePass123 "Admin User"
```

Create a user with just email and password:
```bash
npm run create-user user@example.com MyPassword123
```

**What it does:**
- Uses Better Auth's server-side API
- Automatically hashes the password with bcrypt
- Creates all necessary database records (user + account)
- Sets `emailVerified` to false by default
- Returns the created user ID, email, and name

**Script location:** `scripts/create-user.ts`

## Database Scripts

### Generate Migrations
```bash
npm run db:generate
```
Generates SQL migration files from schema changes.

### Run Migrations
```bash
npm run db:migrate
```
Applies pending migrations to the database.

### Push Schema
```bash
npm run db:push
```
Pushes schema changes directly to the database (useful for development).

### Open Database Studio
```bash
npm run db:studio
```
Opens Drizzle Studio - a visual database browser and editor.

## Development Scripts

### Dev Server
```bash
npm run dev
```
Starts the Next.js development server on http://localhost:3000

### Build
```bash
npm run build
```
Creates an optimized production build.

### Start Production Server
```bash
npm run start
```
Starts the production server (requires `npm run build` first).

### Lint
```bash
npm run lint
```
Runs ESLint to check code quality.

## Notes

- All scripts that interact with the database require `DATABASE_URL` to be set in `.env.local`
- User creation requires the database schema to be pushed first (`npm run db:push`)
- For security, avoid hardcoding passwords in scripts - always pass them as arguments
