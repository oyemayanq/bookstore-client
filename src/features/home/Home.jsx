import { useDispatch, useSelector } from "react-redux";
import BookList from "../../ui/BookList";
import styles from "./Home.module.css";
import SpinnerFullPage from "../../ui/SpinnerFullPage";
import { useEffect } from "react";
import { fetchBooks } from "../book/bookSlice";
import Pagination from "../../ui/Pagination";
import { useSearchParams } from "react-router-dom";
import PageNotFound from "../../pages/PageNotFound";

function Home() {
  const [searchParams] = useSearchParams();
  const currentPage = !searchParams.get("page")
    ? 1
    : Number(searchParams.get("page"));
  const dispatch = useDispatch();
  const { isLoading, books, bookCount, error } = useSelector(
    (state) => state.book
  );

  //console.log(books);

  useEffect(() => {
    dispatch(fetchBooks({ page: currentPage }));
  }, [dispatch, currentPage]);

  if (error) {
    return <PageNotFound errorMessage={error} />;
  }

  if (isLoading) return <SpinnerFullPage />;

  return (
    <div className={styles["home"]}>
      <BookList books={books} />

      <Pagination count={bookCount} />
    </div>
  );
}

export default Home;
