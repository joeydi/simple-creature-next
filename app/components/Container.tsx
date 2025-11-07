import { cn } from "@/lib/utils"

interface Props {
  className?: string
}

const Container = ({ className, children }: React.PropsWithChildren<Props>) => {
  return (
    <div className={cn("max-w-(--container-max-width) px-(--container-padding) mx-auto w-full", className)}>
      {children}
    </div>
  )
}

export default Container
