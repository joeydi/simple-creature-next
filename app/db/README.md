# Database Setup

This project uses [Drizzle ORM](https://orm.drizzle.team/) with [Neon Database](https://neon.tech/) (serverless Postgres).

## Setup

1. **Create a Neon Database**
   - Go to [neon.tech](https://neon.tech/) and create a new project
   - Copy your connection string

2. **Configure Environment Variables**
   - Copy `.env.example` to `.env.local`
   - Add your Neon database connection string:
     ```
     DATABASE_URL=postgresql://username:password@host/database?sslmode=require
     ```

3. **Push Schema to Database**
   ```bash
   npm run db:push
   ```

## Available Scripts

- `npm run db:generate` - Generate SQL migration files from schema changes
- `npm run db:migrate` - Apply migrations to the database
- `npm run db:push` - Push schema changes directly to the database (good for development)
- `npm run db:studio` - Open Drizzle Studio to view and edit your database

## Schema

The database schema is defined in `db/schema.ts`. Modify this file to add or change tables.

Example tables included:
- `users` - User accounts
- `posts` - Blog posts or content

## Usage in API Routes

```typescript
import { db } from "@/db"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"

// Select all users
const allUsers = await db.select().from(users)

// Select a single user
const user = await db.select().from(users).where(eq(users.id, 1))

// Insert a new user
const newUser = await db.insert(users).values({
  name: "John Doe",
  email: "john@example.com",
})

// Update a user
await db.update(users).set({ name: "Jane Doe" }).where(eq(users.id, 1))

// Delete a user
await db.delete(users).where(eq(users.id, 1))
```

## Learn More

- [Drizzle ORM Documentation](https://orm.drizzle.team/docs/overview)
- [Neon Documentation](https://neon.tech/docs)
- [Drizzle with Neon Guide](https://orm.drizzle.team/docs/get-started-postgresql#neon)
