import { betterAuth } from "better-auth"
import { admin } from "better-auth/plugins"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { nextCookies } from "better-auth/next-js"
import { db } from "@/db"
import * as schema from "@/db/schema"
import sgMail from "@sendgrid/mail"

// Configure SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      const msg = {
        to: user.email,
        from: process.env.SENDGRID_FROM_EMAIL!,
        subject: "Reset Your Password",
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
              <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                <h1 style="color: #333; font-size: 24px; margin-bottom: 20px;">Reset Your Password</h1>
                <p style="color: #666; font-size: 16px; line-height: 1.5; margin-bottom: 30px;">
                  You requested to reset your password. Click the button below to set a new password:
                </p>
                <a href="${url}"
                   style="display: inline-block; padding: 12px 30px; background-color: #000; color: #fff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: 500;">
                  Reset Password
                </a>
                <p style="color: #999; font-size: 14px; line-height: 1.5; margin-top: 30px;">
                  If you didn't request this, you can safely ignore this email.
                </p>
                <p style="color: #999; font-size: 14px; line-height: 1.5; margin-top: 10px;">
                  This link will expire in 1 hour.
                </p>
              </div>
            </body>
          </html>
        `,
      }

      try {
        await sgMail.send(msg)
      } catch (error: any) {
        console.error("Error sending password reset email:", error)
        if (error.response) {
          console.error("SendGrid response body:", error.response.body)
          console.error("SendGrid response status:", error.response.statusCode)
          console.error("SendGrid response headers:", error.response.headers)
        }
        throw error
      }
    },
  },
  plugins: [
    admin(),
    nextCookies(), // Required for Server Actions - must be last plugin
  ],
})
