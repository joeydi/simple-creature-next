// Helper function to generate a URL-safe slug from text
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, "") // Trim hyphens from start and end
}

// Validate if a slug is in the correct format
export function isValidSlugFormat(slug: string): boolean {
  if (!slug || slug.trim() === "") return false
  // Must be lowercase alphanumeric with hyphens only
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)
}
