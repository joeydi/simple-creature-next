import styles from "./Row.module.scss";

interface Props {
  className?: string;
}

const Row = ({ className, children }: React.PropsWithChildren<Props>) => {
  return <div className={[styles.row, className].filter((x) => !!x).join(" ")}>{children}</div>;
};

export default Row;
