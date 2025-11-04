# Authentication with Better Auth

This project uses [Better Auth](https://www.better-auth.com/) for authentication - a comprehensive, type-safe auth library for TypeScript.

## Features

- ✅ Email/Password authentication
- ✅ OAuth providers (Google, GitHub, etc.) - easy to add
- ✅ Session management with IP and user agent tracking
- ✅ Email verification
- ✅ Password reset
- ✅ Type-safe client and server APIs
- ✅ Secure by default (httpOnly cookies, CSRF protection)

## Setup

### 1. Environment Variables

Add to your `.env.local`:

```env
DATABASE_URL=your_neon_connection_string
NEXT_PUBLIC_APP_URL=http://localhost:3000  # Change in production
```

### 2. Push Database Schema

```bash
npm run db:push
```

## Usage

### Client-Side (React Components)

```tsx
"use client"

import { signIn, signUp, signOut, useSession } from "@/lib/auth-client"

export function AuthExample() {
  const { data: session, isPending } = useSession()

  const handleSignUp = async () => {
    await signUp.email({
      email: "user@example.com",
      password: "securepassword",
      name: "John Doe",
    })
  }

  const handleSignIn = async () => {
    await signIn.email({
      email: "user@example.com",
      password: "securepassword",
    })
  }

  const handleSignOut = async () => {
    await signOut()
  }

  if (isPending) return <div>Loading...</div>

  if (!session) {
    return (
      <div>
        <button onClick={handleSignIn}>Sign In</button>
        <button onClick={handleSignUp}>Sign Up</button>
      </div>
    )
  }

  return (
    <div>
      <p>Welcome, {session.user.name}!</p>
      <button onClick={handleSignOut}>Sign Out</button>
    </div>
  )
}
```

### Server-Side (API Routes, Server Components)

```tsx
import { auth } from "@/lib/auth-server"
import { headers } from "next/headers"

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  return Response.json({ user: session.user })
}
```

### Server Components

```tsx
import { auth } from "@/lib/auth-server"
import { headers } from "next/headers"

export default async function ProtectedPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect("/login")
  }

  return <div>Welcome, {session.user.name}!</div>
}
```

## API Endpoints

Better Auth automatically creates these endpoints at `/api/auth/*`:

- `POST /api/auth/sign-up/email` - Register with email/password
- `POST /api/auth/sign-in/email` - Sign in with email/password
- `POST /api/auth/sign-out` - Sign out
- `GET /api/auth/get-session` - Get current session
- `POST /api/auth/forget-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `POST /api/auth/verify-email` - Verify email

## Adding OAuth Providers

### 1. Add environment variables

```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### 2. Update Better Auth config

Edit [lib/auth-server.ts](lib/auth-server.ts):

```typescript
export const auth = betterAuth({
  // ... existing config
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },
})
```

### 3. Use in client

```tsx
import { authClient } from "@/lib/auth-client"

// Sign in with Google
await authClient.signIn.social({
  provider: "google",
})

// Sign in with GitHub
await authClient.signIn.social({
  provider: "github",
})
```

## Database Schema

Better Auth uses these tables (already configured in [db/schema.ts](db/schema.ts)):

- **user** - User accounts
- **session** - Active sessions with IP/user agent tracking
- **account** - OAuth provider accounts
- **verification** - Email verification and password reset tokens

## Security Features

- Passwords are hashed with bcrypt
- Sessions use secure httpOnly cookies
- CSRF protection enabled by default
- IP address and user agent tracking for session security
- Text-based IDs (UUIDs) prevent enumeration attacks
- Automatic session expiration

## Learn More

- [Better Auth Documentation](https://www.better-auth.com/docs)
- [Better Auth GitHub](https://github.com/better-auth/better-auth)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Neon Database](https://neon.tech/)

## Example: Login Page

```tsx
"use client"

import { useState } from "react"
import { signIn } from "@/lib/auth-client"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      await signIn.email({
        email,
        password,
      })
      router.push("/dashboard")
    } catch (err) {
      setError("Invalid email or password")
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button type="submit">Sign In</button>
    </form>
  )
}
```

## Example: Registration Page

```tsx
"use client"

import { useState } from "react"
import { signUp } from "@/lib/auth-client"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      await signUp.email({
        email,
        password,
        name,
      })
      router.push("/dashboard")
    } catch (err) {
      setError("Registration failed. Email may already be in use.")
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
        required
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
        minLength={8}
      />
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button type="submit">Sign Up</button>
    </form>
  )
}
```
