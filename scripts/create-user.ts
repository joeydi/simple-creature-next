import { config } from "dotenv"
import { auth } from "@/lib/auth"

// Load environment variables from .env.local
config({ path: ".env.local" })

async function createUser() {
  const email = process.argv[2]
  const password = process.argv[3]
  const name = process.argv[4]

  if (!email || !password) {
    console.error("Usage: tsx scripts/create-user.ts <email> <password> [name]")
    process.exit(1)
  }

  try {
    const user = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name: name || email.split("@")[0],
      },
    })

    console.log("✅ User created successfully!")
    console.log("User ID:", user.user.id)
    console.log("Email:", user.user.email)
    console.log("Name:", user.user.name)
  } catch (error: any) {
    console.error("❌ Error creating user:", error.message)
    process.exit(1)
  }
}

createUser()
