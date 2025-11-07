export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
}

export interface Project {
  id: string
  title: string
  slug: string
  shortDescription: string
  longDescription: string | null
  thumbnailId: string | null
  tags: unknown
  content: unknown
  createdAt: Date
  updatedAt: Date
  categoryIds: string[]
}

export interface ProjectWithThumbnail extends Project {
  thumbnailUrl: string
  thumbnailAlt: string
}
