import { Dispatch, SetStateAction } from "react";
import styles from "./ContentModal.module.scss";
import { QuizQuestionType } from "../../../Quiz/components/Quiz/components/QuizQuestion/QuizQuestion";
import { ContentType } from "../Content/components/contentItem/ContentItem";
import { useNavigate } from "react-router-dom";

type ContentModalProps = {
  ModalInfo: ContentType;
  ModalContent: QuizQuestionType[];
  setModalActive: Dispatch<SetStateAction<boolean>>;
};

export const ContentModal = ({
  ModalContent,
  ModalInfo,
  setModalActive,
}: ContentModalProps) => {
  const nav = useNavigate();

  return (
    <div>
      <div
        className={styles.modalBackground}
        onClick={() => setModalActive(false)}
      ></div>

      <div className={styles.modalWrapper}>
        <h2 className={styles.modalTitle}>Chapter 1 Quiz</h2>

        <div className={styles.infoWrapper}>
          <div className={styles.infoItem}>
            <p className={styles.infoTxt}>{ModalContent.length} Questions</p>
          </div>

          <div className={styles.infoItem}>
            <p className={styles.infoTxt}>
              Last Attempt: {ModalInfo.daysSince} days ago
            </p>
          </div>
        </div>

        <div className={styles.modalContent}>
          <ModalContentList ModalContent={ModalContent} />
          <div className={styles.contentRight}>
            <ModalStats />

            <button className={styles.modalCta} onClick={() => nav("/quiz")}>
              Start Quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

type ModalContentProps = {
  ModalContent: QuizQuestionType[];
};

const ModalContentList = ({ ModalContent }: ModalContentProps) => {
  return (
    <div className={styles.modalListWrapper}>
      <div className={styles.modalList}>
        {ModalContent.map((c, i) => (
          <div className={styles.listItem}>
            <p className={styles.itemTxt}>
              <span className={styles.itemIndex}>{i + 1}</span>
              {c.question}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

const ModalStats = () => {
  return (
    <div className={styles.statWrapper}>
      <p className={styles.statTitle}>Quiz Stats</p>

      <p className={styles.statTxt}>
        <span className={styles.statName}>Average Score</span>
        <span className={styles.statValue}>76%</span>
      </p>

      <p className={styles.statTxt}>
        <span className={styles.statName}>Average Time</span>
        <span className={styles.statValue}>4 min</span>
      </p>

      <p className={styles.statTxt}>
        <span className={styles.statName}>Best Score</span>
        <span className={styles.statValue}>92%</span>
      </p>

      <p className={styles.statTxt}>
        <span className={styles.statName}>Attempts</span>
        <span className={styles.statValue}>5</span>
      </p>
    </div>
  );
};
