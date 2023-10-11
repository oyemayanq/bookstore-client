import styles from "./ReviewItem.module.css";
import Star from "../../ui/Star";
import { formatDate } from "../../utils/helpers";

function ReviewItem({ rating, comment, name, date }) {
  const reviewDate = formatDate(date);

  return (
    <div className={styles["review-box"]}>
      <div className={styles["review-rating"]}>
        <p>{rating}</p>
        <Star size={24} type="primary" />
      </div>
      <div>
        <p className={styles["review-comment"]}>{comment}</p>
        <div className={styles.row}>
          <p className={styles["review-username"]}>{name}</p>
          <p className={styles["review-username"]}>{reviewDate}</p>
        </div>
      </div>
    </div>
  );
}

export default ReviewItem;
