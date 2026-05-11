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
  url: string | null
  thumbnailId: string | null
  thumbnailUrl?: string
  thumbnailAlt?: string
  tags: unknown
  content: unknown
  createdAt: Date
  updatedAt: Date
  categoryIds: string[]
  categories?: {
    id: string
    name: string
  }[]
}
