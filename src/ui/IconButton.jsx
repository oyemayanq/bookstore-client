import styles from "./IconButton.module.css";

function IconButton({ onClick, children, type = "", ...props }) {
  return (
    <button
      onClick={onClick}
      className={`${styles["icon-button"]} ${
        type.length === 0 ? "" : styles[type]
      }`}
      {...props}
    >
      {children}
    </button>
  );
}

export default IconButton;
