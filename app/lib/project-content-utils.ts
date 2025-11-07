import { Block, ProjectContent } from "./schemas/project-content"

/**
 * Generates a unique ID for a block
 */
export function generateBlockId(): string {
  return `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Validates project content structure
 */
export function validateProjectContent(content: unknown): content is ProjectContent {
  if (!content || typeof content !== "object") {
    return false
  }

  const obj = content as Record<string, unknown>
  if (!Array.isArray(obj.blocks)) {
    return false
  }

  return obj.blocks.every((block: unknown) => {
    if (!block || typeof block !== "object") {
      return false
    }

    const b = block as Record<string, unknown>
    if (typeof b.id !== "string" || typeof b.type !== "string") {
      return false
    }

    return ["full-width-media", "full-width-content", "content-with-media"].includes(b.type as string)
  })
}

/**
 * Creates an empty project content structure
 */
export function createEmptyContent(): ProjectContent {
  return {
    blocks: [],
  }
}

/**
 * Creates a new block of the specified type with default values
 */
export function createNewBlock(type: Block["type"]): Block {
  const id = generateBlockId()

  switch (type) {
    case "full-width-media":
      return {
        id,
        type: "full-width-media",
        asset: null,
      }
    case "full-width-content":
      return {
        id,
        type: "full-width-content",
        content: "",
      }
    case "content-with-media":
      return {
        id,
        type: "content-with-media",
        content: "",
        assets: [],
        align: "left",
        width: "medium",
      }
  }
}

/**
 * Sanitizes HTML content to prevent XSS attacks
 * Note: For production, consider using a library like DOMPurify
 */
export function sanitizeContent(content: string): string {
  // Basic sanitization - strip script tags and javascript: protocols
  return content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=/gi, "")
}

/**
 * Gets a display name for a block type
 */
export function getBlockTypeName(type: Block["type"]): string {
  switch (type) {
    case "full-width-media":
      return "Full-Width Media"
    case "full-width-content":
      return "Full-Width Content"
    case "content-with-media":
      return "Content with Media"
  }
}

/**
 * Checks if a block is valid and ready for saving
 */
export function isBlockValid(block: Block): boolean {
  switch (block.type) {
    case "full-width-media":
      return !!block.asset && !!block.asset.id
    case "full-width-content":
      return block.content.trim().length > 0
    case "content-with-media":
      return block.content.trim().length > 0 && block.assets.length > 0
    default:
      return false
  }
}
