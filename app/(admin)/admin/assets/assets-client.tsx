"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { SearchFilters } from "./search-filters"
import { AssetGrid } from "./asset-grid"
import { AssetTable } from "./asset-table"
import { AssetEditModal } from "./asset-edit-modal"
import { DeleteAssetButton } from "./delete-asset-button"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { Asset } from "./types"

export function AssetsClient({
  assets,
  currentPage,
  totalPages,
  total,
}: {
  assets: Asset[]
  currentPage: number
  totalPages: number
  total: number
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid")
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)
  const [assetToDelete, setAssetToDelete] = useState<Asset | null>(null)

  // Load view mode from localStorage
  useEffect(() => {
    const savedViewMode = localStorage.getItem("assetsViewMode") as "grid" | "table" | null
    if (savedViewMode) {
      setViewMode(savedViewMode)
    }
  }, [])

  const handleViewModeChange = (mode: "grid" | "table") => {
    setViewMode(mode)
    localStorage.setItem("assetsViewMode", mode)
  }

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", page.toString())
    router.push(`?${params.toString()}`)
  }

  return (
    <div className="space-y-4">
      <SearchFilters viewMode={viewMode} onViewModeChange={handleViewModeChange} />

      {viewMode === "grid" ? (
        <AssetGrid assets={assets} onEdit={setSelectedAsset} onDelete={setAssetToDelete} />
      ) : (
        <AssetTable assets={assets} onEdit={setSelectedAsset} onDelete={setAssetToDelete} />
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {assets.length} of {total} assets
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {selectedAsset && (
        <AssetEditModal
          asset={selectedAsset}
          open={!!selectedAsset}
          onOpenChange={(open) => !open && setSelectedAsset(null)}
        />
      )}

      {assetToDelete && <DeleteAssetButton asset={assetToDelete} onClose={() => setAssetToDelete(null)} />}
    </div>
  )
}
