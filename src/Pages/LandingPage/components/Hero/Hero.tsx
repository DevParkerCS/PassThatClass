import styles from "./Hero.module.scss";
import shared from "../../shared/styles.module.scss";

export const Hero = () => {
  return (
    <div className={`${styles.hero}`}>
      <div className={styles.heroContent}>
        <h1 className={`${styles.title} ${shared.title}`}>
          Looking for a New Way to{" "}
          <span className={shared.highlight}>Study?</span>
        </h1>
        <p className={`${styles.subtitle} ${shared.subtitle}`}>
          Generate practice quizzes from your notes in seconds
        </p>

        <button className={styles.cta}>Start For Free</button>
      </div>
    </div>
  );
};
