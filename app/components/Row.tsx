import { cn } from "@/lib/utils"

const Row = ({ className, children, ...props }: React.ComponentProps<"div">) => {
  return (
    <div className={cn("gap-y-(--spacing-xs) flex flex-wrap gap-x-[30px]", className)} {...props}>
      {children}
    </div>
  )
}

export default Row
