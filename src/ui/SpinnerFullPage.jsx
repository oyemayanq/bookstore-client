import styles from "./SpinnerFullPage.module.css";
import Spinner from "./Spinner";

function SpinnerFullPage() {
  return (
    <div className={styles.spinnerContainer}>
      <Spinner />
    </div>
  );
}

export default SpinnerFullPage;
