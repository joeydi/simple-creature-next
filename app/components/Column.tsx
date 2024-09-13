import styles from "./Column.module.scss";

interface Props {
  className?: string;
  xs?: string | number;
  sm?: string | number;
  md?: string | number;
  lg?: string | number;
  xl?: string | number;
  xxl?: string | number;
}

const Column = ({ className, xs, sm, md, lg, xl, xxl, children }: React.PropsWithChildren<Props>) => {
  const classes = [
    styles.column,
    className,
    xs ? styles[`colxs${xs}`] : null,
    sm ? styles[`colsm${sm}`] : null,
    md ? styles[`colmd${md}`] : null,
    lg ? styles[`collg${lg}`] : null,
    xl ? styles[`colxl${xl}`] : null,
    xxl ? styles[`colxxl${xxl}`] : null,
  ];

  return <div className={classes.filter((x) => !!x).join(" ")}>{children}</div>;
};

export default Column;
