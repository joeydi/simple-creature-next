"use client"

import { useMenu } from "@/contexts/MenuContext"
import { cn } from "@/lib/utils"

const Scroller = ({ children }: React.ComponentProps<"div">) => {
  const { isActive } = useMenu()

  return (
    <div
      className={cn(
        "ease-[cubic-bezier(0.87,0.01,0.15,0.99)] h-full overflow-auto bg-white transition duration-1000",
        isActive ? "scale-75" : "scale-100",
      )}
    >
      {children}
    </div>
  )
}

export default Scroller
