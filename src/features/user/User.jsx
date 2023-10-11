import UserBookList from "./UserBookList";
import styles from "./User.module.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchBooksByUser } from "./userSlice";
import SpinnerFullPage from "../../ui/SpinnerFullPage";
import Button from "../../ui/Button";
import PageNotFound from "../../pages/PageNotFound";
import EmptyPage from "../../ui/EmptyPage";

function User() {
  const { token, isLoading, isAuthenticated, userName, userBooks, error } =
    useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isAuthenticated) dispatch(fetchBooksByUser({ token: token }));
  }, [dispatch, token, isAuthenticated]);

  if (userBooks && userBooks.length === 0) {
    return (
      <EmptyPage
        message={"You have not added any books"}
        title="Add new book"
        to="/books/create"
      />
    );
  }

  if (error) {
    return <PageNotFound errorMessage={error} />;
  }

  if (isLoading) {
    return <SpinnerFullPage />;
  }

  return (
    <div className={styles["user-container"]}>
      <h1>
        Your books, <span>{userName} </span>
      </h1>
      <UserBookList userBooks={userBooks} />
    </div>
  );
}

export default User;
