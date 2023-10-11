import { Link } from "react-router-dom";

import styles from "./UserBookItem.module.css";
import Button from "../../ui/Button";

function UserBookItem({ book, onDelete, onEdit }) {
  return (
    <li className={styles["user-book-item"]}>
      <Link to={`/books/${book._id}`}>{book.title}</Link>
      <div className={styles["user-book-actions"]}>
        <Button
          onClick={() => {
            onEdit(book._id);
          }}
        >
          Edit
        </Button>
        <Button
          onClick={() => {
            onDelete(book._id);
          }}
          type="danger"
        >
          Delete
        </Button>
      </div>
    </li>
  );
}

export default UserBookItem;
