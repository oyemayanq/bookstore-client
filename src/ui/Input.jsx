import styles from "./Input.module.css";

function Input({
  label,
  name,
  type,
  value,
  onChange,
  placeholder,
  error,
  ...props
}) {
  return (
    <div className={styles.column}>
      <label htmlFor={name}>{label}</label>

      {error && <p className={styles["form-error"]}>{error}</p>}
      {type !== "textarea" ? (
        <input
          type={type}
          id={name}
          name={name}
          onChange={onChange}
          value={value}
          placeholder={placeholder}
          {...props}
        />
      ) : (
        <textarea
          type="text"
          id={name}
          name={name}
          onChange={onChange}
          value={value}
          placeholder={placeholder}
          {...props}
        />
      )}
    </div>
  );
}

export default Input;
