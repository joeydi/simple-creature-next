import styles from "./Container.module.scss";

interface Props {
  className?: string;
}

const Container = ({ className, children }: React.PropsWithChildren<Props>) => {
  return <div className={`${styles.container} ${className}`}>{children}</div>;
};

export default Container;
