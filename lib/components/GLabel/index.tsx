import styles from "./styles.module.css";

export function GLabel(props: React.LabelHTMLAttributes<HTMLLabelElement>) {
  const { className, ...restProps } = props;
  return (
    <>
      <label className={`${className} ${styles.label}`} {...restProps} />
    </>
  );
}
