import shared from "../../shared/styles.module.scss";
import styles from "./Pricing.module.scss";

export const Pricing = () => {
  return (
    <div className={shared.section}>
      <div className={shared.sectionContent}>
        <h2 className={shared.title}>Pricing</h2>
        <p className={shared.subtitle}>
          Sign up today and get an extra{" "}
          <span className={shared.highlight}>5 free</span> quiz generations on
          us!
        </p>

        <div className={styles.sectionCardsWrapper}>
          <div className={styles.sectionCard}>
            <p className={shared.cardName}>Basic Plan</p>
            <p className={shared.cardValue}>Free</p>

            <ul className={shared.cardList}>
              <li className={shared.listItem}>
                Generate <span className={shared.itemBold}>1 quiz</span> per
                month from notes
              </li>
              <li className={shared.listItem}>
                Up to <span className={shared.itemBold}>5000 characters</span>{" "}
                of notes per quiz.
              </li>
              <li className={shared.listItem}>
                Input <span className={shared.itemBold}>1 image</span> of notes
                per quiz.
              </li>
              <li className={shared.listItem}>
                <span className={shared.itemBold}>Track your stats</span> for
                your quizzes
              </li>
            </ul>
          </div>

          <div className={`${styles.sectionCard} ${styles.proSection}`}>
            <p className={shared.cardName}>Pro Plan</p>
            <p className={shared.cardValue}>$5/Month</p>

            <ul className={shared.cardList}>
              <li className={shared.listItem}>
                <span className={shared.itemBold}>Everything</span> from the
                free plan and:
              </li>
              <li className={shared.listItem}>
                Generate up to{" "}
                <span className={shared.itemBold}>100 quizzes</span> every month
              </li>
              <li className={shared.listItem}>
                Input up to{" "}
                <span className={shared.itemBold}>20,000 characters</span> of
                notes per quiz.
              </li>
              <li className={shared.listItem}>
                Input up to <span className={shared.itemBold}>5 images</span> of
                notes per quiz.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
