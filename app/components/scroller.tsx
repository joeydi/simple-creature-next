"use client"

import { useMenu } from "@/contexts/MenuContext"
import { cn } from "@/lib/utils"

const Scroller = ({ children }: React.ComponentProps<"div">) => {
  const { isActive } = useMenu()

  return (
    <div
      className={cn(
        "ease-[cubic-bezier(0.08,0.94,0.26,0.95)] h-full overflow-auto bg-white transition duration-500",
        isActive ? "-translate-x-[6.125%] scale-75 rounded-xl" : "scale-100 rounded-none",
      )}
    >
      {children}
    </div>
  )
}

export default Scroller
