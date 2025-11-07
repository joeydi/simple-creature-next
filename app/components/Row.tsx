import styles from "./Row.module.scss"

interface Props {
  className?: string
}

const Row = ({ className, children, ...props }: React.ComponentProps<"div">) => {
  return (
    <div className={[styles.row, className].filter((x) => !!x).join(" ")} {...props}>
      {children}
    </div>
  )
}

export default Row
