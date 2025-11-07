import { cn } from "@/lib/utils"

const Row = ({ className, children, ...props }: React.ComponentProps<"div">) => {
  return (
    <div className={cn("flex flex-wrap gap-[30px]", className)} {...props}>
      {children}
    </div>
  )
}

export default Row
