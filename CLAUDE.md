# CLAUDE.md - AI Assistant Guide for Simple Creature Next

This document provides essential context for AI assistants working with this codebase.

## Project Overview

**Simple Creature Next** is a full-stack portfolio/CMS web application for a design-development duo. It combines a public-facing portfolio website with an admin content management system.

- **Framework**: Next.js 16 with App Router, React 19, TypeScript
- **Database**: PostgreSQL via Neon (serverless) with Drizzle ORM
- **Authentication**: Better Auth (email/password, sessions, password reset)
- **Storage**: AWS S3 for media assets
- **Styling**: SCSS modules for frontend, Tailwind CSS for admin

## Directory Structure

```
app/
├── (admin)/              # Admin routes (login, forgot-password, reset-password, admin/*)
├── (frontend)/           # Public website (home, about, work, work/[slug], contact, news)
├── api/                  # API routes (auth endpoint)
├── components/           # React components (shared + ui/)
├── contexts/             # React context providers (MenuContext)
├── db/                   # Database schema and migrations
├── hooks/                # Custom React hooks
├── lib/                  # Utilities (auth, s3, utils, schemas/)
├── styles/               # Global styles (SCSS + Tailwind entry)
├── fonts/                # Custom fonts
└── images/               # Static images and 3D models

public/                   # Static assets (videos, models)
scripts/                  # CLI utilities (create-user.ts)
```

## Import Conventions

All imports use the `@/` alias pointing to the `app/` directory:

```typescript
import { db } from "@/db"
import { Button } from "@/components/ui/button"
import { auth } from "@/lib/auth"
import styles from "@/styles/Component.module.scss"
```

## Key Commands

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run lint         # Run ESLint
npm run format       # Format with Prettier

# Database (Drizzle)
npm run db:push      # Push schema to database
npm run db:generate  # Generate migrations
npm run db:migrate   # Run migrations
npm run db:studio    # Open Drizzle Studio

# Users
npm run create-user <email> <password> [name]
```

## Code Style

- **No semicolons** (Prettier configured)
- **Print width**: 120 characters
- **TypeScript strict mode** enabled
- Use `cn()` from `@/lib/utils` for conditional class merging
- Server components by default; add `"use client"` only when needed
- Server actions use `"use server"` directive

## Styling Architecture

### Frontend (Public Pages)
Use SCSS modules with CSS variables:

```tsx
import styles from "./Component.module.scss"

export function Component() {
  return <div className={styles.container}>...</div>
}
```

Key CSS variables:
- `--spacing-xs` through `--spacing-xxl` for spacing
- `--media-radius` for rounded corners
- `--container-padding`, `--container-max-width` for layout

### Admin Pages
Use Tailwind CSS (only available in admin routes):

```tsx
export function AdminComponent() {
  return <div className="flex items-center gap-4 p-6">...</div>
}
```

Tailwind is scoped to: `app/(admin)/**`, `components/admin/**`, `components/dashboard/**`

## Database Schema

Located in `app/db/schema.ts`. Key tables:

| Table | Purpose |
|-------|---------|
| `user` | User accounts (Better Auth) |
| `session` | Active sessions |
| `account` | Auth provider accounts |
| `verification` | Email/password reset tokens |
| `project` | Portfolio projects |
| `category` | Project categories |
| `projectCategory` | Many-to-many join table |
| `asset` | Media files (images, videos, PDFs) |

### Working with the Database

```typescript
import { db } from "@/db"
import { project, asset } from "@/db/schema"
import { eq } from "drizzle-orm"

// Query
const projects = await db.select().from(project)

// Insert
await db.insert(project).values({ ... })

// Update
await db.update(project).set({ title: "New" }).where(eq(project.id, id))

// Delete
await db.delete(project).where(eq(project.id, id))
```

## Server Actions

Server actions are in `app/(admin)/admin/*/actions.ts`:

- **projects/actions.ts**: `createProject`, `getProjects`, `updateProject`, `deleteProject`
- **assets/actions.ts**: `uploadAsset`, `updateAsset`, `deleteAsset`, `getAssets`
- **categories/actions.ts**: `createCategory`, `getCategories`, `updateCategory`, `deleteCategory`
- **users/actions.ts**: `getUsers`, `getUser`, `deleteUser`

After mutations, use `revalidatePath()` to refresh cached pages:

```typescript
import { revalidatePath } from "next/cache"

