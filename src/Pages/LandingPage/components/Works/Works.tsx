import styles from "./Works.module.scss";
import shared from "../../shared/styles.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faChartLine,
  faFolder,
  faListCheck,
  faNoteSticky,
} from "@fortawesome/free-solid-svg-icons";

export const Works = () => {
  return (
    <div className={`${shared.section}`}>
      <div className={shared.sectionContent}>
        <p className={shared.title}>How It Works</p>
        <p className={shared.subtitle}>
          Turn messy notes into study-ready quizzes in four simple steps.
        </p>

        <div className={shared.sectionCardsWrapper}>
          <div className={`${shared.sectionCard} ${styles.worksCard}`}>
            <FontAwesomeIcon className={styles.worksIcon} icon={faFolder} />
            <p className={styles.worksTxt}>Create a class</p>
          </div>
          <FontAwesomeIcon className={styles.worksArrow} icon={faArrowRight} />
          <div className={`${shared.sectionCard} ${styles.worksCard}`}>
            <FontAwesomeIcon className={styles.worksIcon} icon={faNoteSticky} />
            <p className={styles.worksTxt}>Upload notes and/or images</p>
          </div>
          <FontAwesomeIcon className={styles.worksArrow} icon={faArrowRight} />
          <div className={`${shared.sectionCard} ${styles.worksCard}`}>
            <FontAwesomeIcon className={styles.worksIcon} icon={faListCheck} />
            <p className={styles.worksTxt}>Get auto-generated quizzes</p>
          </div>
          <FontAwesomeIcon className={styles.worksArrow} icon={faArrowRight} />
          <div className={`${shared.sectionCard} ${styles.worksCard}`}>
            <FontAwesomeIcon className={styles.worksIcon} icon={faChartLine} />
            <p className={styles.worksTxt}>Track your progress</p>
          </div>
        </div>
      </div>
    </div>
  );
};
