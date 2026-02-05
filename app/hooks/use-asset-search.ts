"use client"

import { useState, useMemo } from "react"

interface Searchable {
  filename: string
  title?: string | null
}

/**
 * Hook for searching/filtering assets by filename or title
 * @param assets - Array of assets to search through
 * @returns Object with search state, setter, and filtered results
 */
export function useAssetSearch<T extends Searchable>(assets: T[]) {
  const [search, setSearch] = useState("")

  const filteredAssets = useMemo(() => {
    if (!search) return assets
    const searchLower = search.toLowerCase()
    return assets.filter(
      (asset) =>
        asset.filename.toLowerCase().includes(searchLower) ||
        (asset.title && asset.title.toLowerCase().includes(searchLower))
    )
  }, [search, assets])

  return { search, setSearch, filteredAssets }
}
