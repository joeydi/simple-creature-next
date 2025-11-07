import { cn } from "@/lib/utils"
import styles from "./Row.module.scss"

const Row = ({ className, children, ...props }: React.ComponentProps<"div">) => {
  return (
    <div className={cn(styles.row, className)} {...props}>
      {children}
    </div>
  )
}

export default Row
