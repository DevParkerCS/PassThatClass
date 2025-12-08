import { faCheck } from "@fortawesome/free-solid-svg-icons";
import shared from "../../shared/styles.module.scss";
import styles from "./Pricing.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
            <p className={styles.priceName}>Free Starter</p>
            <p className={styles.priceSub}>
              Get a feel for PassThatClass-no card, no commitment.
            </p>
            <p className={styles.price}>
              $0<span className={styles.priceMonth}> / month</span>
            </p>

            <button className={styles.cta}>Start For Free</button>

            <div className={styles.cardList}>
              <div className={styles.priceItem}>
                <FontAwesomeIcon className={styles.itemIcon} icon={faCheck} />
                <p className={styles.listItem}>
                  Generate{" "}
                  <span className={styles.itemBold}>5 AI-powered quizzes</span>{" "}
                  from your notes.
                </p>
              </div>
              <div className={styles.priceItem}>
                <FontAwesomeIcon className={styles.itemIcon} icon={faCheck} />
                <p className={styles.listItem}>
                  Use up to{" "}
                  <span className={styles.itemBold}>5,000 characters</span> of
                  text per quiz.
                </p>
              </div>
              <div className={styles.priceItem}>
                <FontAwesomeIcon className={styles.itemIcon} icon={faCheck} />
                <p className={styles.listItem}>
                  Upload <span className={styles.itemBold}>1 image</span> of
                  notes per quiz.
                </p>
              </div>
              <div className={styles.priceItem}>
                <FontAwesomeIcon className={styles.itemIcon} icon={faCheck} />
                <p className={styles.listItem}>
                  <span className={styles.itemBold}>Track your quiz stats</span>{" "}
                  as you study.
                </p>
              </div>
            </div>
          </div>

          <div className={`${styles.sectionCard} ${styles.proSection}`}>
            <p className={styles.priceName}>Pro Student</p>
            <p className={styles.priceSub}>
              Smarter practice, better grades, everything PassThatClass has to
              offer.
            </p>
            <p className={styles.price}>
              $5.99<span className={styles.priceMonth}> / month</span>
            </p>

            <button className={styles.cta}>Upgrade Now</button>

            <div className={styles.cardList}>
              <div className={styles.priceItem}>
                <FontAwesomeIcon className={styles.itemIcon} icon={faCheck} />
                <p className={styles.listItem}>Everything in Basic, plus:</p>
              </div>
              <div className={styles.priceItem}>
                <FontAwesomeIcon className={styles.itemIcon} icon={faCheck} />
                <p className={styles.listItem}>
                  Generate up to{" "}
                  <span className={styles.itemBold}>100 quizzes per month</span>
                  .
                </p>
              </div>
              <div className={styles.priceItem}>
                <FontAwesomeIcon className={styles.itemIcon} icon={faCheck} />
                <p className={styles.listItem}>
                  Use up to{" "}
                  <span className={styles.itemBold}>20,000 characters</span> of
                  notes per quiz.
                </p>
              </div>
              <div className={styles.priceItem}>
                <FontAwesomeIcon className={styles.itemIcon} icon={faCheck} />
                <p className={styles.listItem}>
                  Upload up to <span className={styles.itemBold}>5 images</span>{" "}
                  of notes per quiz.
                </p>
              </div>
              <div className={styles.priceItem}>
                <FontAwesomeIcon className={styles.itemIcon} icon={faCheck} />
                <p className={styles.listItem}>
                  <span className={styles.itemBold}>Full attempt history</span>{" "}
                  so you can see your progress over time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
