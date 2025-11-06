import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ReactNode } from "react"

export function DashboardHeader({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <header className="z-1 group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 sticky top-0 flex h-12 shrink-0 items-center gap-2 border-b bg-white transition-[width,height] ease-linear">
      <div className="flex w-full items-center gap-1 px-4 sm:px-6 lg:gap-2 lg:px-8">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
        <h1 className="text-base font-medium">{title}</h1>
        {children && <div className="ml-auto">{children}</div>}
      </div>
    </header>
  )
}