revalidatePath("/work")           // Revalidate work listing
revalidatePath(`/work/${slug}`)   // Revalidate specific project
```

## Authentication

### Server-Side (Server Components/Actions)

```typescript
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

const session = await auth.api.getSession({ headers: await headers() })
if (!session) {
  redirect("/login")
}
```

### Client-Side

```typescript
"use client"
import { signIn, signOut, useSession } from "@/lib/auth-client"

const { data: session, isPending } = useSession()
await signIn.email({ email, password })
await signOut()
```

## File Uploads (S3)

```typescript
import { uploadToS3, deleteFromS3, generateS3Key } from "@/lib/s3"

// Upload
const key = generateS3Key(filename, "assets")
await uploadToS3(buffer, key, mimeType)

// Delete
await deleteFromS3(s3Key)
```

## Project Content System

Projects use a block-based content structure (JSONB). Block types:

1. **full-width-media**: Single image/video
2. **full-width-content**: Markdown text
3. **content-with-media**: Text + multiple assets with alignment options

Schema validated with Zod in `app/lib/schemas/project-content.ts`.

## Component Patterns

### UI Components
Shadcn/ui components are in `app/components/ui/`. Use these for admin interfaces:

```typescript
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
```

### Frontend Components
Custom components for the public site with GSAP animations:

```typescript
import { Hero } from "@/components/Hero"
import { ProjectCard } from "@/components/ProjectCard"
import { SplitHeading } from "@/components/SplitHeading"
```

## Environment Variables

Required in `.env.local`:

```env
DATABASE_URL=postgresql://...
NEXT_PUBLIC_APP_URL=http://localhost:3000

# AWS S3
AWS_REGION=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_S3_BUCKET=

# SendGrid (for password reset emails)
SENDGRID_API_KEY=
SENDGRID_FROM_EMAIL=
```

## Common Tasks

### Adding a New Page

**Frontend**: Create in `app/(frontend)/page-name/page.tsx`
**Admin**: Create in `app/(admin)/admin/section/page.tsx`

### Adding a Database Field

1. Update schema in `app/db/schema.ts`
2. Run `npm run db:push` (dev) or `npm run db:generate && npm run db:migrate` (prod)

### Creating an Admin User

```bash
npm run create-user admin@example.com SecurePass123 "Admin Name"
```

### Adding a New Server Action

1. Create or update file in `app/(admin)/admin/[section]/actions.ts`
2. Add `"use server"` at top of file
3. Export async function with FormData or typed parameters
4. Call `revalidatePath()` after mutations

## TypeScript Tips

- All database queries return typed results via Drizzle
- Use Zod schemas for runtime validation (see `app/lib/schemas/`)
- Asset metadata is typed by `assetType`: `ImageMetadata | VideoMetadata | PDFMetadata`

## Gotchas

1. **Tailwind only works in admin routes** - don't use utility classes in frontend components
2. **Import paths use `@/`** - the base is `app/`, not project root
3. **Server components are default** - add `"use client"` explicitly for interactivity
4. **Better Auth handles `/api/auth/*`** - don't create conflicting routes
5. **S3 URLs use `s3Url` field** - includes the full public URL from asset records
6. **Project slugs must be unique** - auto-generated from title, validated on save

## Related Documentation

- [README.AUTH.md](README.AUTH.md) - Authentication setup and examples
- [SCRIPTS.md](SCRIPTS.md) - Available npm scripts
- [TAILWIND.md](TAILWIND.md) - Tailwind CSS configuration
- [app/db/README.md](app/db/README.md) - Database setup
