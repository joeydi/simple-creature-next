"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, FileText, Image as ImageIcon, Layout, Grid } from "lucide-react"
import { Block } from "@/lib/schemas/project-content"

interface AddBlockDropdownProps {
  onAddBlock: (type: Block["type"]) => void
  className?: string
}

export function AddBlockDropdown({ onAddBlock, className }: AddBlockDropdownProps) {
  return (
    <div className={className}>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            type="button"
            className="w-full border-2 border-dashed border-muted-foreground/25 bg-transparent text-muted-foreground hover:border-muted-foreground/50 hover:bg-muted/50 hover:text-foreground"
          >
            <Plus className="mr-2 size-4" />
            Add Block
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center">
          <DropdownMenuItem onClick={() => onAddBlock("full-width-media")}>
            <ImageIcon className="mr-2 size-4" />
            Full-Width Media
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onAddBlock("full-width-content")}>
            <FileText className="mr-2 size-4" />
            Full-Width Content
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onAddBlock("content-with-media")}>
            <Layout className="mr-2 size-4" />
            Content with Media
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onAddBlock("media-grid")}>
            <Grid className="mr-2 size-4" />
            Media Grid
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
