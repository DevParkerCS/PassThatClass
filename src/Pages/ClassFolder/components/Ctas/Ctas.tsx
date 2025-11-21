import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./Ctas.module.scss";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

export const Ctas = () => {
  return (
    <div className={styles.ctasWrapper}>
      <button className={styles.newCta}>
        <FontAwesomeIcon icon={faPlus} className={styles.ctaIcon} />
        <p className={styles.ctaTxt}>New Quiz</p>
      </button>

      <button className={styles.newCta}>
        <FontAwesomeIcon icon={faPlus} className={styles.ctaIcon} />
        <p className={styles.ctaTxt}>New Flashcard</p>
      </button>
    </div>
  );
};
