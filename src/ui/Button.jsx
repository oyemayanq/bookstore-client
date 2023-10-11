import styles from "./Button.module.css";

function Button({
  children,
  onClick,
  type = "primary",
  buttonType = "button",
  ...props
}) {
  return (
    <button
      onClick={onClick}
      className={`${styles.btn} ${styles[type]}`}
      type={buttonType}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
