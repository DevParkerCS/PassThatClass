import { Dispatch, SetStateAction, useEffect, useState } from "react";
import styles from "./ContentModal.module.scss";
import { useNavigate } from "react-router-dom";
import {
  ContentMeta,
  QuizMeta,
  QuizQuestionType,
} from "../../../../../../context/DataContext/types";
import { useDataContext } from "../../../../../../context/DataContext/DataContext";

type ContentModalProps = {
  contentId: string;
  classId: string;
  setModalActive: Dispatch<SetStateAction<boolean>>;
};

export const ContentModal = ({
  contentId,
  classId,
  setModalActive,
}: ContentModalProps) => {
  const nav = useNavigate();
  const data = useDataContext();
  const [content, setContent] = useState(data.questionsById[contentId]);
  const [meta, setMeta] = useState<QuizMeta>(data.quizMetaById[contentId]);

  useEffect(() => {
    setContent(data.questionsById[contentId]);
    setMeta(data.quizMetaById[contentId]);
  }, [data.questionsById, data.quizMetaById]);

  return (
    <div>
      <div
        className={styles.modalBackground}
        onClick={() => setModalActive(false)}
      ></div>

      <div className={styles.modalWrapper}>
        {!content || !meta ? (
          <div>Loading</div>
        ) : (
          <div>
            <h2 className={styles.modalTitle}>{meta.title}</h2>

            <div className={styles.infoWrapper}>
              <div className={styles.infoItem}>
                <p className={styles.infoTxt}>{meta.num_questions} Questions</p>
              </div>

              <div className={styles.infoItem}>
                <p className={styles.infoTxt}>Last Attempt: 2 days ago</p>
              </div>
            </div>

            <div className={styles.modalContent}>
              <ModalContentList ModalContent={content} />
              <div className={styles.contentRight}>
                <ModalStats info={meta} />

                <button
                  className={styles.modalCta}
                  onClick={() => nav(`/class/${classId}/quiz/${contentId}`)}
                >
                  Start Quiz
                </button>
              </div>
            </div>
          </div>
        )}
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
          <div className={styles.listItem} key={i}>
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

type ModalStatsProps = {
  info: QuizMeta;
};

const ModalStats = ({ info }: ModalStatsProps) => {
  return (
    <div className={styles.statWrapper}>
      <p className={styles.statTitle}>Quiz Stats</p>

      <p className={styles.statTxt}>
        <span className={styles.statName}>Average Score</span>
        <span className={styles.statValue}>{info.average_score}</span>
      </p>

      <p className={styles.statTxt}>
        <span className={styles.statName}>Average Time</span>
        <span className={styles.statValue}>{info.average_time_seconds}</span>
      </p>

      <p className={styles.statTxt}>
        <span className={styles.statName}>Best Score</span>
        <span className={styles.statValue}>{info.highest_score}</span>
      </p>

      <p className={styles.statTxt}>
        <span className={styles.statName}>Attempts</span>
        <span className={styles.statValue}>{info.attempts_count}</span>
      </p>
    </div>
  );
};
