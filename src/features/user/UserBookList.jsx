import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import UserBookItem from "./UserBookItem";
import styles from "./UserBookList.module.css";
import { Modal } from "../../ui/Modal";
import { deleteBookById } from "./userSlice";
import { useNavigate } from "react-router-dom";

function UserBookList({ userBooks }) {
  const [isModalActive, setIsModalActive] = useState(false);
  const [deleteId, setDeleteId] = useState("");

  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.token);
  const navigate = useNavigate();

  return (
    <ul className={styles["user-book-list"]}>
      {isModalActive && (
        <Modal
          onClose={() => {
            setDeleteId("");
            setIsModalActive(false);
          }}
          onConfirm={() => {
            dispatch(deleteBookById({ bookId: deleteId, token: token }));
            setIsModalActive(false);
            setDeleteId("");
          }}
        />
      )}
      {userBooks.map((book) => (
        <UserBookItem
          key={book._id}
          book={book}
          onDelete={(id) => {
            setIsModalActive(true);
            setDeleteId(id);
          }}
          onEdit={(id) => {
            //console.log(id);
            navigate(`/books/create?bookId=${id}`);
          }}
        />
      ))}
    </ul>
  );
}

export default UserBookList;
