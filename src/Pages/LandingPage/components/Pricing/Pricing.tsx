import shared from "../../shared/styles.module.scss";
import styles from "./Pricing.module.scss";

export const Pricing = () => {
  return (
    <div className={shared.section} id="pricing">
      <div className={shared.sectionContent}>
        <h2 className={shared.title}>Pricing</h2>
        <p className={shared.subtitle}>
          Sign up today and get <span className={shared.highlight}>5 free</span>{" "}
          quiz generations on us!
        </p>

        <div className={styles.sectionCardsWrapper}>
          <div className={styles.sectionCard}>
            <p className={shared.cardName}>Free Starter</p>
            <p className={shared.cardValue}>Free</p>

            <ul className={shared.cardList}>
              <li className={shared.listItem}>
                Generate{" "}
                <span className={shared.itemBold}>7 AI-powered quizzes</span>{" "}
                from your notes.
              </li>
              <li className={shared.listItem}>
                Use up to{" "}
                <span className={shared.itemBold}>5,000 characters</span> of
                text per quiz.
              </li>
              <li className={shared.listItem}>
                Upload <span className={shared.itemBold}>1 image</span> of notes
                per quiz.
              </li>
              <li className={shared.listItem}>
                <span className={shared.itemBold}>Track your quiz stats</span>{" "}
                as you study.
              </li>
            </ul>
          </div>

          <div className={`${styles.sectionCard} ${styles.proSection}`}>
            <p className={shared.cardName}>Pro Student</p>
            <p className={shared.cardValue}>$5.99.99/Month</p>

            <ul className={shared.cardList}>
              <li className={shared.listItem}>
                <span className={shared.itemBold}>Everything in Basic</span>,
                plus:
              </li>
              <li className={shared.listItem}>
                Generate up to{" "}
                <span className={shared.itemBold}>100 quizzes per month</span>.
              </li>
              <li className={shared.listItem}>
                Use up to{" "}
                <span className={shared.itemBold}>20,000 characters</span> of
                notes per quiz.
              </li>
              <li className={shared.listItem}>
                Upload up to <span className={shared.itemBold}>5 images</span>{" "}
                of notes per quiz.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
