import { useSearchParams } from "react-router-dom";

import { PAGE_SIZE } from "../utils/constants";
import styles from "./Pagination.module.css";
import { LeftArrowIcon, RightArrowIcon } from "./Icons";

function Pagination({ count }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = !searchParams.get("page")
    ? 1
    : Number(searchParams.get("page"));

  const pageCount = Math.ceil(count / PAGE_SIZE);

  function nextPage() {
    const next = currentPage === pageCount ? currentPage : currentPage + 1;

    searchParams.set("page", next);
    setSearchParams(searchParams);
  }

  function prevPage() {
    const prev = currentPage === 1 ? currentPage : currentPage - 1;

    searchParams.set("page", prev);
    setSearchParams(searchParams);
  }

  if (pageCount <= 1) return null;

  return (
    <div className={styles.pagination}>
      <p className={styles["pagination-details"]}>
        Showing <span>{(currentPage - 1) * PAGE_SIZE + 1}</span> to{" "}
        <span>
          {currentPage === pageCount ? count : currentPage * PAGE_SIZE}
        </span>{" "}
        of <span>{count}</span> results
      </p>

      <div className={styles["pagination-action"]}>
        <button
          className={styles["pagination-button"]}
          onClick={prevPage}
          disabled={currentPage === 1}
        >
          <LeftArrowIcon size={24} /> <span>Previous</span>
        </button>

        <button
          className={`${styles["pagination-button"]} ${styles["next-button"]}`}
          onClick={nextPage}
          disabled={currentPage === pageCount}
        >
          <span>Next</span>
          <RightArrowIcon size={24} />
        </button>
      </div>
    </div>
  );
}

export default Pagination;
