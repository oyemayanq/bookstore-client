import styles from "./BookList.module.css";

import BookItem from "./BookItem";

function BookList({ books }) {
  return (
    <div className={styles["book-list"]}>
      {books.map((book) => (
        <BookItem
          key={book._id}
          bookId={book._id}
          image={book.image}
          title={book.title}
          price={book.price}
          rating={book.rating}
          authors={book.authors}
        />
      ))}
    </div>
  );
}

export default BookList;
