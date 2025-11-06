import { cn } from "@/lib/utils"
import { ComponentPropsWithoutRef } from "react"

export function DashboardContent({ className, ...props }: ComponentPropsWithoutRef<"section">) {
  return <section className={cn("px-4 py-8 sm:px-6 lg:px-8", className)} {...props} />
}
