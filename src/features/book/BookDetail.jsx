import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Button from "../../ui/Button";
import styles from "./BookDetail.module.css";
//import Books from "../../data/data";
import SpinnerFullPage from "../../ui/SpinnerFullPage";
import Star from "../../ui/Star";
import { createReview, fetchBookById } from "./bookSlice";
import ReviewItem from "./ReviewItem";
import { formatDate } from "../../utils/helpers";
import { addToCart } from "../cart/cartSlice";
import PageNotFound from "../../pages/PageNotFound";

function BookDetail() {
  const { bookId } = useParams();
  //console.log(bookId);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [ratingError, setRatingError] = useState("");
  const quantityRef = useRef();

  const {
    isLoading,
    currentBook: book,
    error,
  } = useSelector((state) => state.book);
  const { token, isAuthenticated } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const publishedDate = book ? formatDate(book.publishedDate) : "";

  useEffect(() => {
    if (bookId) {
      dispatch(fetchBookById(bookId));
    }
  }, [bookId, dispatch]);

  function handleReviewSubmit(e) {
    e.preventDefault();

    if (rating <= 0) {
      setRatingError("Please add stars to your review");
      return;
    } else {
      setRatingError("");
    }

    console.log(rating, comment);

    dispatch(
      createReview({
        bookId: bookId,
        token,
        reviewData: { rating, comment: comment.trim() },
      })
    );
    setRating(0);
    setComment("");
  }

  if (error) {
    return <PageNotFound errorMessage={error} />;
  }

  if (isLoading) {
    return <SpinnerFullPage />;
  }

  if (!book) {
    return <p>Book not found</p>;
  }

  return (
    <div className={styles["book-detail-container"]}>
      <section className={styles["book-info"]}>
        <div className={styles["book-image"]}>
          <img
            src={
              book.image
                ? `${import.meta.env.VITE_ASSET_URL}/${book.image}`
                : "/images/book.jpg"
            }
            alt={book.title}
          />
        </div>
        <div className={styles["book-detail"]}>
          <h1 className={styles["book-title"]}>{book.title}</h1>
          <p className={styles["book-common-style"]}>
            By: {book.authors.join(", ")}
          </p>
          <p className={styles["book-common-style"]}>
            Genres: {book.genres.join(", ")}
          </p>
          <p className={styles["book-common-style"]}>
            Publisher: {book.publisher}
          </p>
          <p className={styles["book-common-style"]}>
            Published: {publishedDate}
          </p>
          <div className={styles["book-rating"]}>
            <p>{book.rating.toFixed(2)}</p>
            <div className={styles["rating-star"]}>
              <Star type="primary" size={20} />
            </div>
            <span>|</span>
            <p className={styles["book-num-ratings"]}>
              {book.numberOfRatings} Ratings
            </p>
          </div>
          {book.description && (
            <>
              <p className={styles["book-description-tag"]}>About the book</p>
              <p className={styles["book-description"]}>{book.description}</p>
            </>
          )}
          <p className={styles["book-price"]}>Rs. {book.price.toFixed(2)}</p>
          <div className={styles["book-action"]}>
            <select
              ref={quantityRef}
              defaultValue={1}
              className={styles["quantity-input"]}
            >
              <option value={1}>1 Book</option>
              <option value={2}>2 Book</option>
              <option value={3}>3 Book</option>
              <option value={4}>4 Book</option>
              <option value={5}>5 Book</option>
            </select>
            <Button
              onClick={() => {
                let quantity = parseInt(quantityRef.current.value);
                if (!quantity || typeof quantity !== "number") {
                  quantity = 1;
                }
                dispatch(
                  addToCart({
                    id: book._id,
                    title: book.title,
                    price: book.price,
                    quantity: quantity,
                  })
                );
              }}
            >
              Add to cart
            </Button>
          </div>
        </div>
      </section>

      <section className={styles["book-reviews"]}>
        <div className={styles["add-review-container"]}>
          {isAuthenticated ? (
            <form
              onSubmit={handleReviewSubmit}
              className={styles["review-form"]}
            >
              <h1>Add a Review</h1>
              <div>
                <p className={styles["form-error"]}>{ratingError || ""}</p>
                <div className={styles["rating-row"]}>
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      size={24}
                      type={i + 1 <= rating ? "primary" : "secondary"}
                      onRate={() => {
                        setRatingError("");
                        setRating(i + 1);
                      }}
                    />
                  ))}

                  <p className={styles["rating-value"]}>{rating || " "}</p>
                </div>
              </div>
              <div className={styles["review-comment"]}>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  placeholder="Comment..."
                />
              </div>
              <div className={styles["review-form-action"]}>
                <Button
                  onClick={() => {
                    setRating(0);
                    setRatingError("");
                    setComment("");
                  }}
                  type="secondary"
                >
                  Clear
                </Button>
                <Button
                  onClick={handleReviewSubmit}
                  disabled={ratingError.length !== 0}
                >
                  Submit
                </Button>
              </div>
            </form>
          ) : (
            <p className={styles["review-message"]}>
              Please login to add a review
            </p>
          )}
        </div>
        <h1 className={styles["review-section-header"]}>Reviews</h1>
        {book.reviews.length === 0 ? (
          <p className={styles["review-message"]}>No reviews added yet.</p>
        ) : (
          book.reviews.map((review, idx) => {
            if (review.comment.length > 0) {
              return (
                <ReviewItem
                  key={idx}
                  rating={review.rating}
                  comment={review.comment}
                  name={review.user.name}
                  date={review.createdAt}
                />
              );
            }
          })
        )}
      </section>
    </div>
  );
}

export default BookDetail;
