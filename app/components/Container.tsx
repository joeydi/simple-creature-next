import { cn } from "@/lib/utils"

const Container = ({ className, children, ...props }: React.ComponentProps<"div">) => {
  return (
    <div className={cn("max-w-(--container-max-width) px-(--container-padding) mx-auto w-full", className)} {...props}>
      {children}
    </div>
  )
}

export default Container
