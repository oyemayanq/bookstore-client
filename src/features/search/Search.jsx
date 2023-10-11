import styles from "./Search.module.css";
import BookList from "../../ui/BookList";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { fetchBooks } from "../book/bookSlice";
import SpinnerFullPage from "../../ui/SpinnerFullPage";
import Pagination from "../../ui/Pagination";

function Search() {
  const [searchParams] = useSearchParams();
  const searchKey = searchParams.get("searchKey");
  const currentPage = !searchParams.get("page")
    ? 1
    : Number(searchParams.get("page"));

  const { isLoading, searchBooks, bookCount } = useSelector(
    (state) => state.book
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchBooks({ searchKey: searchKey, page: currentPage }));
  }, [searchKey, dispatch, currentPage]);

  if (isLoading) {
    return <SpinnerFullPage />;
  }

  return (
    <div className={styles["search-container"]}>
      <h1>Search Results</h1>
      <BookList books={searchBooks} />
      <Pagination count={bookCount} />
    </div>
  );
}

export default Search;
