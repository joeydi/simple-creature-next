"use client"

import { Input } from "@/components/ui/input"
import { Search, X } from "lucide-react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function SearchInput() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [searchValue, setSearchValue] = useState(searchParams.get("search") || "")

  const handleSearch = (value: string) => {
    setSearchValue(value)

    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString())

      if (value) {
        params.set("search", value)
        params.delete("page") // Reset to first page on new search
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

  return (
    <div className="relative w-full lg:max-w-sm">
      <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Search projects..."
        value={searchValue}
        onChange={(e) => handleSearch(e.target.value)}
        className="pl-9 pr-9"
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
        <X className="size-4" />
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
  )
}
