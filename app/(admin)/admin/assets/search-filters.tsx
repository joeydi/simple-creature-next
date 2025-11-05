"use client"

import { useState, useTransition } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Grid, List, Search, X } from "lucide-react"
import { cn } from "@/lib/utils"

export function SearchFilters({
  viewMode,
  onViewModeChange,
}: {
  viewMode: "grid" | "table"
  onViewModeChange: (mode: "grid" | "table") => void
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [searchValue, setSearchValue] = useState(searchParams.get("search") || "")

  const handleSearch = (value: string) => {
    setSearchValue(value)
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set("search", value)
        params.delete("page") // Reset to first page
      } else {
        params.delete("search")
        params.delete("page")
      }
      router.push(`${pathname}?${params.toString()}`)
    })
  }

  const clearSearch = () => {
    setSearchValue("")
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString())
      params.delete("search")
      params.delete("page")
      router.push(`${pathname}?${params.toString()}`)
    })
  }

  const handleTypeFilter = (value: string) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString())
      if (value && value !== "all") {
        params.set("type", value)
        params.delete("page") // Reset to first page
      } else {
        params.delete("type")
        params.delete("page")
      }
      router.push(`${pathname}?${params.toString()}`)
    })
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 gap-2">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search assets..."
            value={searchValue}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={cn(
              "z-1 absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 transition-all duration-300",
              isPending || !searchValue ? "blur-xs scale-75 opacity-0" : "",
            )}
            onClick={clearSearch}
          >
            <X className="h-4 w-4" />
          </Button>
          <div
            className={cn(
              "absolute right-[9px] top-1/2 -translate-y-1/2 transition-all duration-300",
              isPending ? "" : "blur-xs scale-75 opacity-0",
            )}
          >
            <div className="size-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        </div>
        <Select defaultValue={searchParams.get("type") || "all"} onValueChange={handleTypeFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="image">Images</SelectItem>
            <SelectItem value="video">Videos</SelectItem>
            <SelectItem value="pdf">PDFs</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-1">
        <Button
          variant={viewMode === "grid" ? "default" : "outline"}
          size="icon"
          onClick={() => onViewModeChange("grid")}
        >
          <Grid className="h-4 w-4" />
        </Button>
        <Button
          variant={viewMode === "table" ? "default" : "outline"}
          size="icon"
          onClick={() => onViewModeChange("table")}
        >
          <List className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
