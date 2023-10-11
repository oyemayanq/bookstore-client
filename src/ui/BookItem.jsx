import { Link } from "react-router-dom";

import styles from "./BookItem.module.css";
import Card from "./Card";
import Button from "./Button";
import Star from "./Star";
import { useDispatch } from "react-redux";
import { addToCart } from "../features/cart/cartSlice";

function BookItem({ image, bookId, title, price, rating, authors }) {
  const dispatch = useDispatch();

  return (
    <Card>
      <Link to={`/books/${bookId}`} className={styles["book-link"]}>
        <div className={styles["book-item"]}>
          <div className={styles["book-image"]}>
            <img
              src={
                image
                  ? `${import.meta.env.VITE_ASSET_URL}/${image}`
                  : "/images/book.jpg"
              }
              alt={title}
            />
          </div>
          <div className={styles["book-details"]}>
            <p className={styles["book-title"]}>{title}</p>
            <p className={styles["book-author"]}>By: {authors.join(", ")}</p>
            <p className={styles["book-price"]}>
              Price: Rs. {price.toFixed(2)}
            </p>
            <div className={styles["row"]}>
              <p className={styles["book-rating"]}>{rating.toFixed(2)}</p>
              <Star size={16} type="primary" />
            </div>
            <div className={styles["book-action"]}>
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(
                    addToCart({
                      id: bookId,
                      title: title,
                      quantity: 1,
                      price: price,
                    })
                  );
                }}
              >
                Add To Cart
              </Button>
            </div>
          </div>
        </div>
      </Link>
    </Card>
  );
}

export default BookItem;
