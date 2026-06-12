"use client"

import { useEffect, useState } from "react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, FileImage } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { reorderProjects } from "./actions"
import { Project } from "./types"

interface Props {
  projects: Project[]
  // When false (e.g. a search filter is active), rows are not draggable
  sortable: boolean
}

export function SortableProjectsTable({ projects, sortable }: Props) {
  const [rows, setRows] = useState<Project[]>(projects)

  // Re-sync local state when the server data changes (after revalidation)
  useEffect(() => {
    setRows(projects)
  }, [projects])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = rows.findIndex((p) => p.id === active.id)
      const newIndex = rows.findIndex((p) => p.id === over.id)
      const reordered = arrayMove(rows, oldIndex, newIndex)
      // Optimistic UI update
      setRows(reordered)
      // Persist the new order (fire-and-forget)
      void reorderProjects(reordered.map((p) => p.id))
    }
  }

  return (
    <DndContext id="projects-sortable" sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={rows.map((p) => p.id)} strategy={verticalListSortingStrategy}>
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead className="w-10" />
              <TableHead className="w-[60px]">Thumbnail</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Short Description</TableHead>
              <TableHead>Categories</TableHead>
              <TableHead className="w-[180px]">Created</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((project) => (
              <SortableProjectRow key={project.id} project={project} sortable={sortable} />
            ))}
          </TableBody>
        </Table>
      </SortableContext>
    </DndContext>
  )
}

function SortableProjectRow({ project, sortable }: { project: Project; sortable: boolean }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: project.id,
    disabled: !sortable,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <tr
      ref={setNodeRef}
      style={style}
      data-slot="table-row"
      className={cn(
        "border-b transition-colors hover:bg-muted/50",
        isDragging && "relative z-10 bg-background",
      )}
    >
      <TableCell>
        <button
          type="button"
          className={cn(
            "touch-none rounded p-1 text-muted-foreground",
            sortable ? "cursor-grab hover:bg-accent active:cursor-grabbing" : "cursor-default opacity-30",
          )}
          aria-label="Drag to reorder"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="size-4" />
        </button>
      </TableCell>
      <TableCell>
        {project.thumbnailUrl ? (
          <Link
            href={`/admin/projects/${project.id}`}
            className="relative block aspect-video w-24 overflow-hidden rounded bg-muted"
          >
            <Image src={project.thumbnailUrl} alt={project.title} fill className="object-cover" sizes="96px" />
          </Link>
        ) : (
          <div className="flex aspect-video w-24 items-center justify-center rounded bg-muted">
            <FileImage className="size-6 text-muted-foreground" />
          </div>
        )}
      </TableCell>
      <TableCell className="font-medium">{project.title}</TableCell>
      <TableCell className="font-mono text-sm text-muted-foreground">{project.slug}</TableCell>
      <TableCell className="max-w-md truncate">{project.shortDescription}</TableCell>
      <TableCell>
        <div className="flex flex-wrap gap-1">
          {project.categories && project.categories.length > 0 ? (
            project.categories.map((category) => (
              <Badge key={category.id} variant="secondary">
                {category.name}
              </Badge>
            ))
          ) : (
            <span className="text-sm text-muted-foreground">—</span>
          )}
        </div>
      </TableCell>
      <TableCell>{new Date(project.createdAt).toLocaleDateString()}</TableCell>
      <TableCell>
        <Button size="sm" variant="outline" asChild>
          <Link href={`/admin/projects/${project.id}`}>Edit</Link>
        </Button>
      </TableCell>
    </tr>
  )
}
