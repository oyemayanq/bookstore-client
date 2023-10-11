import styles from "./PageNotFound.module.css";

export default function PageNotFound({ errorMessage }) {
  return (
    <div className={styles["page-error"]}>
      <p className={styles["error-message"]}>
        {errorMessage || "Page not found"} 😢
      </p>
    </div>
  );
}
