import { pgTable, text, timestamp, boolean, jsonb, primaryKey, integer } from "drizzle-orm/pg-core"

// Better Auth Schema - https://www.better-auth.com/docs/concepts/database

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  role: text("role"),
  banned: boolean("banned").default(false),
  banReason: text("ban_reason"),
  banExpires: timestamp("ban_expires"),
})

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expiresAt").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  impersonatedBy: text("impersonated_by"),
})

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
  refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
})

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
})

export const project = pgTable("project", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  shortDescription: text("shortDescription").notNull(),
  longDescription: text("longDescription"),
  tags: jsonb("tags"),
  content: jsonb("content"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

export const category = pgTable("category", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

export const projectCategory = pgTable(
  "projectCategory",
  {
    projectId: text("projectId")
      .notNull()
      .references(() => project.id, { onDelete: "cascade" }),
    categoryId: text("categoryId")
      .notNull()
      .references(() => category.id, { onDelete: "cascade" }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.projectId, table.categoryId] }),
  }),
)

export const asset = pgTable("asset", {
  id: text("id").primaryKey(),
  // Core file fields
  filename: text("filename").notNull(),
  originalFilename: text("originalFilename").notNull(),
  mimeType: text("mimeType").notNull(),
  fileSize: integer("fileSize").notNull(),
  // S3 references
  s3Key: text("s3Key").notNull().unique(),
  s3Bucket: text("s3Bucket").notNull(),
  s3Url: text("s3Url").notNull(),
  // Asset type discriminator: 'image' | 'video' | 'pdf'
  assetType: text("assetType").notNull(),
  // Type-specific metadata stored as JSONB
  metadata: jsonb("metadata"),
  // Optional descriptive fields
  title: text("title"),
  description: text("description"),
  altText: text("altText"),
  tags: jsonb("tags"),
  // User tracking
  uploadedBy: text("uploadedBy")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  // Timestamps
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})
