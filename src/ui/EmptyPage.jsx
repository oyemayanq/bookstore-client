import { Link } from "react-router-dom";

import styles from "./EmptyPage.module.css";
import Button from "./Button";

function EmptyPage({ message, title, to }) {
  return (
    <div className={styles["empty"]}>
      <p>{message}</p>
      <Link to={to || "/"}>
        <Button>{title}</Button>
      </Link>
    </div>
  );
}

export default EmptyPage;
